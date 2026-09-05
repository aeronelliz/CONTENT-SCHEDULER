import fs from "node:fs/promises";
import { schedulePhoto } from "../lib/meta.js";

const file = "content/batch-2026-09-07-to-12.json";
const posts = JSON.parse(await fs.readFile(file, "utf8"));
const token = process.env.META_PAGE_ACCESS_TOKEN?.trim();
const pageId = process.env.META_PAGE_ID?.trim();

if (!token || !pageId) throw new Error("Missing Meta secrets");
if (posts.length !== 42) throw new Error(`Expected 42 posts, found ${posts.length}`);

const endpoint = new URL("https://graph.facebook.com/v26.0/me");
endpoint.searchParams.set("fields", "id,name");
const response = await fetch(endpoint, {
  headers: { Authorization: `Bearer ${token}` }
});
const page = await response.json();

if (!response.ok || page.error) {
  const code = page.error?.code ?? response.status;
  const type = page.error?.type ?? "Meta API error";
  throw new Error(`Page identity check failed: ${type} (code ${code})`);
}
if (String(page.id) !== pageId) {
  throw new Error("Page identity check failed: META_PAGE_ID does not match the token");
}
if (page.name?.trim().toLowerCase() !== "plot twist pinoy") {
  throw new Error(`Page identity check failed: connected Page is "${page.name || "unknown"}"`);
}

let failed = false;

for (const item of posts) {
  if (item.status === "scheduled") {
    console.log("Skipping already scheduled", item.id, item.metaPostId);
    continue;
  }
  if (item.status !== "queued") {
    console.log("Skipping non-queued", item.id, item.status);
    continue;
  }

  item.status = "submitting";
  await fs.writeFile(file, `${JSON.stringify(posts, null, 2)}\n`);

  try {
    const result = await schedulePhoto({
      pageId,
      pageToken: token,
      text: item.text,
      imagePath: item.imagePath,
      publishAt: item.publishAt
    });
    item.metaPostId = result.post_id || result.id;
    item.status = "scheduled";
    item.scheduledAt = new Date().toISOString();
    delete item.error;
    console.log("META_ACCEPTED", item.id, item.metaPostId, item.publishAt);
  } catch (error) {
    item.status = "error";
    item.error = error.message.split(token).join("[REDACTED]");
    item.failedAt = new Date().toISOString();
    console.error("META_REJECTED", item.id, item.error);
    failed = true;
  }

  await fs.writeFile(file, `${JSON.stringify(posts, null, 2)}\n`);
}

if (failed) process.exitCode = 1;
