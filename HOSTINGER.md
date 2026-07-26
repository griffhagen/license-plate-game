# Deploy to Hostinger Business Web Hosting

This app is a Node.js server (Express + Socket.IO + SQLite) that also serves the
built React client. Hostinger's Business web hosting plan supports Node.js apps
(up to 5 per account), so it can run — but read **Known risks** at the bottom
before you commit to it.

## 1. Push the current code

The build output (`dist/`) is gitignored, so Hostinger builds it on deploy.

```bash
git add package.json server/index.js HOSTINGER.md && git commit -m "Hostinger deploy config" && git push
```

## 2. Create the Node.js app in hPanel

hPanel → your website → **Advanced** → **Node.js** → **Create application**.

| Field | Value |
|---|---|
| **Source** | GitHub → `griffhagen/license-plate-game`, branch `main` |
| **Node version** | **22 or 24** — not 18 or 20 (see Known risks) |
| **Framework** | Express (or Other) |
| **Entry file** | `server/index.js` |

**There is no build step, by design.** Hostinger cannot build this app: it
installs with postinstall scripts disabled, which leaves esbuild's binary
without its executable bit, and it sets `NODE_ENV=production` itself, so npm
skips the devDependencies `vite` needs. The built client is therefore committed
to the repo in `dist/`. A deploy only installs dependencies and starts the
server.

The tradeoff: **run `npm run build` and commit `dist/` whenever you change
anything under `src/`**, or the deployed site keeps serving the old client.

## 3. Environment variables

None are required. The database defaults to `~/.license-plate-game/plates.db` —
outside the app directory, so redeploys don't erase your trips.

Set `DATABASE_PATH` only if you want the file somewhere else. (Note: hPanel's
environment-variable form has not reliably saved values here, which is exactly
why the default doesn't depend on it.)

## 4. Deploy and check

Deploy, then hit these on your domain:

- `https://yourdomain.com/api/health` → `{"ok":true}`
- `https://yourdomain.com/` → the game loads

Make sure SSL is on (hPanel → **Security** → **SSL**). The browser only gives
the app GPS coordinates over HTTPS, so plate locations silently fail on `http://`.

## Known risks

**Node version.** The database uses `node:sqlite`, built into Node, so nothing
needs to compile on the host — but it requires **Node 22.13 or newer**. If you
pick Node 18 or 20 in hPanel the app will crash on boot with
`Cannot find module 'node:sqlite'`. Choose 22 or 24.

**WebSockets may not upgrade** through Hostinger's LiteSpeed reverse proxy.
Socket.IO handles this on its own — it starts on HTTP long-polling and upgrades
only if the proxy allows it — so live updates between players keep working
either way, just with more requests if it stays on polling. There's one server
process, so there's no sticky-session problem.

**Shared hosting may idle or restart the process.** SQLite data lives in
`DATABASE_PATH` and survives restarts, but use the in-game **Export** button on
long trips regardless.

## If the build step won't cooperate

Build locally and upload the result instead:

```bash
npm ci && npm run build
```

Then remove `dist/` from [.gitignore](.gitignore), commit `dist/`, and redeploy —
Hostinger only needs to run `npm install --include=dev` (or upload the whole
folder including `node_modules/` via SFTP and skip the build entirely).

## Local development

Any Node 22.13+ works, including the Node 26 on your machine. There is no native
module to rebuild when you switch versions.
