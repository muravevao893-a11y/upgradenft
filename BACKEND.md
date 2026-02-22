# Temporary Docker Backend

Minimal backend for your current Mini App frontend.

## What it provides

- `POST /upgrade/prepare`
- `POST /upgrade/resolve`
- `POST /upgrade/abort`
- `GET /wallet/balance`
- `GET /bank/targets`
- `GET /market/state`
- `GET /telegram/gifts`
- `GET /telegram-gifts`
- `GET /gifts`
- `GET /telegram/file?file_id=...`
- `POST /telegram/gifts/set`
- `GET /health`

This backend now persists key state to SQLite (`/data/upnft.sqlite` in Docker):

- upgrade sessions
- request index
- wallet cooldown/active session state
- Telegram profile gifts (`/telegram/gifts/set`)

After restart, these entities are restored automatically.

`/telegram/gifts` now merges data from:

- `TELEGRAM_GIFTS_JSON` (static injected data)
- Telegram Bot API `getUserGifts` (if `TELEGRAM_BOT_TOKEN` is set)
- optional external provider (`TELEGRAM_GIFTS_PROVIDER_URL`)
- TonAPI wallet NFTs fallback (if `wallet` query is provided)

## Run

```bash
docker compose up -d --build upnft-backend
```

Backend URL:

```text
http://localhost:8787
```

SQLite file in Docker compose setup:

```text
./backend/data/upnft.sqlite
```

Key aggregation endpoint:

```text
GET /market/state?user_id=...&username=...&wallet=...&chain=...
```

Returns:

- `balance_ton`
- `profile_inventory` (wallet + Telegram profile gifts)
- `inventory` (priced NFT for upgrade source)
- `targets` (market targets, prefers bank wallet targets)

## Connect frontend to backend

Before `app.js` is loaded, set:

```html
<script>
  window.__UPNFT_UPGRADE_API_BASE__ = "http://YOUR_SERVER_IP:8787";
</script>
```

If frontend and backend are on the same host, use that public backend URL instead of localhost.

## Optional env for Telegram profile gifts

- `DB_PATH` - SQLite path (default `./data/upnft.sqlite`)
- `TELEGRAM_BOT_TOKEN` - enables direct Telegram profile gifts loading via Bot API
- `TELEGRAM_BOT_API_BASE` - optional Bot API base (default `https://api.telegram.org`)
- `TELEGRAM_GIFTS_PROVIDER_URL` - your API that returns `gifts`/`items`/`result` array for `user_id`
- `TELEGRAM_GIFTS_PROVIDER_TOKEN` - optional Bearer token for that provider
- `TONAPI_BASE` - default `https://tonapi.io/v2`

Without external provider, backend still returns wallet NFT fallback via TonAPI when `wallet` is provided.

You can also push Telegram-profile gifts directly from your bot/backend:

```bash
curl -X POST http://localhost:8787/telegram/gifts/set \
  -H "Content-Type: application/json" \
  -d '{"user_id":"123456789","gifts":[{"id":"gift-1","name":"Snoop Cigar #105028","image_url":"https://...","animation_url":"https://...","price_ton":20,"is_upgraded":true}]}'
```

## Quick check

```bash
curl http://localhost:8787/health
```
