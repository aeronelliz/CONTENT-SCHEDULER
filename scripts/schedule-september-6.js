import fs from "node:fs/promises";
import { schedulePhoto } from "../lib/meta.js";
const file = "content/batch-2026-09-06.json";
const posts = JSON.parse(await fs.readFile(file, "utf8"));
const token = process.env.META_PAGE_ACCESS_TOKEN;
const pageId = process.env.META_PAGE_ID;
if (!token || !pageId) throw new Error("Missing Meta secrets");
const endpoint = new URL("https://graph.facebook.com/v26.0/me");
endpoint.searchParams.set("fields", "id,name");
const response = await fetch(endpoint, {headers:{Authorization: `Bearer ${token}`}});
const page = await response.json();
if (!response.ok || page.id !== pageId || page.name !== "Plot Twist Pinoy") throw new Error("Page identity check failed");
for(const item of posts) {
 const encoded=await fs.readFile(item.imagePath+".base64","utf8");
 await fs.writeFile(item.imagePath,Buffer.from(encoded,"base64"));
}
for(const item of posts) {
 if(item.status !== "queued") {console.log("Skipping",item.id,item.status); continue;}
 item.status="submitting";
 await fs.writeFile(file,JSON.stringify(posts,null,2)+"\n");
 try {
  const result=await schedulePhoto({pageId,pageToken:token,...item});
  item.metaPostId=result.post_id || result.id;
  item.status="scheduled";
  item.scheduledAt=new Date().toISOString();
  console.log("META_ACCEPTED",item.id,item.metaPostId,item.publishAt);
 } catch(error) {
  item.status="error";
  item.error=error.message.split(token).join("[REDACTED]");
  console.error("META_REJECTED",item.id,item.error);
  await fs.writeFile(file,JSON.stringify(posts,null,2)+"\n");
  process.exitCode=1;
  break;
 }
 await fs.writeFile(file,JSON.stringify(posts,null,2)+"\n");
}
