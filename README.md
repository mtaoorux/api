
# Reverse Proxy — api.mtaiirus.workers.dev → rarestudy.in

## What this does
All requests to `https://api.mtaiirus.workers.dev/...` are forwarded to
`https://rarestudy.in/...` and served back to the user. The browser always
sees `api.mtaiirus.workers.dev` in the address bar.

## Setup

### 1. Install Wrangler (Cloudflare CLI)
```bash
npm install -g wrangler
```

### 2. Log in to Cloudflare
```bash
wrangler login
```

### 3. Deploy
```bash
wrangler deploy
```

Your worker will be live at:
`https://api.mtaiirus.workers.dev`

## Files
- `worker.js` — the proxy logic
- `wrangler.toml` — deployment config

## How it works
1. Request hits `api.mtaiirus.workers.dev`
2. Worker rewrites the `Host` header to `rarestudy.in` and fetches from origin
3. For HTML responses, all `rarestudy.in` URLs are rewritten back to `api.mtaiirus.workers.dev`
4. Response is returned to the user

## Adding a custom domain later
Uncomment the `[[routes]]` section in `wrangler.toml` and fill in your domain.
