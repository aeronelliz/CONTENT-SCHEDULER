import fs from "node:fs/promises";
import path from "node:path";
import { DateTime } from "luxon";

const version = () => process.env.META_GRAPH_VERSION || "v26.0";
const graph = (pathname) => `https://graph.facebook.com/${version()}${pathname}`;
const baseUrl = () => {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_HOSTNAME) return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  throw new Error("APP_BASE_URL or RENDER_EXTERNAL_HOSTNAME is required");
};

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || `Meta API error ${response.status}`);
  }
  return payload;
}

export function oauthUrl(state) {
  const redirectUri = `${baseUrl()}/auth/meta/callback`;
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
    scope: "pages_show_list,pages_read_engagement,pages_manage_posts"
  });
  return `https://www.facebook.com/${version()}/dialog/oauth?${params}`;
}

export async function exchangeCode(code) {
  const redirectUri = `${baseUrl()}/auth/meta/callback`;
  const short = await jsonFetch(`${graph("/oauth/access_token")}?${new URLSearchParams({
    client_id: process.env.META_APP_ID,
    client_secret: process.env.META_APP_SECRET,
    redirect_uri: redirectUri,
    code
  })}`);
  const long = await jsonFetch(`${graph("/oauth/access_token")}?${new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.META_APP_ID,
    client_secret: process.env.META_APP_SECRET,
    fb_exchange_token: short.access_token
  })}`);
  return long.access_token;
}

export async function resolvePage(userToken) {
  const response = await jsonFetch(`${graph("/me/accounts")}?${new URLSearchParams({
    fields: "id,name,access_token,tasks",
    access_token: userToken
  })}`);
  const requested = process.env.META_PAGE_ID;
  const page = requested
    ? response.data.find((item) => item.id === requested)
    : response.data.find((item) => item.name.toLowerCase() === "plot twist pinoy") || response.data[0];
  if (!page) throw new Error("Plot Twist Pinoy was not returned by Meta. Check Page access and META_PAGE_ID.");
  return { pageId: page.id, pageName: page.name, pageToken: page.access_token };
}

export async function schedulePhoto({ pageId, pageToken, text, imagePath, imageUrl, publishAt }) {
  const target = DateTime.fromISO(publishAt, { setZone: true });
  if (!target.isValid || target <= DateTime.now()) throw new Error("publishAt must be a future ISO date-time");

  const form = new FormData();
  form.set("access_token", pageToken);
  form.set("caption", text);
  form.set("published", "false");
  form.set("scheduled_publish_time", String(Math.floor(target.toSeconds())));

  if (imageUrl) {
    form.set("url", imageUrl);
  } else if (imagePath) {
    const absolute = path.resolve(imagePath);
    const bytes = await fs.readFile(absolute);
    form.set("source", new Blob([bytes]), path.basename(absolute));
  } else {
    throw new Error("An imagePath or imageUrl is required");
  }

  return jsonFetch(graph(`/${pageId}/photos`), { method: "POST", body: form });
}
