import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve(process.env.DATA_DIR || "data");
const queueFile = path.join(dataDir, "queue.json");
const tokenFile = path.join(dataDir, "meta-token.enc.json");

async function ensureData() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(queueFile); }
  catch { await fs.writeFile(queueFile, "[]\n", "utf8"); }
}

function encryptionKey() {
  const source = process.env.TOKEN_ENCRYPTION_KEY;
  if (!source) throw new Error("TOKEN_ENCRYPTION_KEY is required");
  return crypto.createHash("sha256").update(source).digest();
}

export async function saveConnection(connection) {
  await ensureData();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(connection), "utf8"),
    cipher.final()
  ]);
  await fs.writeFile(tokenFile, JSON.stringify({
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64")
  }, null, 2));
}

export async function loadConnection() {
  await ensureData();
  const raw = JSON.parse(await fs.readFile(tokenFile, "utf8"));
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(raw.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(raw.tag, "base64"));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(raw.data, "base64")),
    decipher.final()
  ]).toString("utf8"));
}

export async function connectionExists() {
  try { await fs.access(tokenFile); return true; }
  catch { return false; }
}

export async function readQueue() {
  await ensureData();
  return JSON.parse(await fs.readFile(queueFile, "utf8"));
}

export async function writeQueue(queue) {
  await ensureData();
  await fs.writeFile(queueFile, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
}

export async function addQueueItems(items) {
  const queue = await readQueue();
  queue.push(...items);
  await writeQueue(queue);
  return items;
}
