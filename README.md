
# mtaiirus-proxy

Reverse proxy: `api.mtaiirus.workers.dev` → `rarestudy.in`

## Deploy in 3 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Login to Cloudflare
```bash
npx wrangler login
```

### 3. Deploy
```bash
npm run deploy
```

Your proxy will be live at:
👉 https://api.mtaiirus.workers.dev

## Local development
```bash
npm run dev
```
Opens a local tunnel at http://localhost:8787

## Project structure
```
mtaiirus-proxy/
├── src/
│   └── worker.js      ← proxy logic
├── wrangler.toml      ← cloudflare config
├── package.json       ← project config
└── README.md
```

## How it works
- All requests to api.mtaiirus.workers.dev/path are forwarded to rarestudy.in/path
- HTML responses have all rarestudy.in URLs rewritten to api.mtaiirus.workers.dev
- Host header is rewritten so the origin accepts the request
- Security headers (CSP, X-Frame-Options) are stripped so the proxy works cleanly
