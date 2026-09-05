import fs from "node:fs/promises";
import { schedulePhoto } from "../lib/meta.js";

const queueFile = new URL("../content/queue.json", import.meta.url);
const runId = process.env.GITHUB_RUN_ID || process.argv[2];
const pageId = process.env.META_PAGE_ID;
const pageToken = process.env.META_PAGE_ACCESS_TOKEN;

if (!runId) throw new Error("GITHUB_RUN_ID is required");

const queue = JSON.parse(await fs.readFile(queueFile, "utf8"));
const batch = queue.filter((item) => item.status === "processing" && item.processingRun === runId);

if (batch.length === 0) {
  console.log(`No locked posts for run ${runId}.`);
  process.exit(0);
}

if (!pageId) throw new Error("META_PAGE_ID is required");
if (!pageToken) throw new Error("META_PAGE_ACCESS_TOKEN is required");

for (const item of batch) {
  try {
    const result = await schedulePhoto({
      pageId,
      pageToken,
      text: item.text,
      imagePath: item.imagePath,
      imageUrl: item.imageUrl,
      publishAt: item.publishAt
    });
    item.status = "scheduled";
    item.metaPostId = result.id || result.post_id;
    item.scheduledAt = new Date().toISOString();
    delete item.error;
    console.log(`Scheduled ${item.id}.`);
  } catch (error) {
    item.status = "error";
    item.error = error.message;
    item.failedAt = new Date().toISOString();
    console.error(`Failed ${item.id}: ${error.message}`);
  }
  await fs.writeFile(queueFile, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
}

if (batch.some((item) => item.status === "error")) process.exitCode = 1;
