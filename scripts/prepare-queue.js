import fs from "node:fs/promises";
import { DateTime } from "luxon";

const queueFile = new URL("../content/queue.json", import.meta.url);
const timezone = process.env.TIMEZONE || "Asia/Manila";
const runId = process.env.GITHUB_RUN_ID || `local-${Date.now()}`;
const today = DateTime.now().setZone(timezone).toISODate();
const queue = JSON.parse(await fs.readFile(queueFile, "utf8"));

const candidates = queue.filter((item) => {
  if (item.status !== "queued") return false;
  const target = DateTime.fromISO(item.publishAt, { setZone: true }).setZone(timezone);
  return target.isValid && target.toISODate() === today;
});

if (candidates.length === 0) {
  console.log(`No queued posts for ${today}.`);
  process.exit(0);
}

if (candidates.length !== 7) {
  throw new Error(`Expected exactly 7 queued posts for ${today}, found ${candidates.length}. Nothing was locked or scheduled.`);
}

for (const item of candidates) {
  item.status = "processing";
  item.processingRun = runId;
  item.lockedAt = new Date().toISOString();
}

await fs.writeFile(queueFile, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
console.log(`Locked 7 posts for ${today} in run ${runId}.`);
