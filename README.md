# License Plate Game

A multiplayer road-trip web app to spot all **50 U.S. state license plates**. Install it on your iPhone home screen (PWA), start a trip, share a code with family, and track finds with location, rarity scores, and state fun facts.

## Features

- **Multiplayer** — Create a trip, share a link or game code; everyone sees live updates
- **PWA** — Add to Home Screen on iPhone for a full-screen app experience
- **Location** — When you mark a plate, your GPS position is saved (with a readable place name when possible)
- **Stats** — Plates found, remaining, rarity score, toughest plate still out there
- **Fun facts** — Tap any state for trivia; rare plates (HI, AK, WY, etc.) are highlighted
- **Plate images** — Real reference images for each state’s standard plate in the tracker
- **Map view** — See every GPS-tagged find plotted on an interactive map

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** on your phone (same Wi‑Fi) or computer. The API and WebSocket server run on port **3001**; Vite proxies `/api` and `/socket.io`.

### iPhone home screen

1. Open the site in **Safari**
2. Tap **Share** → **Add to Home Screen**
3. Launch from the icon for standalone mode

## Production (local)

```bash
npm run build
npm start
```

Serves the built app and API on port **3001** (set `PORT` if needed). Use HTTPS in production so geolocation works reliably on mobile.

## Deploy on Render (share with anyone)

Step-by-step guide: **[DEPLOY.md](DEPLOY.md)**

Quick version: push to GitHub → [Render](https://render.com) → **New Blueprint** → select repo → deploy. Friends use the `https://….onrender.com` URL.

## How to play

1. **Start Game** — Name your trip and enter your name
2. **Invite players** — Share the game code or link from the invite panel
3. **Spot plates** — Tap a state when someone sees that plate; confirm to log location
4. **Compete** — Rarity score rewards harder states (Hawaii = 10/10)
5. **Map tab** — View where your crew spotted plates (requires location permission when marking finds)

Plate images are bundled locally in `public/plates/` (served from `/plates/…`). They come from the official state plates on [The US50](https://theus50.com/fastfacts/licenses-state.php) (photos © Jim Moini, used for educational reference).

To refresh all 50 images:

```bash
npm run plates
```

## Tech stack

- React + Vite + `vite-plugin-pwa`
- Express + Socket.io + SQLite (`better-sqlite3`)

Game data is stored in `server/plates.db`. Each state can only be found once per game (first spot wins).
