import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import express from "express";
import multer from "multer";
import cron from "node-cron";
import { DateTime } from "luxon";
import { addQueueItems, connectionExists, loadConnection, readQueue, saveConnection, writeQueue } from "./lib/store.js";
import { exchangeCode, oauthUrl, resolvePage, schedulePhoto } from "./lib/meta.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const timezone = process.env.TIMEZONE || "Asia/Manila";
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 15 * 1024 * 1024 } });
const oauthStates = new Map();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_KEY || req.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/status", async (_req, res) => {
  res.json({ connected: await connectionExists(), timezone });
});

app.post("/api/connect", requireAdmin, (_req, res) => {
  const state = crypto.randomBytes(24).toString("hex");
  oauthStates.set(state, Date.now() + 10 * 60 * 1000);
  res.json({ url: oauthUrl(state) });
});

app.get("/auth/meta/callback", async (req, res) => {
  try {
    const expiry = oauthStates.get(req.query.state);
    oauthStates.delete(req.query.state);
    if (!expiry || expiry < Date.now()) return res.status(400).send("Invalid or expired OAuth state.");
    const userToken = await exchangeCode(req.query.code);
    const page = await resolvePage(userToken);
    await saveConnection(page);
    res.send(`Connected to ${page.pageName}. You may close this tab.`);
  } catch (error) {
    res.status(400).send(`Meta connection failed: ${error.message}`);
  }
});

app.get("/api/queue", requireAdmin, async (_req, res) => res.json(await readQueue()));

app.post("/api/queue", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const item = {
      id: crypto.randomUUID(),
      text: req.body.text,
      publishAt: req.body.publishAt,
      imagePath: req.file?.path,
      imageUrl: req.body.imageUrl || undefined,
      status: "queued",
      createdAt: new Date().toISOString()
    };
    if (!item.text || !item.publishAt || (!item.imagePath && !item.imageUrl)) {
      return res.status(400).json({ error: "text, publishAt, and an image are required" });
    }
    await addQueueItems([item]);
    res.status(201).json(item);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.post("/api/batch", requireAdmin, async (req, res) => {
  const times = (process.env.DAILY_POST_TIMES || "08:00,10:00,12:00,14:00,16:30,19:00,22:00").split(",");
  if (!Array.isArray(req.body.posts) || req.body.posts.length !== 7) {
    return res.status(400).json({ error: "Exactly seven posts are required" });
  }
  const items = req.body.posts.map((post, index) => ({
    id: crypto.randomUUID(),
    text: post.text,
    imagePath: post.imagePath,
    imageUrl: post.imageUrl,
    publishAt: DateTime.fromISO(`${req.body.date}T${times[index]}`, { zone: timezone }).toISO(),
    status: "queued",
    createdAt: new Date().toISOString()
  }));
  await addQueueItems(items);
  res.status(201).json(items);
});

async function processQueue() {
  if (!(await connectionExists())) return { scheduled: 0, reason: "Meta is not connected" };
  const connection = await loadConnection();
  const queue = await readQueue();
  let scheduled = 0;
  for (const item of queue.filter((entry) => entry.status === "queued")) {
    try {
      const result = await schedulePhoto({ ...connection, ...item });
      item.status = "scheduled";
      item.metaPostId = result.id || result.post_id;
      item.scheduledAt = new Date().toISOString();
      scheduled += 1;
    } catch (error) {
      item.status = "error";
      item.error = error.message;
    }
    await writeQueue(queue);
  }
  return { scheduled };
}

app.post("/api/schedule", requireAdmin, async (_req, res) => res.json(await processQueue()));

cron.schedule(process.env.DAILY_SCHEDULE_CRON || "0 0 * * *", () => {
  processQueue().catch((error) => console.error("Daily scheduling failed", error));
}, { timezone });

app.listen(port, () => console.log(`Plot Twist Pinoy scheduler listening on port ${port}`));
