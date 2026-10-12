# EcoBay Air Command

Redesigned companion interface for the **SN-3001-MG111-WIFI** multifunction air quality
transmitter — BLE device pairing, WiFi provisioning, parameter recall / dispatch
(召唤参数 / 下发参数), and a live 11-element monitoring deck.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts

> Demo note: device connection, parameter recall, and live readings are simulated
> in the browser. All parameter names, ranges, units, and node mappings follow the
> SN-3001-MG111-WIFI product manual (Ver 2.0).

---

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production build

```bash
npm ci             # clean, reproducible install (same as CI)
npm run build      # outputs static site to ./dist
```

---

## Deploy to Cloudflare Pages (Git-connected)

1. Push this repository to GitHub — the repo root must directly contain
   `package.json`, `package-lock.json`, `src/`, `index.html` (no extra nesting folder).
2. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** →
   **Import an existing Git repository** → pick the repo.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Vite (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank — project is at repo root)* |

4. **Save and Deploy** → live at `https://<project>.pages.dev`.
   Every push to the production branch redeploys automatically.

No SPA redirect rules needed — the app uses hash routing.

### Important

- **Always commit `package.json` and `package-lock.json` together.** Cloudflare
  installs with `npm ci`, which fails if the two files are out of sync.
- Node.js 20+ recommended (Cloudflare's current default works out of the box).

## Deploy to Cloudflare Pages (drag & drop, no Git)

```bash
npm ci && npm run build
```

Then: **Workers & Pages** → **Create application** → **Pages** → **drag-and-drop** →
upload the `dist/` folder.

## Deploy via Wrangler CLI (Workers Static Assets)

A ready `wrangler.jsonc` is included:

```bash
npm run build
npx wrangler login
npx wrangler deploy     # live at https://ecobay-air-command.<subdomain>.workers.dev
```
