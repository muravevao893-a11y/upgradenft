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
const TONCENTER_BASE = String(process.env.TONCENTER_BASE || "https://toncenter.com/api/v2").replace(/\/$/, "");
const TONAPI_TESTNET_BASE = String(process.env.TONAPI_TESTNET_BASE || "https://testnet.tonapi.io/v2").replace(/\/$/, "");
const TONCENTER_TESTNET_BASE = String(process.env.TONCENTER_TESTNET_BASE || "https://testnet.toncenter.com/api/v2").replace(/\/$/, "");
const TONAPI_TIMEOUT_MS = clamp(toInt(process.env.TONAPI_TIMEOUT_MS, 12000), 3000, 30000);
const TELEGRAM_GIFTS_PROVIDER_URL = String(process.env.TELEGRAM_GIFTS_PROVIDER_URL || "").trim();
const TELEGRAM_GIFTS_PROVIDER_TOKEN = String(process.env.TELEGRAM_GIFTS_PROVIDER_TOKEN || "").trim();
const NFT_PAGE_LIMIT = clamp(toInt(process.env.NFT_PAGE_LIMIT, 100), 20, 200);
const NFT_MAX_PAGES = clamp(toInt(process.env.NFT_MAX_PAGES, 4), 1, 10);
const COLLECTION_SCAN_LIMIT = clamp(toInt(process.env.COLLECTION_SCAN_LIMIT, 60), 20, 200);
const MAX_COLLECTIONS_FOR_MARKET = clamp(toInt(process.env.MAX_COLLECTIONS_FOR_MARKET, 6), 1, 20);
const MAX_TARGETS = clamp(toInt(process.env.MAX_TARGETS, 60), 10, 300);

const TON_CHAIN_MAINNET = "-239";
const TON_CHAIN_TESTNET = "-3";

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

function normalizeTonChainId(chainValue) {
  const raw = String(chainValue ?? "").trim();
  if (!raw) return "";
  if (raw === TON_CHAIN_MAINNET || raw === "mainnet" || raw === "main") return TON_CHAIN_MAINNET;
  if (raw === TON_CHAIN_TESTNET || raw === "testnet" || raw === "test") return TON_CHAIN_TESTNET;
  return raw;
}

function isTonTestnetChain(chainValue) {
  return normalizeTonChainId(chainValue) === TON_CHAIN_TESTNET;
}

function resolveTonApiBase(chainValue) {
  return isTonTestnetChain(chainValue) ? TONAPI_TESTNET_BASE : TONAPI_BASE;
}

function resolveTonCenterBase(chainValue) {
  return isTonTestnetChain(chainValue) ? TONCENTER_TESTNET_BASE : TONCENTER_BASE;
}

function normalizeTonAddress(addressValue) {
  const raw = String(addressValue ?? "").trim();
  if (!raw) return "";

  const matchRaw = raw.match(/^(-?\d+):([0-9a-fA-F]{64})$/);
  if (matchRaw) {
    return `${matchRaw[1]}:${matchRaw[2].toLowerCase()}`;
  }

  return raw;
}

function toStdBase64Address(text) {
  return String(text ?? "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/g, "");
}

function toUrlSafeBase64Address(text) {
  return String(text ?? "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getTonAddressCandidates(addressValue) {
  const normalized = normalizeTonAddress(addressValue);
  if (!normalized) return [];

  const candidates = new Set([normalized]);
  const isFriendlyLike = /^[A-Za-z0-9_\-+/=]{40,70}$/.test(normalized) && !normalized.includes(":");
  if (isFriendlyLike) {
    candidates.add(toStdBase64Address(normalized));
    candidates.add(toUrlSafeBase64Address(normalized));
  }

  return Array.from(candidates).map((item) => String(item).trim()).filter(Boolean);
}

function normalizeMediaUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^ipfs:\/\/ipfs\//i.test(raw)) {
    return `https://ipfs.io/ipfs/${raw.slice("ipfs://ipfs/".length)}`;
  }
  if (/^ipfs:\/\//i.test(raw)) {
    return `https://ipfs.io/ipfs/${raw.slice("ipfs://".length)}`;
  }
  return raw;
}

function pushUniqueMediaCandidate(target, value) {
  const normalized = normalizeMediaUrl(String(value ?? "").trim());
  if (!normalized) return;
  if (!target.includes(normalized)) {
    target.push(normalized);
  }
}

function normalizeMediaCandidateList(...values) {
  const normalized = [];
  const visited = new Set();

  const pushValue = (value, depth = 0) => {
    if (depth > 3 || value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => pushValue(entry, depth + 1));
      return;
    }

    if (typeof value === "object") {
      if (visited.has(value)) return;
      visited.add(value);
      pushValue(value.url, depth + 1);
      pushValue(value.src, depth + 1);
      pushValue(value.image, depth + 1);
      pushValue(value.image_url, depth + 1);
      pushValue(value.preview_url, depth + 1);
      pushValue(value.content_url, depth + 1);
      pushValue(value.video, depth + 1);
      pushValue(value.video_url, depth + 1);
      pushValue(value.animation, depth + 1);
      pushValue(value.animation_url, depth + 1);
      pushValue(value.gif, depth + 1);
      pushValue(value.gif_url, depth + 1);
      return;
    }

    pushUniqueMediaCandidate(normalized, value);
  };

  values.forEach((entry) => pushValue(entry, 0));
  return normalized;
}

function isUnsupportedAnimationUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.tgs|\.json)([\?#].*)?$/.test(raw);
}

function readPathValue(source, path) {
  if (!source || typeof source !== "object") return undefined;
  const segments = String(path || "").split(".").filter(Boolean);
  let cursor = source;
  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object") return undefined;
    cursor = cursor[segment];
  }
  return cursor;
}

function collectMediaCandidatesFromPaths(source, paths) {
  const result = [];
  safeArray(paths).forEach((path) => {
    const value = readPathValue(source, path);
    if (value === undefined || value === null) return;
    const normalized = normalizeMediaCandidateList(value);
    normalized.forEach((entry) => pushUniqueMediaCandidate(result, entry));
  });
  return result;
}

function normalizeColorValue(rawValue) {
  const raw = String(rawValue ?? "").trim();
  if (!raw) return "";
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return raw;
  if (/^[0-9a-f]{3}$/i.test(raw) || /^[0-9a-f]{6}$/i.test(raw) || /^[0-9a-f]{8}$/i.test(raw)) {
    return `#${raw}`;
  }
  if (/^rgba?\(/i.test(raw) || /^hsla?\(/i.test(raw)) return raw;
  if (/^[a-z]+$/i.test(raw)) return raw;
  return "";
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

function toNumber(value, fallback = NaN) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatTonFromNano(nanoValue) {
  const parsed = parseTokenAmount(nanoValue, 9);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function getTonChainLookupOrder(chainValue) {
  const normalized = normalizeTonChainId(chainValue);
  if (normalized === TON_CHAIN_TESTNET) return [TON_CHAIN_TESTNET, TON_CHAIN_MAINNET];
  if (normalized === TON_CHAIN_MAINNET) return [TON_CHAIN_MAINNET, TON_CHAIN_TESTNET];
  return [TON_CHAIN_MAINNET, TON_CHAIN_TESTNET];
}

function isLikelyVideoUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.mp4|\.webm|\.m4v|\.mov|\.ogv|\.ogg)([\?#].*)?$/.test(raw)
    || raw.includes("video");
}

function isLikelyImageAnimationUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.gif|\.webp|\.apng)([\?#].*)?$/.test(raw)
    || raw.includes("gif");
}

function firstNonEmptyStringFromPaths(source, paths) {
  for (const path of safeArray(paths)) {
    const text = String(readPathValue(source, path) ?? "").trim();
    if (text) return text;
  }
  return "";
}

function firstFiniteNumberFromPaths(source, paths) {
  for (const path of safeArray(paths)) {
    const value = readPathValue(source, path);
    const number = toNumber(value, NaN);
    if (Number.isFinite(number)) return number;
  }
  return NaN;
}

function firstMeaningfulValueFromPaths(source, paths) {
  for (const path of safeArray(paths)) {
    const value = readPathValue(source, path);
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    return value;
  }
  return undefined;
}

function parseLooseTonValue(rawValue) {
  if (rawValue === undefined || rawValue === null) return NaN;

  if (typeof rawValue === "number") {
    return Number.isFinite(rawValue) ? rawValue : NaN;
  }

  if (typeof rawValue === "string") {
    const cleaned = rawValue.replace(",", ".").replace(/\s+/g, " ").trim();
    if (!cleaned) return NaN;
    const match = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (!match) return NaN;
    return toNumber(match[0], NaN);
  }

  if (typeof rawValue !== "object") return NaN;

  const nanoCandidate = firstMeaningfulValueFromPaths(rawValue, [
    "nano",
    "nanos",
    "nanoton",
    "nanotons",
    "value_nano",
    "valueNano",
  ]);
  if (nanoCandidate !== undefined) {
    const parsedNano = parseTokenAmount(nanoCandidate, 9);
    if (Number.isFinite(parsedNano)) return parsedNano;
  }

  const nodePrice = parseTonPriceNode(rawValue);
  if (Number.isFinite(nodePrice)) return nodePrice;

  const currencyHint = String(
    firstNonEmptyStringFromPaths(rawValue, [
      "currency",
      "currency_code",
      "currencyCode",
      "unit",
      "symbol",
      "asset",
      "token",
    ]),
  ).trim().toLowerCase();
  if (currencyHint && !currencyHint.includes("ton")) {
    return NaN;
  }

  const nestedCandidate = firstMeaningfulValueFromPaths(rawValue, [
    "amount",
    "value",
    "price",
    "ton",
    "tons",
    "price_ton",
    "priceTon",
  ]);
  if (nestedCandidate === undefined) return NaN;
  return parseLooseTonValue(nestedCandidate);
}

function resolveBooleanFromPaths(source, paths) {
  for (const path of safeArray(paths)) {
    const value = readPathValue(source, path);
    if (value === undefined || value === null) continue;
    if (typeof value === "boolean") return value;
    const text = String(value).trim().toLowerCase();
    if (!text) continue;
    if (["1", "true", "yes", "y", "on"].includes(text)) return true;
    if (["0", "false", "no", "n", "off"].includes(text)) return false;
  }
  return false;
}

function mergeUniqueNfts(...lists) {
  const map = new Map();
  lists.forEach((list) => {
    safeArray(list).forEach((item) => {
      const id = String(item?.id ?? "").trim();
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, item);
        return;
      }

      const prev = map.get(id);
      const prevHasPrice = Number.isFinite(toNumber(prev?.value, NaN)) && toNumber(prev?.value, NaN) > 0;
      const nextHasPrice = Number.isFinite(toNumber(item?.value, NaN)) && toNumber(item?.value, NaN) > 0;
      const merged = { ...prev };

      if (!prevHasPrice && nextHasPrice) {
        merged.value = item.value;
      }

      const mergedImageCandidates = normalizeMediaCandidateList(
        prev?.imageCandidates,
        prev?.imageUrl,
        item?.imageCandidates,
        item?.imageUrl,
      );
      if (mergedImageCandidates.length > 0) {
        merged.imageCandidates = mergedImageCandidates;
        if (!merged.imageUrl) merged.imageUrl = mergedImageCandidates[0];
      }

      const mergedAnimationCandidates = normalizeMediaCandidateList(
        prev?.animationCandidates,
        prev?.animationUrl,
        item?.animationCandidates,
        item?.animationUrl,
      ).filter((url) => !isUnsupportedAnimationUrl(url));
      if (mergedAnimationCandidates.length > 0) {
        merged.animationCandidates = mergedAnimationCandidates;
        if (!merged.animationUrl || isUnsupportedAnimationUrl(merged.animationUrl)) {
          merged.animationUrl = mergedAnimationCandidates[0];
        }
      }

      [
        "name",
        "tier",
        "backgroundColor",
        "backgroundGradient",
        "backgroundImageUrl",
        "collectionAddress",
      ].forEach((key) => {
        if (!merged[key] && item?.[key]) {
          merged[key] = item[key];
        }
      });

      if (item?.listed && !merged?.listed) {
        merged.listed = true;
      }

      if ((merged?.source === "wallet" || !merged?.source) && item?.source === "telegram") {
        merged.source = "telegram";
      }

      map.set(id, merged);
    });
  });
  return Array.from(map.values());
}

function pickNftAnimationCandidates(item) {
  const metadata = item?.metadata ?? {};
  const previews = safeArray(item?.previews);
  const previewAnimations = [];
  previews.forEach((preview) => {
    const url = String(preview?.url ?? "").trim();
    if (!url) return;
    const mime = String(preview?.mime_type ?? preview?.mimeType ?? preview?.type ?? "").toLowerCase();
    if (mime.includes("video") || mime.includes("gif") || isLikelyVideoUrl(url) || isLikelyImageAnimationUrl(url)) {
      pushUniqueMediaCandidate(previewAnimations, url);
    }
  });

  return normalizeMediaCandidateList(
    metadata.animation_url,
    metadata.animationUrl,
    metadata.animation,
    metadata.video,
    metadata.video_url,
    metadata.videoUrl,
    metadata.preview_animation,
    metadata.previewAnimation,
    metadata.preview_video,
    metadata.previewVideo,
    metadata.gif,
    metadata.gif_url,
    metadata.gifUrl,
    metadata.lottie,
    metadata.lottie_url,
    metadata.lottieUrl,
    metadata.media,
    metadata.preview,
    item?.animation_url,
    item?.animationUrl,
    item?.video_url,
    item?.videoUrl,
    item?.preview_video_url,
    item?.previewVideoUrl,
    item?.gif_url,
    item?.gifUrl,
    item?.previews,
    previewAnimations,
  );
}

function pickNftImageCandidates(item) {
  const previews = safeArray(item?.previews);
  const previewImages = [];
  const orderedResolutions = ["1500x1500", "1000x1000", "500x500", "300x300", "100x100"];
  orderedResolutions.forEach((resolution) => {
    previews.forEach((preview) => {
      const url = String(preview?.url ?? "").trim();
      if (!url) return;
      if (String(preview?.resolution ?? "").trim() !== resolution) return;
      const mime = String(preview?.mime_type ?? preview?.mimeType ?? preview?.type ?? "").toLowerCase();
      if (mime.includes("video") || isLikelyVideoUrl(url)) return;
      pushUniqueMediaCandidate(previewImages, url);
    });
  });
  previews.forEach((preview) => {
    const url = String(preview?.url ?? "").trim();
    if (!url) return;
    const mime = String(preview?.mime_type ?? preview?.mimeType ?? preview?.type ?? "").toLowerCase();
    if (mime.includes("video") || isLikelyVideoUrl(url)) return;
    pushUniqueMediaCandidate(previewImages, url);
  });

  const metadata = item?.metadata ?? {};
  return normalizeMediaCandidateList(
    previewImages,
    metadata.image,
    metadata.image_url,
    metadata.imageUrl,
    metadata.thumbnail,
    metadata.poster,
    metadata.preview,
    metadata.preview_image,
    metadata.preview_url,
    metadata.media,
    item?.image,
    item?.image_url,
    item?.imageUrl,
    item?.preview,
    item?.preview_url,
    item?.previewUrl,
    item?.photo_url,
    item?.photoUrl,
  );
}

function pickNftBackgroundColor(item) {
  const metadata = item?.metadata ?? {};
  return normalizeColorValue(
    firstNonEmptyString(
      metadata.background_color,
      metadata.backgroundColor,
      metadata.bg_color,
      metadata.bgColor,
      item?.background_color,
      item?.backgroundColor,
    ),
  );
}

function pickNftBackgroundImageUrl(item) {
  const metadata = item?.metadata ?? {};
  return normalizeMediaUrl(firstNonEmptyString(
    metadata.background_image,
    metadata.backgroundImage,
    metadata.background_pattern,
    metadata.backgroundPattern,
    metadata.bg_image,
    metadata.bgImage,
    metadata.pattern_url,
    metadata.patternUrl,
    item?.background_image,
    item?.backgroundImage,
  ));
}

function deriveNftName(item) {
  const metadataName = String(item?.metadata?.name ?? "").trim();
  if (metadataName) return metadataName;
  const collectionName = String(item?.collection?.name ?? "").trim();
  const index = item?.index;
  if (collectionName && index !== undefined && index !== null) {
    return `${collectionName} #${index}`;
  }
  if (collectionName) return collectionName;
  return "NFT";
}

function deriveNftTier(item) {
  const trust = String(item?.trust ?? "").toLowerCase();
  if (trust === "whitelist") return "Rare";
  if (trust === "graylist") return "Uncommon";
  if (item?.verified) return "Uncommon";
  return "Common";
}

function buildNftModelFromTonapiItem(item, value, fallbackId, sourceTag = "wallet") {
  const id = String(item?.address || fallbackId || "");
  if (!id) return null;
  const animationCandidates = pickNftAnimationCandidates(item).filter((url) => !isUnsupportedAnimationUrl(url));
  const imageCandidates = pickNftImageCandidates(item);
  const animationUrl = animationCandidates[0] || "";
  const imageUrl = imageCandidates[0] || "";

  return {
    id,
    name: deriveNftName(item),
    tier: deriveNftTier(item),
    value,
    imageUrl,
    imageCandidates,
    animationUrl,
    animationCandidates,
    backgroundColor: pickNftBackgroundColor(item),
    backgroundImageUrl: pickNftBackgroundImageUrl(item),
    collectionAddress: String(item?.collection?.address ?? "").trim(),
    listed: Boolean(item?.sale),
    source: sourceTag,
  };
}

function buildNftModelFromGift(item, index) {
  const giftId = firstNonEmptyStringFromPaths(item, [
    "id",
    "gift_id",
    "gift.id",
    "nft_address",
    "nftAddress",
    "nft.address",
    "token_id",
    "tokenId",
    "number",
    "gift.number",
  ]) || `tg-${index + 1}`;

  const animationCandidates = collectMediaCandidatesFromPaths(item, [
    "animation_url",
    "animationUrl",
    "video_url",
    "videoUrl",
    "gif_url",
    "gifUrl",
    "media.animation_url",
    "media.video_url",
    "media.gif_url",
    "preview.animation_url",
    "preview.video_url",
    "nft.animation_url",
    "gift.animation_url",
    "fragment.animation_url",
    "fragment.video_url",
  ]).filter((url) => !isUnsupportedAnimationUrl(url));

  const imageCandidates = collectMediaCandidatesFromPaths(item, [
    "image_url",
    "imageUrl",
    "photo_url",
    "photoUrl",
    "thumbnail_url",
    "thumbnailUrl",
    "preview_url",
    "previewUrl",
    "preview.image_url",
    "preview.url",
    "media.image_url",
    "media.url",
    "nft.image_url",
    "gift.image_url",
    "fragment.image_url",
    "fragment.preview_url",
  ]);

  const animationUrl = animationCandidates[0] || "";
  const imageUrl = imageCandidates[0] || "";

  let priceTon = parseTonPriceNode(firstMeaningfulValueFromPaths(item, [
    "sale.price",
    "market.price",
    "fragment.price",
    "price",
    "gift.price",
    "nft.price",
  ]));
  if (!Number.isFinite(priceTon)) {
    priceTon = firstFiniteNumberFromPaths(item, [
      "price_ton",
      "priceTon",
      "ton_price",
      "tonPrice",
      "value",
    ]);
  }
  if (!Number.isFinite(priceTon)) {
    priceTon = parseLooseTonValue(firstMeaningfulValueFromPaths(item, [
      "price",
      "market.price",
      "fragment.price",
      "sale.price",
      "sale.price.value",
      "gift.price",
      "nft.price",
    ]));
  }
  if (Number.isFinite(priceTon) && priceTon > 1000000) {
    priceTon = priceTon / 1000000000;
  }

  const tier = String(
    firstNonEmptyStringFromPaths(item, [
      "tier",
      "rarity",
      "nft.rarity",
      "gift.rarity",
    ]) || "Rare",
  ).trim() || "Rare";

  const name = String(
    firstNonEmptyStringFromPaths(item, [
      "name",
      "title",
      "nft.name",
      "gift.name",
      "gift.title",
      "collection_name",
      "gift.collection_name",
    ]) || "Telegram Gift",
  ).trim() || "Telegram Gift";

  return {
    id: String(giftId),
    name,
    tier,
    value: Number.isFinite(priceTon) && priceTon > 0 ? priceTon : NaN,
    imageUrl,
    imageCandidates,
    animationUrl,
    animationCandidates,
    backgroundColor: normalizeColorValue(firstNonEmptyStringFromPaths(item, [
      "background_color",
      "backgroundColor",
      "gift.background_color",
    ])),
    backgroundImageUrl: normalizeMediaUrl(firstNonEmptyStringFromPaths(item, [
      "background_image",
      "backgroundImage",
      "pattern_url",
      "patternUrl",
      "gift.background_image",
      "fragment.background_url",
      "fragment.pattern_url",
    ])),
    collectionAddress: String(firstNonEmptyStringFromPaths(item, [
      "collection.address",
      "nft.collection.address",
      "gift.collection.address",
    ]) || "telegram-gifts").trim(),
    listed: resolveBooleanFromPaths(item, [
      "listed",
      "market.listed",
      "fragment.listed",
      "sale.active",
      "listing.active",
    ]),
    source: "telegram",
  };
}

async function fetchAccountNftItemsPage(owner, indirectOwnership, chain = "") {
  const indirectParam = typeof indirectOwnership === "boolean" ? `&indirect_ownership=${indirectOwnership}` : "";
  const tonApiBase = resolveTonApiBase(normalizeTonChainId(chain));
  const ownerCandidates = getTonAddressCandidates(owner);
  let fallbackEmpty = null;

  for (const ownerCandidate of ownerCandidates) {
    const encodedOwner = encodeURIComponent(ownerCandidate);
    const collected = [];
    let offset = 0;
    let hadResponse = false;

    for (let page = 0; page < NFT_MAX_PAGES; page += 1) {
      const url = `${tonApiBase}/accounts/${encodedOwner}/nfts?limit=${NFT_PAGE_LIMIT}&offset=${offset}${indirectParam}`;
      let payload = await fetchJson(url, TONAPI_TIMEOUT_MS);
      if (!payload) {
        payload = await fetchJson(url, TONAPI_TIMEOUT_MS);
      }
      if (!payload) {
        if (!hadResponse) break;
        break;
      }
      hadResponse = true;

      const chunk = safeArray(payload?.nft_items);
      if (chunk.length === 0) break;
      collected.push(...chunk);
      if (chunk.length < NFT_PAGE_LIMIT) break;
      offset += NFT_PAGE_LIMIT;
    }

    if (!hadResponse) continue;
    if (collected.length > 0) return collected;
    fallbackEmpty = collected;
  }

  return fallbackEmpty;
}

async function fetchAccountNftItems(address, chain = "") {
  const owner = normalizeTonAddress(address);
  if (!owner) return [];

  const modes = [null, false, true];
  let hadValidResponse = false;
  let fallback = [];

  for (const mode of modes) {
    const items = await fetchAccountNftItemsPage(owner, mode, chain);
    if (items === null) continue;
    hadValidResponse = true;
    if (items.length > 0) return items;
    fallback = items;
  }

  return hadValidResponse ? fallback : [];
}

async function fetchCollectionMarketSnapshot(collectionAddress, ownerAddress, chain = "") {
  const collection = String(collectionAddress || "").trim();
  if (!collection) {
    return { collectionAddress: "", floorTon: null, listings: [] };
  }

  const tonApiBase = resolveTonApiBase(normalizeTonChainId(chain));
  const ownerAddressVariants = new Set(getTonAddressCandidates(ownerAddress).map((item) => item.toLowerCase()));
  const url = `${tonApiBase}/nfts/collections/${encodeURIComponent(collection)}/items?limit=${COLLECTION_SCAN_LIMIT}&offset=0`;
  const payload = await fetchJson(url, TONAPI_TIMEOUT_MS);
  const items = safeArray(payload?.nft_items);
  const listings = [];
  let floorTon = null;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const priceTon = parseTonPriceNode(item?.sale?.price);
    if (!Number.isFinite(priceTon) || priceTon <= 0) continue;

    floorTon = floorTon === null ? priceTon : Math.min(floorTon, priceTon);

    const itemOwner = String(item?.owner?.address ?? "").trim();
    if (itemOwner && ownerAddressVariants.has(itemOwner.toLowerCase())) continue;

    const mapped = buildNftModelFromTonapiItem(item, priceTon, `market-${collection}-${index}`);
    if (mapped) listings.push(mapped);
  }

  return { collectionAddress: collection, floorTon, listings };
}

function buildOwnedInventoryLists(ownItems, floorByCollection, prefix = "owned", sourceTag = "wallet") {
  const profileInventory = [];
  const inventory = [];

  safeArray(ownItems).forEach((item, index) => {
    const listedPriceTon = parseTonPriceNode(item?.sale?.price);
    const collectionAddress = String(item?.collection?.address ?? "").trim();
    const floorTon = floorByCollection.get(collectionAddress) ?? null;
    const resolvedValue = Number.isFinite(listedPriceTon) && listedPriceTon > 0
      ? listedPriceTon
      : floorTon;

    const profileItem = buildNftModelFromTonapiItem(
      item,
      Number.isFinite(resolvedValue) ? resolvedValue : NaN,
      `${prefix}-${index + 1}`,
      sourceTag,
    );
    if (!profileItem) return;

    profileInventory.push(profileItem);

    if (Number.isFinite(resolvedValue) && resolvedValue > 0) {
      inventory.push({ ...profileItem, value: resolvedValue, source: sourceTag });
    }
  });

  return { profileInventory, inventory };
}

async function fetchBankWalletTargets(chain = "") {
  const bankAddress = String(BANK_WALLET || "").trim();
  if (!bankAddress) return [];

  const ownItems = await fetchAccountNftItems(bankAddress, chain);
  if (!ownItems || ownItems.length === 0) return [];

  const uniqueCollections = Array.from(
    new Set(
      ownItems
        .map((item) => String(item?.collection?.address ?? "").trim())
        .filter(Boolean),
    ),
  ).slice(0, Math.max(MAX_COLLECTIONS_FOR_MARKET, 12));

  const snapshots = await Promise.all(
    uniqueCollections.map((collectionAddress) => fetchCollectionMarketSnapshot(collectionAddress, bankAddress, chain)),
  );

  const floorByCollection = new Map();
  snapshots.forEach((snapshot) => {
    if (Number.isFinite(snapshot.floorTon) && snapshot.floorTon > 0) {
      floorByCollection.set(snapshot.collectionAddress, snapshot.floorTon);
    }
  });

  const { inventory } = buildOwnedInventoryLists(ownItems, floorByCollection, "bank-owned", "bank");
  return inventory
    .filter((item) => Number.isFinite(item.value) && item.value > 0)
    .sort((left, right) => left.value - right.value)
    .slice(0, MAX_TARGETS);
}

async function fetchBalanceForChain(addressCandidates, chainCandidate) {
  const tonApiBase = resolveTonApiBase(chainCandidate);
  const tonCenterBase = resolveTonCenterBase(chainCandidate);
  let responded = false;
  let best = null;

  const rememberBalance = (parsed) => {
    if (!Number.isFinite(parsed)) return;
    if (!best || parsed > best) {
      best = parsed;
    }
  };

  for (const candidateAddress of addressCandidates) {
    const encoded = encodeURIComponent(candidateAddress);
    let tonApiData = await fetchJson(`${tonApiBase}/accounts/${encoded}`, TONAPI_TIMEOUT_MS);
    if (!tonApiData) {
      tonApiData = await fetchJson(`${tonApiBase}/accounts/${encoded}`, TONAPI_TIMEOUT_MS);
    }
    if (tonApiData) responded = true;
    const tonApiBalance = tonApiData?.balance;
    if (tonApiBalance !== undefined && tonApiBalance !== null) {
      rememberBalance(formatTonFromNano(tonApiBalance));
    }
  }

  for (const candidateAddress of addressCandidates) {
    const encoded = encodeURIComponent(candidateAddress);
    let tonCenterData = await fetchJson(`${tonCenterBase}/getAddressInformation?address=${encoded}`, TONAPI_TIMEOUT_MS);
    if (!tonCenterData) {
      tonCenterData = await fetchJson(`${tonCenterBase}/getAddressInformation?address=${encoded}`, TONAPI_TIMEOUT_MS);
    }
    if (tonCenterData) responded = true;
    const tonCenterBalance = tonCenterData?.result?.balance;
    if (tonCenterData?.ok && tonCenterBalance !== undefined && tonCenterBalance !== null) {
      rememberBalance(formatTonFromNano(tonCenterBalance));
    }
  }

  return {
    responded,
    balance: Number.isFinite(best) ? best : null,
  };
}

async function fetchWalletTonBalance(wallet, chain = "") {
  const normalizedAddress = normalizeTonAddress(wallet);
  if (!normalizedAddress) return null;

  const addressCandidates = getTonAddressCandidates(normalizedAddress);
  const normalizedChain = normalizeTonChainId(chain);
  const primaryChain = normalizedChain || TON_CHAIN_MAINNET;
  const fallbackChain = primaryChain === TON_CHAIN_TESTNET ? TON_CHAIN_MAINNET : TON_CHAIN_TESTNET;
  const allowFallback = Boolean(normalizedChain);

  const primary = await fetchBalanceForChain(addressCandidates, primaryChain);
  if (primary.balance !== null) {
    if (allowFallback && primary.balance <= 0) {
      const probe = await fetchBalanceForChain(addressCandidates, fallbackChain);
      if (probe.balance !== null && probe.balance > 0) {
        return probe.balance;
      }
    }
    return primary.balance;
  }

  if (!allowFallback && primary.responded) {
    return null;
  }

  const fallback = await fetchBalanceForChain(addressCandidates, fallbackChain);
  if (fallback.balance !== null) {
    return fallback.balance;
  }

  return null;
}

function buildGiftRequestUrlLike({ userId, username, wallet }) {
  const reqUrl = new URL("http://local/gifts");
  if (userId) reqUrl.searchParams.set("user_id", userId);
  if (username) reqUrl.searchParams.set("username", username);
  if (wallet) {
    reqUrl.searchParams.set("wallet", wallet);
    reqUrl.searchParams.set("wallet_address", wallet);
    reqUrl.searchParams.set("connected_wallet", wallet);
  }
  reqUrl.searchParams.set("source", "all");
  reqUrl.searchParams.set("scope", "all");
  reqUrl.searchParams.set("include_profile", "1");
  reqUrl.searchParams.set("include_wallet", wallet ? "1" : "0");
  reqUrl.searchParams.set("include_upgraded", "1");
  reqUrl.searchParams.set("upgraded_only", "1");
  return reqUrl;
}

async function fetchUnifiedTelegramGiftItems({ userId = "", username = "", wallet = "" }) {
  const merged = [];
  merged.push(...safeArray(injectedGifts));
  merged.push(...getProfileStoredGifts(userId));

  const providerItems = await fetchProviderGifts(buildGiftRequestUrlLike({ userId, username, wallet }));
  if (providerItems.length > 0) {
    merged.push(...providerItems);
  }

  if (wallet) {
    const walletItems = await fetchTonapiWalletGifts(wallet);
    if (walletItems.length > 0) {
      merged.push(...walletItems);
    }
  }

  return dedupeGifts(merged);
}

async function buildMarketState({ userId = "", username = "", wallet = "", chain = "" }) {
  const ownerAddress = normalizeTonAddress(wallet);
  const ownItems = ownerAddress ? await fetchAccountNftItems(ownerAddress, chain) : [];
  const uniqueCollections = Array.from(
    new Set(
      safeArray(ownItems)
        .map((item) => String(item?.collection?.address ?? "").trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_COLLECTIONS_FOR_MARKET);

  const snapshots = await Promise.all(
    uniqueCollections.map((collectionAddress) => fetchCollectionMarketSnapshot(collectionAddress, ownerAddress, chain)),
  );

  const floorByCollection = new Map();
  const targetMap = new Map();
  snapshots.forEach((snapshot) => {
    if (Number.isFinite(snapshot.floorTon) && snapshot.floorTon > 0) {
      floorByCollection.set(snapshot.collectionAddress, snapshot.floorTon);
    }
    safeArray(snapshot.listings).forEach((target) => {
      if (!targetMap.has(target.id)) {
        targetMap.set(target.id, target);
      }
    });
  });

  const { profileInventory, inventory } = buildOwnedInventoryLists(ownItems, floorByCollection, "owned", "wallet");

  const rawGifts = await fetchUnifiedTelegramGiftItems({
    userId: String(userId || "").trim(),
    username: String(username || "").trim(),
    wallet: ownerAddress,
  });
  const telegramInventory = rawGifts
    .map((item, index) => buildNftModelFromGift(item, index))
    .filter(Boolean);
  const pricedTelegramGifts = telegramInventory.filter((item) => Number.isFinite(toNumber(item?.value, NaN)) && item.value > 0);

  const profileMerged = mergeUniqueNfts(profileInventory, telegramInventory);
  const inventoryMerged = mergeUniqueNfts(inventory, pricedTelegramGifts);

  let targets = Array.from(targetMap.values())
    .filter((item) => Number.isFinite(toNumber(item?.value, NaN)) && item.value > 0)
    .sort((left, right) => left.value - right.value)
    .slice(0, MAX_TARGETS);

  const bankTargets = await fetchBankWalletTargets(chain);
  if (bankTargets.length > 0) {
    targets = bankTargets;
  }

  const balanceTon = ownerAddress ? await fetchWalletTonBalance(ownerAddress, chain) : null;

  return {
    balanceTon,
    profileInventory: profileMerged,
    inventory: inventoryMerged,
    targets,
    telegramGiftsRaw: rawGifts,
  };
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

async function handleWalletBalance(reqUrl, res) {
  const wallet = firstNonEmptyString(
    reqUrl.searchParams.get("wallet"),
    reqUrl.searchParams.get("wallet_address"),
    reqUrl.searchParams.get("connected_wallet"),
  );
  const chain = String(reqUrl.searchParams.get("chain") || "").trim();
  if (!wallet) {
    sendJson(res, 400, { ok: false, error_code: "bad_request", error: "Missing wallet" });
    return;
  }

  const balanceTon = await fetchWalletTonBalance(wallet, chain);
  sendJson(res, 200, {
    ok: true,
    wallet,
    chain: normalizeTonChainId(chain) || null,
    balance_ton: Number.isFinite(toNumber(balanceTon, NaN)) ? Number(balanceTon) : null,
  });
}

async function handleBankTargets(reqUrl, res) {
  const chain = String(reqUrl.searchParams.get("chain") || "").trim();
  const targets = await fetchBankWalletTargets(chain);
  sendJson(res, 200, {
    ok: true,
    chain: normalizeTonChainId(chain) || null,
    targets,
  });
}

async function handleMarketState(reqUrl, res) {
  const userId = String(reqUrl.searchParams.get("user_id") || "").trim();
  const username = String(reqUrl.searchParams.get("username") || "").trim();
  const wallet = firstNonEmptyString(
    reqUrl.searchParams.get("wallet"),
    reqUrl.searchParams.get("wallet_address"),
    reqUrl.searchParams.get("connected_wallet"),
  );
  const chain = String(reqUrl.searchParams.get("chain") || "").trim();

  const marketState = await buildMarketState({
    userId,
    username,
    wallet,
    chain,
  });

  sendJson(res, 200, {
    ok: true,
    user_id: userId || null,
    username: username || null,
    wallet: wallet || null,
    chain: normalizeTonChainId(chain) || null,
    balance_ton: Number.isFinite(toNumber(marketState.balanceTon, NaN)) ? Number(marketState.balanceTon) : null,
    profile_inventory: marketState.profileInventory,
    inventory: marketState.inventory,
    targets: marketState.targets,
    telegram_gifts_count: safeArray(marketState.telegramGiftsRaw).length,
  });
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

  if (method === "GET" && (path === "/wallet/balance" || path === "/api/wallet/balance")) {
    await handleWalletBalance(reqUrl, res);
    return;
  }

  if (method === "GET" && (path === "/bank/targets" || path === "/api/bank/targets")) {
    await handleBankTargets(reqUrl, res);
    return;
  }

  if (method === "GET" && (path === "/market/state" || path === "/api/market/state")) {
    await handleMarketState(reqUrl, res);
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
