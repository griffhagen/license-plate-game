# Deploy to Render

Host the app so anyone can play from one URL (HTTPS, multiplayer, iPhone home screen).

## Before you deploy

1. **Plate images** must be in the repo:

   ```bash
   npm run plates
   git add public/plates
   ```

2. **Push to GitHub** (create a repo at [github.com/new](https://github.com/new), then):

   ```bash
   cd "/Users/griffinhagen/Desktop/License Plate Game"
   git init
   git add .
   git commit -m "License plate game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/license-plate-game.git
   git push -u origin main
   ```

## Option A — Blueprint (fastest)

1. Sign in at [render.com](https://render.com) with GitHub.
2. **New +** → **Blueprint**.
3. Connect the repo; Render reads `render.yaml`.
4. Click **Apply** and wait for the first deploy (~3–5 min).
5. Open the URL Render gives you (e.g. `https://license-plate-game-xxxx.onrender.com`).

## Option B — Manual web service

1. **New +** → **Web Service** → connect the repo.
2. Settings:

   | Field | Value |
   |--------|--------|
   | **Runtime** | Node |
   | **Build Command** | `npm install --include=dev && npm run build` |
   | **Start Command** | `npm start` |
   | **Health Check Path** | `/api/health` |

3. **Environment** → add:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |

4. Create Web Service and wait for deploy.

## Free vs paid

| Plan | Cost | Notes |
|------|------|--------|
| **Free** | $0 | Spins down after ~15 min idle; cold start ~30s; game DB resets on redeploy |
| **Starter** | ~$7/mo | Always on; better for road trips |

To **keep game data** across deploys (paid):

1. Web Service → **Disks** → add disk, mount path `/var/data`.
2. Add env var `DATABASE_PATH` = `/var/data/plates.db`.
3. Redeploy.

## After deploy

- Share the Render URL; friends use **Join Game** with the code or link.
- On iPhone: Safari → **Share** → **Add to Home Screen** (HTTPS is required for GPS).
- Redeploys: push to `main`; Render rebuilds automatically if auto-deploy is on.

## Troubleshooting

- **Build fails with `vite: not found`** — build must install dev deps: `npm install --include=dev && npm run build` (already in `render.yaml`).
- **Build fails on `better-sqlite3`** — ensure Runtime is **Node** (not Docker static).
- **Blank page** — check deploy logs; confirm build finished and `dist/` exists.
- **WebSockets not updating** — use the Render HTTPS URL, not `http://`.
- **Location denied on phone** — only works on HTTPS (Render provides this).
