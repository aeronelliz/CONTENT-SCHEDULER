import fs from "node:fs/promises";
import { schedulePhoto } from "../lib/meta.js";

const oldFile = "content/batch-2026-09-06.json";
const newFile = "content/batch-2026-09-06-drama.json";
const oldPosts = JSON.parse(await fs.readFile(oldFile, "utf8"));
const newPosts = JSON.parse(await fs.readFile(newFile, "utf8"));
const token = process.env.META_PAGE_ACCESS_TOKEN;
const pageId = process.env.META_PAGE_ID;
const version = process.env.META_GRAPH_VERSION || "v26.0";

if (!token || !pageId) throw new Error("Missing Meta secrets");
if (newPosts.length !== 7) throw new Error("Replacement batch must contain exactly seven posts");

const identityUrl = new URL(`https://graph.facebook.com/${version}/me`);
identityUrl.searchParams.set("fields", "id,name");
const identityResponse = await fetch(identityUrl, {
  headers: { Authorization: `Bearer ${token}` }
});
const page = await identityResponse.json();
if (!identityResponse.ok || page.error) {
  throw new Error(`Meta connection failed: ${page.error?.message || `HTTP ${identityResponse.status}`}`);
}
if (String(page.id) !== String(pageId)) {
  throw new Error("The access token does not belong to META_PAGE_ID");
}
console.log("META_PAGE_VERIFIED", page.name);

const redact = (message) => String(message).split(token).join("[REDACTED]");
const saveOld = () => fs.writeFile(oldFile, `${JSON.stringify(oldPosts, null, 2)}\n`);
const saveNew = () => fs.writeFile(newFile, `${JSON.stringify(newPosts, null, 2)}\n`);

const cancellationErrors = [];
for (const item of oldPosts) {
  if (item.status !== "scheduled" || !item.metaPostId) continue;
  item.status = "cancelling";
  await saveOld();
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${encodeURIComponent(item.metaPostId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const payload = await response.json();
    if (!response.ok || payload.error || payload.success !== true) {
      throw new Error(payload.error?.message || `Meta deletion failed with status ${response.status}`);
    }
    item.status = "cancelled";
    item.cancelledAt = new Date().toISOString();
    console.log("META_CANCELLED", item.id, item.metaPostId);
  } catch (error) {
    item.status = "cancel_error";
    item.cancelError = redact(error.message);
    cancellationErrors.push(`${item.id}: ${item.cancelError}`);
    console.error("META_CANCEL_REJECTED", item.id, item.cancelError);
  }
  await saveOld();
}

if (cancellationErrors.length) {
  throw new Error(`Replacement stopped because cancellation failed: ${cancellationErrors.join(" | ")}`);
}

for (const item of newPosts) {
  if (item.status !== "queued") continue;
  item.status = "submitting";
  await saveNew();
  try {
    const result = await schedulePhoto({ pageId, pageToken: token, ...item });
    item.metaPostId = result.post_id || result.id;
    item.status = "scheduled";
    item.scheduledAt = new Date().toISOString();
    console.log("META_ACCEPTED", item.id, item.metaPostId, item.publishAt);
  } catch (error) {
    item.status = "error";
    item.error = redact(error.message);
    console.error("META_REJECTED", item.id, item.error);
    await saveNew();
    process.exitCode = 1;
    break;
  }
  await saveNew();
}
