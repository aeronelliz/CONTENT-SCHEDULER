# Plot Twist Pinoy Meta Direct Scheduler

A private Node.js service that schedules photo posts directly to the Plot Twist Pinoy Facebook Page through the Meta Graph API. It does not use Metricool.

## Recommended: deploy on Render

The repository includes `render.yaml`, which creates one Docker web service in Render's Singapore region with a 1 GB persistent disk, health checks, generated security keys, and Philippine-time scheduling.

1. Create a private GitHub repository and upload this project to its root.
2. In Render, choose **New > Blueprint** and connect that repository.
3. Enter `META_APP_ID`, `META_APP_SECRET`, and `META_PAGE_ID` when Render prompts for secret values.
4. Create the Blueprint and wait for the health check to pass.
5. Copy the resulting `https://...onrender.com` address.
6. In Meta for Developers, add this OAuth redirect URI exactly:
   `https://YOUR-SERVICE.onrender.com/auth/meta/callback`
7. Open the Render service's Environment page and copy the generated `ADMIN_KEY` value.
8. Open the service URL, enter `ADMIN_KEY`, and connect Plot Twist Pinoy.

The persistent disk requires a paid Render web-service plan. This is intentional: a free service can suspend when idle and is unsuitable for a midnight scheduler. Render supplies `RENDER_EXTERNAL_HOSTNAME`, so `APP_BASE_URL` does not need to be entered manually.

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
