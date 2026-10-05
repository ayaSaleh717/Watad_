# Watad admin dashboard

React + Tailwind dashboard (Arabic / English, RTL / LTR) for the Watad site. The API lives in `../server`.

- **Overview** – unique visitors, page views, today / last 7 days, a daily chart (7 / 30 / 90 days), languages, top pages, traffic sources.
- **Prices** – edit every price card (value, units, names, labels, figure, color), reorder / add / remove cards, the "last update" date, and the Brent chart months.
- **Stations** – add, edit, reorder and remove stations (Arabic + English side by side).
- **Products** – edit the products section shown on the public site.

Edits are saved to the API and show up on the public site straight away (the site already reads `/api/content`).

## Run it

```bash
cd dashboard
npm install
# Set ADMIN_PASSWORD and PORT in ../server/.env
npm run dev
```

| What | URL |
| --- | --- |
| Dashboard | http://localhost:5174 |
| API (the site's `VITE_API_BASE_URL` default) | http://localhost:4100 |
| Public site (`cd ../client && npm run dev`) | http://localhost:5173 |

`npm run dev` starts both the API from `../server` and the dashboard. The API reads `ADMIN_PASSWORD` and `PORT` from `../server/.env` (or from real environment variables, which take priority). During transition it also accepts `dashboard/.env` as a fallback.

If port `4100` is already in use, set another value in `../server/.env`, for example `PORT=4101`, then restart `npm run dev`. The dashboard dev proxy reads the same value.

If `ADMIN_PASSWORD` is not set the password is `admin123` and the server prints a warning. Change it before going live.

## How it connects to the site

The site (`client/`) already calls two endpoints, and this API provides them:

- `GET /api/content` – the full site content. Starts from `../server/seed-content.json` and is then stored in `../server/data/content.json`.
- `POST /api/visits` – one call per page view, sent by `reportSiteVisit` in the site.

Admin endpoints (`/api/admin/*`) need a signed token from `POST /api/admin/login` (valid 12 hours).

## What the numbers mean

- **Page views** – every page load, route change and language switch on the site.
- **Unique visitors** – distinct browsers (the id the site stores in `localStorage`). Someone clearing storage counts again.
- In `npm run dev` React StrictMode runs effects twice, so local visits can look doubled. Production builds don't.

## Production

```bash
npm run build                      # builds the dashboard into dist/
npm start                          # serves API + dashboard on one port (default 4100)
```

- Put it behind HTTPS (nginx, Caddy, etc.). The password and token travel in requests.
- Build the public site with `VITE_API_BASE_URL=https://your-api-host` so it stops pointing at `localhost:4100`.
- If the dashboard is hosted somewhere else, build it with `VITE_API_BASE_URL` too, and `VITE_SITE_URL` for the "View site" link.
- Back up `../server/data/` (content, visits and the signing secret). Keep it out of git.

## Layout

```
dashboard/
  src/                     React app (pages/, components/, dict.ts for translations)
server/
  index.js                 API (no dependencies, Node 18+)
  seed-content.json        first-run content
  data/                    runtime content, visits and signing secret
```
