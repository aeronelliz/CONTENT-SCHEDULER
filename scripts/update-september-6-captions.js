import fs from "node:fs/promises";

const file = "content/batch-2026-09-06.json";
const posts = JSON.parse(await fs.readFile(file, "utf8"));
const token = process.env.META_PAGE_ACCESS_TOKEN;
const pageId = process.env.META_PAGE_ID;
const version = process.env.META_GRAPH_VERSION || "v26.0";

if (!token || !pageId) throw new Error("Missing Meta secrets");

const pageResponse = await fetch(
  `https://graph.facebook.com/${version}/me?fields=id,name`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const page = await pageResponse.json();
if (!pageResponse.ok || page.id !== pageId || page.name !== "Plot Twist Pinoy") {
  throw new Error("Page identity check failed");
}

async function submitUpdate(post, field) {
  const body = new URLSearchParams({
    access_token: token,
    [field]: post.text
  });
  const response = await fetch(
    `https://graph.facebook.com/${version}/${encodeURIComponent(post.metaPostId)}`,
    { method: "POST", body }
  );
  const payload = await response.json();
  return { response, payload };
}

for (const post of posts) {
  if (post.status !== "scheduled" || !post.metaPostId) continue;

  let result = await submitUpdate(post, "message");
  if (!result.response.ok || result.payload.error) {
    result = await submitUpdate(post, "caption");
  }
  if (!result.response.ok || result.payload.error || result.payload.success === false) {
    const message = result.payload.error?.message || `Meta API error ${result.response.status}`;
    throw new Error(`Could not update ${post.id}: ${message}`);
  }
  console.log("CAPTION_UPDATED", post.id, post.metaPostId);
}
