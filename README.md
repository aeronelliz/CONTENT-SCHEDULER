# Plot Twist Pinoy Meta Direct Scheduler

A private Node.js service that schedules photo posts directly to the Plot Twist Pinoy Facebook Page through the Meta Graph API. It does not use Metricool.

## Recommended: free GitHub Actions scheduler

The repository includes `.github/workflows/schedule-facebook.yml`. It runs daily at 16:00 UTC, which is 12:00 AM the following day in the Philippines.

### One-time setup

In **GitHub > CONTENT-SCHEDULER > Settings > Secrets and variables > Actions**, create these repository secrets:

- `META_PAGE_ID`
- `META_PAGE_ACCESS_TOKEN`

Never put the token in `queue.json`, `.env`, a commit, an issue, or ChatGPT.

### Add each day's seven posts

1. Put poster images in `content/images/`, or use public HTTPS image URLs.
2. Add exactly seven entries for the target Philippine date to `content/queue.json`.
3. Use the ISO format `YYYY-MM-DDTHH:MM:SS+08:00` for `publishAt`.
4. Leave each new entry's `status` as `queued`.

At midnight, the workflow first commits a processing lock. It then schedules each photo through Meta and commits the resulting Meta post ID or error. This lock prevents an automatic rerun from duplicating a batch.

You can test it using **Actions > Schedule seven Facebook posts > Run workflow** after the seven entries and secrets are ready.

GitHub's scheduled workflow start time can be delayed during heavy demand. This does not change the Facebook publishing times because the workflow sends each post's future `publishAt` time to Meta.

## Optional paid hosting

The Docker, VPS, and Render files remain available if you later want a web dashboard. They are not required for the free GitHub Actions scheduler.

## What it does

- Connects a Facebook Page through Meta OAuth.
- Requests only `pages_show_list`, `pages_read_engagement`, and `pages_manage_posts`.
- Encrypts the Page access token at rest.
- Queues caption-and-image posts.
- Accepts a seven-post batch and assigns the configured daily times.
- Sends unpublished scheduled photo posts to Meta.
- Runs automatically at 12:00 AM in `Asia/Manila` by default.

## 1. Create the Meta app

1. Open Meta for Developers and create a **Business** app.
2. Add **Facebook Login for Business**.
3. Add this exact OAuth redirect URI:
   `https://YOUR-DOMAIN/auth/meta/callback`
4. Request these permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
5. Add your Facebook account as an app administrator or tester while the app is in Development mode.

For use beyond app-role accounts, Meta may require Advanced Access and App Review.

## VPS prerequisites

- Ubuntu 22.04, 24.04, or a comparable Linux distribution
- Docker Engine with the Compose plugin
- A domain or subdomain with an `A` record pointing to the VPS
- Inbound TCP ports `80` and `443` open

The included Caddy service obtains and renews HTTPS certificates automatically.

## 2. Configure

Copy `.env.example` to `.env`, set `DOMAIN` and `APP_BASE_URL` to the same public hostname, and enter the Meta app values. Never commit `.env`.

Generate secure values locally:

```bash
openssl rand -hex 32
```

Use separate generated values for `TOKEN_ENCRYPTION_KEY` and `ADMIN_KEY`.

## 3. Deploy on your VPS

Upload the project folder to the VPS, then run:

```bash
cp .env.example .env
nano .env
chmod +x deploy.sh
./deploy.sh
```

To inspect the service:

```bash
docker compose ps
docker compose logs --tail=100 scheduler
docker compose logs --tail=100 caddy
```

To update after replacing the project files:

```bash
docker compose build --pull
docker compose up -d
```

## Local development

```bash
npm install
npm start
```

Run locally with Docker:

```bash
docker build -t plot-twist-pinoy-scheduler .
docker run --env-file .env -p 3000:3000 plot-twist-pinoy-scheduler
```

The included VPS Compose configuration mounts `/app/data` and `/app/uploads` as persistent Docker volumes.

## 4. Connect Plot Twist Pinoy

Open the deployed website, enter `ADMIN_KEY`, and choose **Connect Facebook Page**. Approve access using the Facebook profile that manages Plot Twist Pinoy.

## Seven daily time slots

The defaults are:

1. 8:00 AM
2. 10:00 AM
3. 12:00 PM
4. 2:00 PM
5. 4:30 PM
6. 7:00 PM
7. 10:00 PM

Change `DAILY_POST_TIMES` in `.env` if needed. The midnight task schedules every queued item; it does not invent content. Add seven approved posters and captions to the queue before midnight.

## Important

- Do not paste Meta app secrets or access tokens into ChatGPT.
- Keep crime-related captions factual, avoid graphic imagery, and label allegations, theories, and urban legends clearly.
- Meta can change Graph API permissions and scheduling rules. If an API error occurs, the queue records the exact error and does not silently retry the post.
