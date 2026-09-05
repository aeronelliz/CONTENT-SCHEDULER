const pageId = process.env.META_PAGE_ID;
const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
const graphVersion = process.env.META_GRAPH_VERSION || "v26.0";

if (!pageId) throw new Error("META_PAGE_ID is missing");
if (!pageToken) throw new Error("META_PAGE_ACCESS_TOKEN is missing");

const endpoint = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}`);
endpoint.searchParams.set("fields", "id,name");
endpoint.searchParams.set("access_token", pageToken);

const response = await fetch(endpoint);
const result = await response.json();

if (!response.ok || result.error) {
  const message = result.error?.message || `Meta returned HTTP ${response.status}`;
  throw new Error(`Meta connection failed: ${message}`);
}

if (String(result.id) !== String(pageId)) {
  throw new Error("Meta returned a different Page ID");
}

console.log(`Connection verified for Facebook Page: ${result.name} (${result.id})`);
