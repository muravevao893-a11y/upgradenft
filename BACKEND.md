# Temporary Docker Backend

Minimal backend for your current Mini App frontend.

## What it provides

- `POST /upgrade/prepare`
- `POST /upgrade/resolve`
- `POST /upgrade/abort`
- `GET /telegram/gifts`
- `GET /telegram-gifts`
- `GET /gifts`
- `GET /health`

This backend is in-memory (temporary). After container restart, sessions are reset.

## Run

```bash
docker compose up -d --build upnft-backend
```

Backend URL:

```text
http://localhost:8787
```

## Connect frontend to backend

Before `app.js` is loaded, set:

```html
<script>
  window.__UPNFT_UPGRADE_API_BASE__ = "http://YOUR_SERVER_IP:8787";
</script>
```

If frontend and backend are on the same host, use that public backend URL instead of localhost.

## Quick check

```bash
curl http://localhost:8787/health
```

