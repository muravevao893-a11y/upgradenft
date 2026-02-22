const http = require("http");
const { URL } = require("url");
const crypto = require("crypto");

const PORT = toInt(process.env.PORT, 8787);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const BANK_WALLET = String(
  process.env.BANK_WALLET || "UQCgQQSGPlFWr5TY8UVT7XvtkVtNkRPIGUEnFOB4gRZbQEu4",
).trim();
const SESSION_TTL_MS = clamp(toInt(process.env.SESSION_TTL_MS, 60000), 10000, 300000);
const COOLDOWN_MS = clamp(toInt(process.env.COOLDOWN_MS, 4500), 0, 120000);
const QUEUE_RETRY_MS = clamp(toInt(process.env.QUEUE_RETRY_MS, 1200), 400, 15000);
const STAKE_AMOUNT_NANO = String(process.env.STAKE_AMOUNT_NANO || "1").trim();
const REWARD_MODE = String(process.env.REWARD_MODE || "nft").trim().toLowerCase();
const TONAPI_BASE = String(process.env.TONAPI_BASE || "https://tonapi.io/v2").replace(/\/$/, "");
const TONAPI_TIMEOUT_MS = clamp(toInt(process.env.TONAPI_TIMEOUT_MS, 12000), 3000, 30000);
const TELEGRAM_GIFTS_PROVIDER_URL = String(process.env.TELEGRAM_GIFTS_PROVIDER_URL || "").trim();
const TELEGRAM_GIFTS_PROVIDER_TOKEN = String(process.env.TELEGRAM_GIFTS_PROVIDER_TOKEN || "").trim();

const sessions = new Map();
const requestIndex = new Map();
const walletState = new Map();
const profileGiftStore = new Map();

const injectedGifts = safeParseJson(process.env.TELEGRAM_GIFTS_JSON, []);

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function now() {
  return Date.now();
}

function randomHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function sha256Hex(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

function normalizeAngle(angle) {
  const mod = angle % 360;
  return mod < 0 ? mod + 360 : mod;
}

function safeParseJson(raw, fallback) {
  try {
    return JSON.parse(String(raw ?? ""));
  } catch {
    return fallback;
  }
}

async function fetchJson(url, timeoutMs = 12000, headers = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: headers && typeof headers === "object" ? headers : undefined,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) return text;
  }
  return "";
}

function firstFiniteNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return NaN;
}

function parseTokenAmount(rawValue, decimals = 9) {
  try {
    const value = BigInt(String(rawValue));
    const negative = value < 0n;
    const abs = negative ? -value : value;
    const safeDecimals = Math.max(0, Math.min(18, Number(decimals) || 9));
    const divisor = 10n ** BigInt(safeDecimals);
    const whole = abs / divisor;
    const fraction = abs % divisor;
    const fractionText = safeDecimals ? fraction.toString().padStart(safeDecimals, "0").slice(0, 6) : "";
    const combined = fractionText ? `${whole}.${fractionText}`.replace(/\.?0+$/, "") : whole.toString();
    const asNumber = Number(combined);
    if (!Number.isFinite(asNumber)) return NaN;
    return negative ? -asNumber : asNumber;
  } catch {
    return NaN;
  }
}

function parseTonPriceNode(node) {
  if (!node || typeof node !== "object") return NaN;
  const currencyType = String(node.currency_type || "").toLowerCase();
  const tokenName = String(node.token_name || "").toUpperCase();
  if (currencyType !== "ton" && tokenName !== "TON") return NaN;
  return parseTokenAmount(node.value, Number(node.decimals) || 9);
}

function extractGiftItems(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload.gifts,
    payload.items,
    payload.result,
    payload.data?.gifts,
    payload.data?.items,
    payload.data?.result,
  ];
  for (const entry of candidates) {
    if (Array.isArray(entry)) return entry;
  }
  return [];
}

function dedupeGifts(list) {
  const map = new Map();
  safeArray(list).forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const key = firstNonEmptyString(
      item.id,
      item.gift_id,
      item.nft_address,
      item.nftAddress,
      item.token_id,
      item.tokenId,
      item.address,
      item.name ? `${item.name}-${index}` : "",
    );
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, item);
      return;
    }
    const prev = map.get(key);
    map.set(key, { ...prev, ...item });
  });
  return Array.from(map.values());
}

function getProfileStoredGifts(userId) {
  const key = String(userId || "").trim();
  if (!key) return [];
  return dedupeGifts(profileGiftStore.get(key) || []);
}

function mapTonapiNftToGift(item, index) {
  const metadata = item?.metadata && typeof item.metadata === "object" ? item.metadata : {};
  const previews = safeArray(item?.previews);
  const imagePreview = previews.find((entry) => String(entry?.mime_type || "").toLowerCase().includes("image"))
    || previews.find((entry) => String(entry?.url || "").trim())
    || null;
  const videoPreview = previews.find((entry) => String(entry?.mime_type || "").toLowerCase().includes("video"))
    || null;

  const id = firstNonEmptyString(item?.address, item?.index, `tonapi-${index + 1}`);
  const name = firstNonEmptyString(
    metadata?.name,
    item?.metadata?.name,
    item?.collection?.name ? `${item.collection.name} #${item?.index ?? ""}` : "",
    "Telegram Gift",
  );
  const animationUrl = firstNonEmptyString(
    metadata?.animation_url,
    metadata?.animationUrl,
    metadata?.video_url,
    metadata?.videoUrl,
    metadata?.gif_url,
    metadata?.gifUrl,
    videoPreview?.url,
  );
  const imageUrl = firstNonEmptyString(
    metadata?.image,
    metadata?.image_url,
    metadata?.imageUrl,
    metadata?.thumbnail,
    metadata?.poster,
    imagePreview?.url,
  );
  const priceTon = firstFiniteNumber(
    parseTonPriceNode(item?.sale?.price),
    parseTonPriceNode(item?.auction?.price),
  );

  return {
    id,
    nft_address: String(item?.address || "").trim(),
    token_id: String(item?.index ?? "").trim(),
    name,
    image_url: imageUrl,
    animation_url: animationUrl,
    price_ton: Number.isFinite(priceTon) && priceTon > 0 ? priceTon : undefined,
    tier: String(item?.trust || "Rare"),
    is_upgraded: true,
    source: "wallet",
  };
}

async function fetchTonapiWalletGifts(wallet) {
  const normalizedWallet = String(wallet || "").trim();
  if (!normalizedWallet || !TONAPI_BASE) return [];

  const encoded = encodeURIComponent(normalizedWallet);
  const gifts = [];
  let offset = 0;
  const limit = 100;

  for (let page = 0; page < 3; page += 1) {
    const url = `${TONAPI_BASE}/accounts/${encoded}/nfts?limit=${limit}&offset=${offset}&indirect_ownership=true`;
    const payload = await fetchJson(url, TONAPI_TIMEOUT_MS);
    if (!payload) break;
    const items = safeArray(payload?.nft_items);
    if (!items.length) break;

    items.forEach((item, index) => {
      const mapped = mapTonapiNftToGift(item, offset + index);
      if (mapped) gifts.push(mapped);
    });

    if (items.length < limit) break;
    offset += limit;
  }

  return dedupeGifts(gifts);
}

async function fetchProviderGifts(reqUrl) {
  if (!TELEGRAM_GIFTS_PROVIDER_URL) return [];

  let providerUrl;
  try {
    providerUrl = new URL(TELEGRAM_GIFTS_PROVIDER_URL);
  } catch {
    return [];
  }

  const passKeys = [
    "user_id",
    "username",
    "wallet",
    "wallet_address",
    "wallet_raw",
    "connected_wallet",
    "source",
    "scope",
    "upgraded_only",
    "include_upgraded",
    "include_wallet",
    "include_profile",
  ];
  passKeys.forEach((key) => {
    const value = reqUrl.searchParams.get(key);
    if (value !== null && value !== "") {
      providerUrl.searchParams.set(key, value);
    }
  });

  const headers = {};
  if (TELEGRAM_GIFTS_PROVIDER_TOKEN) {
    headers.Authorization = `Bearer ${TELEGRAM_GIFTS_PROVIDER_TOKEN}`;
  }

  const payload = await fetchJson(providerUrl.toString(), TONAPI_TIMEOUT_MS, headers);
  const items = extractGiftItems(payload);
  return dedupeGifts(items);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let payload = "";
    req.on("data", (chunk) => {
      payload += chunk;
      if (payload.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!payload.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(payload));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Telegram-Init-Data");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function buildQueuedResponse(retryAfterMs = QUEUE_RETRY_MS, position = 1) {
  return {
    ok: true,
    queued: true,
    status: "queued",
    queue: {
      status: "queued",
      queued: true,
      retry_after_ms: retryAfterMs,
      queue_position: position,
    },
    retry_after_ms: retryAfterMs,
    queue_position: position,
  };
}

function normalizeWallet(value) {
  return String(value || "").trim();
}

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeSourceIds(body) {
  const list = Array.isArray(body?.source_nft_ids) ? body.source_nft_ids : [];
  const compact = list.map((id) => String(id || "").trim()).filter(Boolean);
  const first = String(body?.source_nft_id || "").trim();
  if (first && !compact.includes(first)) compact.unshift(first);
  return compact;
}

function buildPrepareTx() {
  return {
    validUntil: Math.floor((now() + SESSION_TTL_MS) / 1000),
    messages: [
      {
        address: BANK_WALLET,
        amount: STAKE_AMOUNT_NANO,
      },
    ],
  };
}

function buildPrepareResponse(session) {
  return {
    ok: true,
    session_id: session.id,
    client_request_id: session.clientRequestId,
    source_nft_id: session.sourceNftId,
    target_nft_id: session.targetNftId,
    wallet: session.wallet,
    user_id: session.userId,
    commitment: session.commitment,
    tx: buildPrepareTx(),
  };
}

function clearActiveWalletSession(session) {
  const key = normalizeKey(session?.wallet);
  if (!key) return;
  const walletMeta = walletState.get(key);
  if (!walletMeta) return;
  if (walletMeta.activeSessionId === session.id) {
    walletMeta.activeSessionId = "";
    walletMeta.cooldownUntil = now() + COOLDOWN_MS;
    walletState.set(key, walletMeta);
  }
}

function createSession(body) {
  const sourceIds = normalizeSourceIds(body);
  const id = crypto.randomUUID();
  const serverSeed = randomHex(32);
  const commitment = sha256Hex(serverSeed);
  const createdAt = now();

  return {
    id,
    createdAt,
    expiresAt: createdAt + SESSION_TTL_MS,
    status: "prepared",
    userId: String(body?.user_id ?? "").trim(),
    username: String(body?.username ?? "").trim(),
    wallet: normalizeWallet(body?.wallet),
    clientRequestId: String(body?.client_request_id ?? "").trim(),
    sourceNftId: sourceIds[0] || "",
    sourceNftIds: sourceIds,
    targetNftId: String(body?.target_nft_id ?? "").trim(),
    chance: clamp(Number(body?.chance || 0), 0, 100),
    sourceValue: Number(body?.source_value || 0),
    targetValue: Number(body?.target_value || 0),
    nonce: 0,
    serverSeed,
    commitment,
    resolvePayload: null,
  };
}

function cleanupStore() {
  const current = now();
  for (const [id, session] of sessions.entries()) {
    const staleResolved = (session.status === "resolved" || session.status === "aborted")
      && current - session.createdAt > 15 * 60 * 1000;
    const staleExpired = current > session.expiresAt + 2 * 60 * 1000;
    if (!staleResolved && !staleExpired) continue;

    sessions.delete(id);
    const reqKey = `${normalizeKey(session.wallet)}:${session.clientRequestId}`;
    requestIndex.delete(reqKey);
  }
}

function resolveSessionOutcome(session) {
  const nonce = session.nonce + 1;
  const clientSeed = sha256Hex(`${session.clientRequestId}:${session.wallet}:${nonce}`);
  const digest = sha256Hex(`${session.serverSeed}:${clientSeed}:${nonce}`);
  const fraction = Number.parseInt(digest.slice(0, 13), 16) / 0x20000000000000;
  const targetAngle = normalizeAngle(fraction * 360);
  const success = targetAngle <= session.chance * 3.6;

  session.nonce = nonce;

  const payload = {
    ok: true,
    session_id: session.id,
    client_request_id: session.clientRequestId,
    source_nft_id: session.sourceNftId,
    target_nft_id: session.targetNftId,
    wallet: session.wallet,
    user_id: session.userId,
    success,
    target_angle: targetAngle,
    reward_mode: REWARD_MODE === "ton" ? "ton" : "nft",
    payout_ton: REWARD_MODE === "ton" && success
      ? Math.max(0, Number(session.targetValue || session.sourceValue || 0))
      : undefined,
    nonce,
    digest,
    server_seed: session.serverSeed,
    commitment: session.commitment,
  };

  if (REWARD_MODE === "nft") {
    payload.target_nft = {
      id: session.targetNftId,
      name: `Target ${session.targetNftId}`,
      value: Number.isFinite(session.targetValue) ? session.targetValue : 0,
      tier: "Unknown",
      source: "bank",
    };
  }

  return payload;
}

async function handlePrepare(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, error_code: "bad_json", error: String(error.message || error) });
    return;
  }

  const wallet = normalizeWallet(body?.wallet);
  const clientRequestId = String(body?.client_request_id ?? "").trim();
  const targetNftId = String(body?.target_nft_id ?? "").trim();
  const sourceIds = normalizeSourceIds(body);
  const sourceNftId = sourceIds[0] || "";

  if (!wallet || !clientRequestId || !sourceNftId || !targetNftId) {
    sendJson(res, 400, { ok: false, error_code: "bad_request", error: "Missing required fields" });
    return;
  }

  cleanupStore();

  const walletKey = normalizeKey(wallet);
  const requestKey = `${walletKey}:${clientRequestId}`;
  const existingSessionId = requestIndex.get(requestKey);
  if (existingSessionId) {
    const existing = sessions.get(existingSessionId);
    if (existing && existing.status === "prepared" && existing.expiresAt > now()) {
      sendJson(res, 200, buildPrepareResponse(existing));
      return;
    }
    if (existing && existing.status === "resolved" && existing.resolvePayload) {
      sendJson(res, 200, buildPrepareResponse(existing));
      return;
    }
  }

  const walletMeta = walletState.get(walletKey) || { cooldownUntil: 0, activeSessionId: "" };
  const activeSession = walletMeta.activeSessionId ? sessions.get(walletMeta.activeSessionId) : null;
  if (activeSession && activeSession.status === "prepared" && activeSession.expiresAt > now()) {
    sendJson(res, 200, buildQueuedResponse(QUEUE_RETRY_MS, 1));
    return;
  }

  if (walletMeta.cooldownUntil > now()) {
    sendJson(res, 200, buildQueuedResponse(walletMeta.cooldownUntil - now(), 1));
    return;
  }

  const session = createSession(body);
  session.sourceNftId = sourceNftId;
  session.sourceNftIds = sourceIds;
  sessions.set(session.id, session);
  requestIndex.set(requestKey, session.id);
  walletState.set(walletKey, {
    cooldownUntil: now() + COOLDOWN_MS,
    activeSessionId: session.id,
  });

  sendJson(res, 200, buildPrepareResponse(session));
}

async function handleResolve(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, error_code: "bad_json", error: String(error.message || error) });
    return;
  }

  const sessionId = String(body?.session_id ?? "").trim();
  const clientRequestId = String(body?.client_request_id ?? "").trim();
  if (!sessionId || !clientRequestId) {
    sendJson(res, 400, { ok: false, error_code: "bad_request", error: "Missing session_id/client_request_id" });
    return;
  }

  cleanupStore();
  const session = sessions.get(sessionId);
  if (!session) {
    sendJson(res, 404, { ok: false, error_code: "session_not_found" });
    return;
  }

  if (session.clientRequestId !== clientRequestId) {
    sendJson(res, 409, { ok: false, error_code: "request_mismatch" });
    return;
  }

  if (session.status === "aborted") {
    sendJson(res, 409, { ok: false, error_code: "aborted" });
    return;
  }

  if (session.expiresAt <= now()) {
    clearActiveWalletSession(session);
    session.status = "aborted";
    sendJson(res, 409, { ok: false, error_code: "offer_timeout" });
    return;
  }

  if (session.status === "resolved" && session.resolvePayload) {
    sendJson(res, 200, session.resolvePayload);
    return;
  }

  const payload = resolveSessionOutcome(session);
  session.status = "resolved";
  session.resolvePayload = payload;
  clearActiveWalletSession(session);

  sendJson(res, 200, payload);
}

async function handleAbort(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, error_code: "bad_json", error: String(error.message || error) });
    return;
  }

  const sessionId = String(body?.session_id ?? "").trim();
  if (sessionId) {
    const session = sessions.get(sessionId);
    if (session && session.status !== "resolved") {
      session.status = "aborted";
      clearActiveWalletSession(session);
    }
  }

  sendJson(res, 200, { ok: true });
}

async function handleSetGifts(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, error_code: "bad_json", error: String(error.message || error) });
    return;
  }

  const userId = String(body?.user_id ?? "").trim();
  const gifts = dedupeGifts(safeArray(body?.gifts));
  if (!userId) {
    sendJson(res, 400, { ok: false, error_code: "bad_request", error: "Missing user_id" });
    return;
  }

  profileGiftStore.set(userId, gifts);
  sendJson(res, 200, { ok: true, user_id: userId, count: gifts.length });
}

async function handleGifts(reqUrl, res) {
  const userId = String(reqUrl.searchParams.get("user_id") || "").trim();
  const wallet = firstNonEmptyString(
    reqUrl.searchParams.get("wallet"),
    reqUrl.searchParams.get("wallet_address"),
    reqUrl.searchParams.get("connected_wallet"),
  );

  const sourceParam = String(reqUrl.searchParams.get("source") || "all").trim().toLowerCase();
  const includeWallet = sourceParam !== "telegram";
  const includeProfile = sourceParam !== "wallet";

  const merged = [];
  if (includeProfile) {
    merged.push(...safeArray(injectedGifts));
    merged.push(...getProfileStoredGifts(userId));
    const providerItems = await fetchProviderGifts(reqUrl);
    if (providerItems.length > 0) {
      merged.push(...providerItems);
    }
  }
  if (includeWallet && wallet) {
    const walletItems = await fetchTonapiWalletGifts(wallet);
    if (walletItems.length > 0) {
      merged.push(...walletItems);
    }
  }

  const gifts = dedupeGifts(merged);
  sendJson(res, 200, {
    ok: true,
    user_id: userId || null,
    wallet: wallet || null,
    source: sourceParam || "all",
    gifts,
  });
}

const server = http.createServer(async (req, res) => {
  const method = String(req.method || "GET").toUpperCase();
  const reqUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = reqUrl.pathname.replace(/\/+$/, "") || "/";

  if (method === "OPTIONS") {
    setCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (method === "GET" && path === "/health") {
    sendJson(res, 200, { ok: true, uptime: process.uptime() });
    return;
  }

  if (method === "GET" && (path === "/telegram/gifts" || path === "/telegram-gifts" || path === "/gifts")) {
    await handleGifts(reqUrl, res);
    return;
  }

  if (method === "POST" && (path === "/telegram/gifts/set" || path === "/telegram-gifts/set")) {
    await handleSetGifts(req, res);
    return;
  }

  if (method === "POST" && path === "/upgrade/prepare") {
    await handlePrepare(req, res);
    return;
  }

  if (method === "POST" && path === "/upgrade/resolve") {
    await handleResolve(req, res);
    return;
  }

  if (method === "POST" && path === "/upgrade/abort") {
    await handleAbort(req, res);
    return;
  }

  sendJson(res, 404, { ok: false, error_code: "not_found", path, method });
});

setInterval(cleanupStore, 30_000).unref();

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`[upnft-backend] listening on http://${HOST}:${PORT}`);
});
