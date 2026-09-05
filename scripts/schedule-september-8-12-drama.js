import fs from "node:fs/promises";
import { resolvePage, schedulePhoto } from "../lib/meta.js";

const batchFile = new URL("../content/batch-2026-09-08-12-drama.json", import.meta.url);
const queueFile = new URL("../content/queue.json", import.meta.url);
const plannerFile = new URL("../public/planner-data.json", import.meta.url);
const configuredPageId = process.env.META_PAGE_ID;
const configuredToken = process.env.META_PAGE_ACCESS_TOKEN;

if (!configuredPageId) throw new Error("META_PAGE_ID is required");
if (!configuredToken) throw new Error("META_PAGE_ACCESS_TOKEN is required");

let pageId = configuredPageId;
let pageToken = configuredToken;
let resolvedPageToken = false;

try {
  const page = await resolvePage(configuredToken);
  pageId = page.pageId;
  pageToken = page.pageToken;
  resolvedPageToken = true;
  console.log(`Resolved ${page.pageName} as Page ${page.pageId}.`);
} catch (error) {
  console.log(`Page-token auto-resolution was unavailable; using the configured token directly. ${error.message}`);
}

const batch = JSON.parse(await fs.readFile(batchFile, "utf8"));
const queue = JSON.parse(await fs.readFile(queueFile, "utf8"));
const planner = JSON.parse(await fs.readFile(plannerFile, "utf8"));

if (batch.length !== 35) throw new Error(`Expected 35 posts, found ${batch.length}.`);
if (new Set(batch.map((item) => item.id)).size !== 35) throw new Error("Duplicate post IDs found.");
if (new Set(batch.map((item) => item.title)).size !== 35) throw new Error("Duplicate titles found.");
if (new Set(batch.map((item) => item.text)).size !== 35) throw new Error("Duplicate captions found.");

for (const date of ["2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-12"]) {
  const count = batch.filter((item) => item.publishAt.startsWith(date)).length;
  if (count !== 7) throw new Error(`Expected 7 posts for ${date}, found ${count}.`);
}

for (const item of batch) await fs.access(new URL(`../${item.imagePath}`, import.meta.url));

async function saveState() {
  await Promise.all([
    fs.writeFile(batchFile, `${JSON.stringify(batch, null, 2)}\n`, "utf8"),
    fs.writeFile(queueFile, `${JSON.stringify(queue, null, 2)}\n`, "utf8"),
    fs.writeFile(plannerFile, `${JSON.stringify(planner, null, 2)}\n`, "utf8")
  ]);
}

let failures = 0;
for (const item of batch) {
  if (item.status === "scheduled") {
    console.log(`Skipping already scheduled ${item.id}.`);
    continue;
  }

  try {
    const result = await schedulePhoto({
      pageId,
      pageToken,
      text: item.text,
      imagePath: item.imagePath,
      publishAt: item.publishAt
    });
    item.status = "scheduled";
    item.metaPostId = result.id || result.post_id;
    item.scheduledAt = new Date().toISOString();
    delete item.error;
    delete item.failedAt;
    console.log(`Scheduled ${item.id} as ${item.metaPostId}.`);
  } catch (error) {
    const credentialError = /access token|session has expired|posted to a page as the page itself/i.test(error.message);
    item.status = credentialError ? "queued" : "error";
    item.error = error.message;
    item.failedAt = new Date().toISOString();
    failures += 1;
    console.error(`Failed ${item.id}: ${error.message}`);
  }

  const queueItem = queue.find((candidate) => candidate.id === item.id);
  if (!queueItem) throw new Error(`Queue entry missing for ${item.id}.`);
  Object.assign(queueItem, item);

  const plannerItem = planner.find((candidate) => candidate.id === item.id);
  if (!plannerItem) throw new Error(`Planner entry missing for ${item.id}.`);
  plannerItem.status = item.status;
  if (item.metaPostId) plannerItem.metaPostId = item.metaPostId;
  if (item.scheduledAt) plannerItem.scheduledAt = item.scheduledAt;
  if (item.error) plannerItem.error = item.error;
  else delete plannerItem.error;

  await saveState();
  if (item.status === "queued") {
    const guidance = resolvedPageToken
      ? "Refresh the GitHub Meta secrets before rerunning."
      : "Use a Page access token, or a user token with pages_show_list and pages_manage_posts, in META_PAGE_ACCESS_TOKEN.";
    throw new Error(`Meta credentials cannot schedule Page posts. Remaining posts were left queued. ${guidance}`);
  }
}

const scheduled = batch.filter((item) => item.status === "scheduled").length;
console.log(`Completed range batch: ${scheduled}/35 scheduled, ${failures} failed.`);
if (failures > 0 || scheduled !== 35) process.exitCode = 1;
