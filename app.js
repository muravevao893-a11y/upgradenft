const APP_VERSION = "2026-02-22-32";

const tabMeta = {
  tasks: {
    title: "",
    subtitle: "",
  },
  upgrades: {
    title: "",
    subtitle: "",
  },
  cases: {
    title: "",
    subtitle: "",
  },
  bonuses: {
    title: "",
    subtitle: "",
  },
  profile: {
    title: "",
    subtitle: "",
  },
};

const tierWeight = {
  Common: 0.92,
  Uncommon: 1,
  Rare: 1.08,
  Epic: 1.16,
  Legendary: 1.26,
};

const fallbackUser = {
  id: null,
  first_name: "Гость",
  last_name: "",
  username: "guest",
  photo_url: "",
};

const TONAPI_BASE = "https://tonapi.io/v2";
const NFT_PAGE_LIMIT = 100;
const NFT_MAX_PAGES = 4;
const COLLECTION_SCAN_LIMIT = 60;
const MAX_COLLECTIONS_FOR_MARKET = 6;
const MAX_TARGETS = 60;

const state = {
  data: {
    tasks: [],
    cases: [],
    bonuses: [],
    profileInventory: [],
    inventory: [],
    targets: [],
    dropped: [],
    stats: {
      rank: null,
      upgradesTotal: 0,
      upgradesWon: 0,
    },
  },
  selectedOwnId: null,
  selectedTargetId: null,
  profileTab: "my",
  profileTabsBound: false,
  tonConnectUI: null,
  orbitAngle: 0,
  isSpinning: false,
  spinRafId: null,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) return text;
  }
  return "";
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

function byId(list, id) {
  return list.find((item) => item.id === id) ?? null;
}

function hideElementById(id, hidden) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

function setOrbitAngle(angle) {
  state.orbitAngle = angle;
  const orbit = document.querySelector(".chance-orbit");
  if (!orbit) return;
  orbit.style.transform = `rotate(${angle}deg)`;
}

function formatTon(value) {
  const number = toNumber(value, NaN);
  if (!Number.isFinite(number)) return "-";
  return `${number.toFixed(2)} TON`;
}

function formatTonCompact(value) {
  const number = toNumber(value, NaN);
  if (!Number.isFinite(number)) return "--";
  if (number >= 100) return String(Math.round(number));
  if (number >= 10) return number.toFixed(1).replace(/\.0$/, "");
  return number.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function shortAddress(address) {
  if (!address || address.length < 12) return address || "-";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function formatTonFromNano(nanoValue) {
  try {
    const nano = BigInt(String(nanoValue));
    const negative = nano < 0n;
    const abs = negative ? -nano : nano;
    const whole = abs / 1000000000n;
    const fraction = abs % 1000000000n;
    let fractionText = fraction.toString().padStart(9, "0").slice(0, 2);
    fractionText = fractionText.replace(/0+$/, "");
    const core = fractionText ? `${whole.toString()}.${fractionText}` : whole.toString();
    return negative ? `-${core}` : core;
  } catch {
    const fallback = Number(nanoValue);
    if (!Number.isFinite(fallback)) return null;
    const ton = fallback / 1000000000;
    const text = ton.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    return text;
  }
}

async function fetchJsonWithTimeout(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWalletTonBalance(address) {
  const normalized = String(address || "").trim();
  if (!normalized) return null;
  const encoded = encodeURIComponent(normalized);

  const tonApiData = await fetchJsonWithTimeout(`https://tonapi.io/v2/accounts/${encoded}`);
  const tonApiBalance = tonApiData?.balance;
  if (tonApiBalance !== undefined && tonApiBalance !== null) {
    const parsed = formatTonFromNano(tonApiBalance);
    if (parsed !== null) return parsed;
  }

  const tonCenterData = await fetchJsonWithTimeout(`https://toncenter.com/api/v2/getAddressInformation?address=${encoded}`);
  const tonCenterBalance = tonCenterData?.result?.balance;
  if (tonCenterData?.ok && tonCenterBalance !== undefined && tonCenterBalance !== null) {
    const parsed = formatTonFromNano(tonCenterBalance);
    if (parsed !== null) return parsed;
  }

  return null;
}

function parseTokenAmount(rawValue, decimals = 9) {
  try {
    const value = BigInt(String(rawValue));
    const negative = value < 0n;
    const abs = negative ? -value : value;
    const safeDecimals = Math.max(0, Math.min(18, Math.floor(toNumber(decimals, 9))));
    const divisor = 10n ** BigInt(safeDecimals);
    const whole = abs / divisor;
    const fraction = abs % divisor;
    const fractionText = safeDecimals
      ? fraction.toString().padStart(safeDecimals, "0").slice(0, 6)
      : "";
    const combined = safeDecimals && fractionText
      ? `${whole.toString()}.${fractionText}`.replace(/\.?0+$/, "")
      : whole.toString();
    const asNumber = Number(combined);
    if (!Number.isFinite(asNumber)) return null;
    return negative ? -asNumber : asNumber;
  } catch {
    return null;
  }
}

function parseTonPriceNode(priceNode) {
  if (!priceNode || typeof priceNode !== "object") return null;
  const currencyType = String(priceNode.currency_type || "").toLowerCase();
  const tokenName = String(priceNode.token_name || "").toUpperCase();
  const isTon = currencyType === "ton" || tokenName === "TON";
  if (!isTon) return null;
  return parseTokenAmount(priceNode.value, toNumber(priceNode.decimals, 9));
}

function extractMetadataAttribute(metadata, keywords) {
  const attrs = safeArray(metadata?.attributes);
  for (const attr of attrs) {
    const key = String(
      attr?.trait_type
      ?? attr?.traitType
      ?? attr?.name
      ?? attr?.key
      ?? "",
    ).toLowerCase();
    if (!key) continue;
    if (!keywords.some((word) => key.includes(word))) continue;
    const value = String(attr?.value ?? "").trim();
    if (value) return value;
  }
  return "";
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

function isLikelyVideoUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.mp4|\.webm|\.m4v|\.mov|\.ogv|\.ogg)([\?#].*)?$/.test(raw)
    || raw.includes("video");
}

function isUnsupportedAnimationUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.tgs|\.json)([\?#].*)?$/.test(raw);
}

function pickNftAnimationUrl(item) {
  const metadata = item?.metadata ?? {};
  return normalizeMediaUrl(firstNonEmptyString(
    metadata.animation_url,
    metadata.animationUrl,
    metadata.animation,
    metadata.video,
    metadata.video_url,
    metadata.videoUrl,
    metadata.lottie,
    metadata.lottie_url,
    metadata.lottieUrl,
    metadata.tgs,
    item?.animation_url,
    item?.animationUrl,
    item?.video_url,
    item?.videoUrl,
  ));
}

function pickBestPreviewUrl(item) {
  const previews = safeArray(item?.previews);
  const bySize = previews.find((preview) => preview?.resolution === "500x500")
    ?? previews.find((preview) => preview?.resolution === "100x100")
    ?? previews.find((preview) => preview?.resolution === "1500x1500")
    ?? previews[0];
  const metadata = item?.metadata ?? {};
  const metadataImage = firstNonEmptyString(
    metadata.image,
    metadata.image_url,
    metadata.imageUrl,
    metadata.thumbnail,
    metadata.poster,
  );
  const previewUrl = String(bySize?.url ?? "").trim();
  return normalizeMediaUrl(previewUrl || metadataImage);
}

function pickNftBackgroundColor(item) {
  const metadata = item?.metadata ?? {};
  const attrColor = extractMetadataAttribute(metadata, ["background color", "bg color", "color"]);
  return normalizeColorValue(
    firstNonEmptyString(
      metadata.background_color,
      metadata.backgroundColor,
      metadata.bg_color,
      metadata.bgColor,
      attrColor,
    ),
  );
}

function pickNftBackgroundImageUrl(item) {
  const metadata = item?.metadata ?? {};
  const attrBackground = extractMetadataAttribute(metadata, ["background", "pattern"]);
  const attrBackgroundUrl = /^https?:\/\//i.test(attrBackground) ? attrBackground : "";
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
    attrBackgroundUrl,
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

function buildNftModelFromTonapiItem(item, value, fallbackId) {
  const id = String(item?.address || fallbackId || "");
  if (!id) return null;
  const animationUrl = pickNftAnimationUrl(item);
  const imageUrl = pickBestPreviewUrl(item);
  return {
    id,
    name: deriveNftName(item),
    tier: deriveNftTier(item),
    value,
    imageUrl,
    animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
    backgroundColor: pickNftBackgroundColor(item),
    backgroundImageUrl: pickNftBackgroundImageUrl(item),
    collectionAddress: String(item?.collection?.address ?? "").trim(),
    listed: Boolean(item?.sale),
  };
}

async function fetchAccountNftItems(address) {
  const owner = String(address || "").trim();
  if (!owner) return [];

  const encodedOwner = encodeURIComponent(owner);
  const collected = [];
  let offset = 0;
  let hadResponse = false;

  for (let page = 0; page < NFT_MAX_PAGES; page += 1) {
    const url = `${TONAPI_BASE}/accounts/${encodedOwner}/nfts?limit=${NFT_PAGE_LIMIT}&offset=${offset}&indirect_ownership=false`;
    const payload = await fetchJsonWithTimeout(url, 12000);
    if (!payload) {
      if (!hadResponse) return null;
      break;
    }
    hadResponse = true;

    const chunk = safeArray(payload?.nft_items);
    if (chunk.length === 0) break;
    collected.push(...chunk);
    if (chunk.length < NFT_PAGE_LIMIT) break;
    offset += NFT_PAGE_LIMIT;
  }

  return collected;
}

async function fetchCollectionMarketSnapshot(collectionAddress, ownerAddress) {
  const collection = String(collectionAddress || "").trim();
  if (!collection) {
    return { collectionAddress: "", floorTon: null, listings: [] };
  }

  const url = `${TONAPI_BASE}/nfts/collections/${encodeURIComponent(collection)}/items?limit=${COLLECTION_SCAN_LIMIT}&offset=0`;
  const payload = await fetchJsonWithTimeout(url, 12000);
  const items = safeArray(payload?.nft_items);
  const listings = [];
  let floorTon = null;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const priceTon = parseTonPriceNode(item?.sale?.price);
    if (!Number.isFinite(priceTon) || priceTon <= 0) continue;

    floorTon = floorTon === null ? priceTon : Math.min(floorTon, priceTon);

    const itemOwner = String(item?.owner?.address ?? "").trim();
    if (itemOwner && itemOwner === ownerAddress) continue;

    const mapped = buildNftModelFromTonapiItem(item, priceTon, `market-${collection}-${index}`);
    if (mapped) listings.push(mapped);
  }

  return { collectionAddress: collection, floorTon, listings };
}

async function fetchWalletMarketData(address) {
  const ownerAddress = String(address || "").trim();
  if (!ownerAddress) {
    return {
      profileInventory: [],
      inventory: [],
      targets: [],
    };
  }

  const ownItems = await fetchAccountNftItems(ownerAddress);
  if (ownItems === null) return null;
  const uniqueCollections = Array.from(
    new Set(
      ownItems
        .map((item) => String(item?.collection?.address ?? "").trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_COLLECTIONS_FOR_MARKET);

  const snapshots = await Promise.all(
    uniqueCollections.map((collectionAddress) => fetchCollectionMarketSnapshot(collectionAddress, ownerAddress)),
  );

  const floorByCollection = new Map();
  const targetMap = new Map();

  snapshots.forEach((snapshot) => {
    if (Number.isFinite(snapshot.floorTon) && snapshot.floorTon > 0) {
      floorByCollection.set(snapshot.collectionAddress, snapshot.floorTon);
    }

    snapshot.listings.forEach((target) => {
      if (!targetMap.has(target.id)) {
        targetMap.set(target.id, target);
      }
    });
  });

  const profileInventory = [];
  const inventory = [];

  ownItems.forEach((item, index) => {
    const listedPriceTon = parseTonPriceNode(item?.sale?.price);
    const collectionAddress = String(item?.collection?.address ?? "").trim();
    const floorTon = floorByCollection.get(collectionAddress) ?? null;
    const resolvedValue = Number.isFinite(listedPriceTon) && listedPriceTon > 0
      ? listedPriceTon
      : floorTon;

    const profileItem = buildNftModelFromTonapiItem(
      item,
      Number.isFinite(resolvedValue) ? resolvedValue : NaN,
      `owned-${index + 1}`,
    );
    if (!profileItem) return;

    profileInventory.push(profileItem);

    if (Number.isFinite(resolvedValue) && resolvedValue > 0) {
      inventory.push({ ...profileItem, value: resolvedValue });
    }
  });

  const targets = Array.from(targetMap.values())
    .filter((item) => Number.isFinite(item.value) && item.value > 0)
    .sort((left, right) => left.value - right.value)
    .slice(0, MAX_TARGETS);

  return {
    profileInventory,
    inventory,
    targets,
  };
}

function shortUserId(userId) {
  const raw = String(userId ?? "").trim();
  if (!raw) return "";
  if (raw.length <= 9) return raw;
  return `${raw.slice(0, 4)}...${raw.slice(-4)}`;
}

function normalizeDisplayName(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "";

  const hasUpper = /[A-ZА-ЯЁ]/.test(raw);
  const hasLower = /[a-zа-яё]/.test(raw);

  if (!hasUpper || hasLower) return raw;
  return raw.toLowerCase().replace(/(^|[\s-])\S/g, (letter) => letter.toUpperCase());
}

function normalizeNftList(rawList, prefix) {
  return safeArray(rawList)
    .map((item, index) => {
      const name = String(item?.name ?? item?.title ?? "").trim();
      const value = toNumber(item?.value ?? item?.price, NaN);
      const animationUrl = normalizeMediaUrl(firstNonEmptyString(
        item?.animationUrl,
        item?.animation_url,
        item?.videoUrl,
        item?.video_url,
        item?.animation,
        item?.video,
      ));

      if (!name || !Number.isFinite(value) || value < 0) {
        return null;
      }

      return {
        id: String(item?.id ?? `${prefix}-${index + 1}`),
        name,
        tier: String(item?.tier ?? "Unknown"),
        value,
        imageUrl: normalizeMediaUrl(firstNonEmptyString(
          item?.imageUrl,
          item?.image,
          item?.photo_url,
          item?.photoUrl,
          item?.preview,
        )),
        animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
        backgroundColor: normalizeColorValue(
          item?.backgroundColor
          ?? item?.background_color
          ?? item?.bgColor
          ?? item?.bg_color
          ?? "",
        ),
        backgroundImageUrl: normalizeMediaUrl(firstNonEmptyString(
          item?.backgroundImageUrl,
          item?.background_image,
          item?.bgImage,
          item?.bg_image,
          item?.patternUrl,
          item?.pattern_url,
        )),
        listed: Boolean(item?.listed),
      };
    })
    .filter(Boolean);
}

function normalizeServerData(rawData) {
  const data = rawData && typeof rawData === "object" ? rawData : {};
  const statsRaw = data.stats && typeof data.stats === "object" ? data.stats : {};

  const tasks = safeArray(data.tasks)
    .map((item, index) => {
      const title = String(item?.title ?? "").trim();
      if (!title) return null;
      return {
        id: String(item?.id ?? `task-${index + 1}`),
        title,
        reward: String(item?.reward ?? "").trim(),
        status: String(item?.status ?? "").trim(),
      };
    })
    .filter(Boolean);

  const cases = safeArray(data.cases)
    .map((item, index) => {
      const title = String(item?.title ?? item?.name ?? "").trim();
      if (!title) return null;
      return {
        id: String(item?.id ?? `case-${index + 1}`),
        title,
        risk: String(item?.risk ?? "").trim(),
      };
    })
    .filter(Boolean);

  const bonuses = safeArray(data.bonuses)
    .map((item, index) => {
      const title = String(item?.title ?? item?.name ?? "").trim();
      if (!title) return null;
      return {
        id: String(item?.id ?? `bonus-${index + 1}`),
        title,
        value: String(item?.value ?? "").trim(),
      };
    })
    .filter(Boolean);

  const inventory = normalizeNftList(data.inventory, "inv");

  return {
    tasks,
    cases,
    bonuses,
    profileInventory: inventory,
    inventory,
    targets: normalizeNftList(data.targets, "target"),
    dropped: normalizeNftList(data.dropped, "drop"),
    stats: {
      rank: statsRaw.rank ?? null,
      upgradesTotal: Math.max(0, Math.floor(toNumber(statsRaw.upgradesTotal, 0))),
      upgradesWon: Math.max(0, Math.floor(toNumber(statsRaw.upgradesWon, 0))),
    },
  };
}

async function loadAppData() {
  let incoming = null;

  if (window.__UPNFT_DATA__ && typeof window.__UPNFT_DATA__ === "object") {
    incoming = window.__UPNFT_DATA__;
  }

  if (!incoming) {
    try {
      const response = await fetch(`./app-data.json?v=${APP_VERSION}`, { cache: "no-store" });
      if (response.ok) {
        incoming = await response.json();
      }
    } catch (_) {}
  }

  state.data = normalizeServerData(incoming || {});
  ensureSelectedIds();
}

function ensureSelectedIds() {
  if (!byId(state.data.inventory, state.selectedOwnId)) {
    state.selectedOwnId = state.data.inventory[0]?.id ?? null;
  }

  if (!byId(state.data.targets, state.selectedTargetId)) {
    state.selectedTargetId = state.data.targets[0]?.id ?? null;
  }
}

function setupTabs() {
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const sections = Array.from(document.querySelectorAll("[data-tab-section]"));
  const title = document.getElementById("screen-title");
  const subtitle = document.getElementById("screen-subtitle");

  const setTab = (nextTab) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.tab === nextTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    sections.forEach((section) => {
      section.classList.toggle("is-active", section.dataset.tabSection === nextTab);
    });

    const subtitleText = tabMeta[nextTab].subtitle || "";
    title.textContent = tabMeta[nextTab].title;
    subtitle.textContent = subtitleText;
    subtitle.classList.toggle("hidden", nextTab === "profile" || !subtitleText);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  const defaultTab = document.querySelector(".nav-btn.is-active")?.dataset.tab || "upgrades";
  setTab(defaultTab);
}

function createTonIcon() {
  const iconWrap = document.createElement("span");
  iconWrap.className = "ton-badge-icon";
  iconWrap.innerHTML = `
    <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <path d="M28 6.8h17.6c3.4 0 5.6 3.7 3.9 6.7L31.5 43.8c-1.6 2.8-5.6 2.8-7.2 0L6.5 13.5c-1.7-3 .5-6.7 3.9-6.7H28Zm0 7.4H14.3l13.7 23.3 13.7-23.3H28Z"></path>
    </svg>
  `;
  return iconWrap;
}

function resolveNftMediaUrl(nft) {
  const animationUrl = String(nft?.animationUrl ?? "").trim();
  if (animationUrl && !isUnsupportedAnimationUrl(animationUrl)) {
    return animationUrl;
  }
  return String(nft?.imageUrl ?? "").trim();
}

function createNftPriceBadge(value) {
  const badge = document.createElement("div");
  badge.className = "nft-price-badge";

  const tonIcon = createTonIcon();
  const text = document.createElement("span");
  text.className = "nft-price-value";
  text.textContent = formatTonCompact(value);

  badge.append(tonIcon, text);
  return badge;
}

function createNftMediaNode(mediaUrl, nftName) {
  if (!mediaUrl) return null;

  if (isLikelyVideoUrl(mediaUrl)) {
    const video = document.createElement("video");
    video.className = "nft-media";
    video.src = mediaUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.preload = "metadata";
    return video;
  }

  const img = document.createElement("img");
  img.className = "nft-media";
  img.src = mediaUrl;
  img.alt = nftName || "NFT";
  img.loading = "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  return img;
}

function createNftThumb(nft) {
  const thumb = document.createElement("div");
  thumb.className = "nft-thumb";

  if (nft.backgroundColor) {
    thumb.style.setProperty("--nft-bg-color", nft.backgroundColor);
  }

  const bgLayer = document.createElement("div");
  bgLayer.className = "nft-bg-layer";
  thumb.append(bgLayer);

  const backgroundImageUrl = String(nft?.backgroundImageUrl ?? "").trim();
  if (backgroundImageUrl) {
    const bgPattern = document.createElement("img");
    bgPattern.className = "nft-bg-pattern";
    bgPattern.src = backgroundImageUrl;
    bgPattern.alt = "";
    bgPattern.loading = "lazy";
    bgPattern.decoding = "async";
    bgPattern.referrerPolicy = "no-referrer";
    bgPattern.setAttribute("aria-hidden", "true");
    thumb.append(bgPattern);
  }

  const mediaUrl = resolveNftMediaUrl(nft);
  const mediaNode = createNftMediaNode(mediaUrl, nft.name);
  if (mediaNode) {
    thumb.append(mediaNode);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "nft-media-fallback";
    fallback.textContent = String(nft.name || "NFT").trim().slice(0, 1).toUpperCase() || "N";
    thumb.append(fallback);
  }

  const overlay = document.createElement("div");
  overlay.className = "nft-thumb-overlay";
  thumb.append(overlay, createNftPriceBadge(nft.value));

  return thumb;
}

function createNftCardBody(nft) {
  const body = document.createElement("div");
  body.className = "nft-body";

  const title = document.createElement("strong");
  title.textContent = nft.name;

  const meta = document.createElement("div");
  meta.className = "nft-meta";

  const tier = document.createElement("small");
  tier.textContent = nft.tier || "NFT";

  const status = document.createElement("span");
  status.className = `nft-status${nft.listed ? " is-listed" : ""}`;
  status.textContent = nft.listed ? "LISTED" : "WALLET";

  meta.append(tier, status);
  body.append(title, meta);
  return body;
}

function createOwnNftCard(nft, isActive) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `nft-card${isActive ? " is-active" : ""}`;
  card.dataset.id = nft.id;
  card.append(createNftThumb(nft), createNftCardBody(nft));
  return card;
}

function createProfileNftCard(nft) {
  const card = document.createElement("article");
  card.className = "profile-nft-card";
  card.append(createNftThumb(nft), createNftCardBody(nft));
  return card;
}

function renderTasks() {
  const list = document.getElementById("tasks-list");
  list.innerHTML = "";

  state.data.tasks.forEach((task) => {
    const row = document.createElement("article");
    row.className = "simple-item";

    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = task.title;
    const status = document.createElement("small");
    status.textContent = task.status || "Активно";
    left.append(title, status);

    const reward = document.createElement("span");
    reward.textContent = task.reward || "-";

    row.append(left, reward);
    list.append(row);
  });

  hideElementById("tasks-empty", state.data.tasks.length > 0);
}

function renderCases() {
  const list = document.getElementById("cases-list");
  list.innerHTML = "";

  state.data.cases.forEach((item) => {
    const card = document.createElement("article");
    card.className = "case-item";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const risk = document.createElement("span");
    risk.textContent = item.risk || "-";

    card.append(title, risk);
    list.append(card);
  });

  hideElementById("cases-empty", state.data.cases.length > 0);
}

function renderBonuses() {
  const list = document.getElementById("bonuses-list");
  list.innerHTML = "";

  state.data.bonuses.forEach((bonus) => {
    const row = document.createElement("article");
    row.className = "simple-item";

    const title = document.createElement("strong");
    title.textContent = bonus.title;

    const value = document.createElement("span");
    value.textContent = bonus.value || "-";

    row.append(title, value);
    list.append(row);
  });

  hideElementById("bonuses-empty", state.data.bonuses.length > 0);
}

function renderTargetChips() {
  ensureSelectedIds();
  const list = document.getElementById("target-nft-list");
  const emptyNode = document.getElementById("target-empty");
  list.innerHTML = "";

  state.data.targets.forEach((target) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `target-chip${target.id === state.selectedTargetId ? " is-active" : ""}`;
    chip.dataset.id = target.id;

    const name = document.createElement("b");
    name.textContent = target.name;

    const value = document.createElement("span");
    value.textContent = formatTon(target.value);

    chip.append(name, value);
    chip.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedTargetId = target.id;
      renderTargetChips();
      refreshUpgradeState();
    });

    list.append(chip);
  });

  if (emptyNode) {
    emptyNode.textContent = "Нет рыночных целей для апгрейда.";
  }
  hideElementById("target-empty", state.data.targets.length > 0);
}

function renderOwnNftCards() {
  ensureSelectedIds();
  const list = document.getElementById("own-nft-list");
  const emptyNode = document.getElementById("own-empty");
  list.innerHTML = "";

  state.data.inventory.forEach((nft) => {
    const card = createOwnNftCard(nft, nft.id === state.selectedOwnId);
    card.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedOwnId = nft.id;
      renderOwnNftCards();
      refreshUpgradeState();
    });
    list.append(card);
  });

  if (emptyNode) {
    if (state.data.profileInventory.length > 0 && state.data.inventory.length === 0) {
      emptyNode.textContent = "Нет NFT с рыночной ценой в TON.";
    } else {
      emptyNode.textContent = "NFT не загружены.";
    }
  }

  hideElementById("own-empty", state.data.inventory.length > 0);
}

function calculateChance(source, target) {
  if (!source || !target) return 0;

  const ratio = source.value / target.value;
  const valueFactor = Math.pow(Math.max(ratio, 0.01), 0.88) * 58;
  const tierFactor = ((tierWeight[source.tier] || 1) / (tierWeight[target.tier] || 1)) * 16;
  const valuePenalty = Math.max(0, target.value - source.value) * 2.4;
  const rawChance = valueFactor + tierFactor - valuePenalty + 6;

  return clamp(rawChance, 3, 91);
}

function refreshUpgradeState() {
  ensureSelectedIds();

  const source = byId(state.data.inventory, state.selectedOwnId);
  const target = byId(state.data.targets, state.selectedTargetId);
  const chance = calculateChance(source, target);

  const chanceRing = document.getElementById("chance-ring");
  const chanceValue = document.getElementById("chance-value");
  const note = document.getElementById("math-note");
  const button = document.getElementById("upgrade-btn");

  if (!source || !target) {
    chanceRing.classList.add("is-empty");
    chanceRing.style.setProperty("--chance", "0");
    chanceValue.textContent = "0%";
    note.textContent = "Выбери NFT";
    button.disabled = true;
    return;
  }

  chanceRing.classList.remove("is-empty");
  chanceRing.style.setProperty("--chance", chance.toFixed(2));
  chanceValue.textContent = `${chance.toFixed(1)}%`;
  note.textContent = `${source.name} → ${target.name}`;
  button.disabled = state.isSpinning;
}

function spinArrowToResult(chancePercent) {
  const chanceDegrees = chancePercent * 3.6;
  const targetAngle = Math.random() * 360;
  const currentNormalized = normalizeAngle(state.orbitAngle);
  const deltaToTarget = (targetAngle - currentNormalized + 360) % 360;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const totalDelta = (extraSpins * 360) + deltaToTarget;
  const startAngle = state.orbitAngle;
  const duration = 2600 + Math.random() * 700;
  const startTime = performance.now();

  return new Promise((resolve) => {
    const step = (now) => {
      const progress = clamp((now - startTime) / duration, 0, 1);
      const eased = easeOutCubic(progress);
      const angle = startAngle + (totalDelta * eased);
      setOrbitAngle(angle);

      if (progress < 1) {
        state.spinRafId = requestAnimationFrame(step);
        return;
      }

      state.spinRafId = null;
      const landed = normalizeAngle(startAngle + totalDelta);
      const success = landed <= chanceDegrees;
      resolve({ success, landed });
    };

    state.spinRafId = requestAnimationFrame(step);
  });
}

function applyUpgradeResult(success, source, target, landedAngle, chance, resultNode) {
  state.data.inventory = state.data.inventory.filter((nft) => nft.id !== source.id);
  state.data.profileInventory = state.data.profileInventory.filter((nft) => nft.id !== source.id);
  state.data.stats.upgradesTotal += 1;

  if (success) {
    state.data.stats.upgradesWon += 1;
    const minted = {
      ...target,
      id: `mint-${Date.now()}`,
    };
    state.data.inventory.unshift(minted);
    state.data.profileInventory.unshift(minted);
    state.data.dropped.unshift(minted);
  }

  if (success) {
    resultNode.textContent = "Успех";
    resultNode.classList.remove("fail");
    resultNode.classList.add("success");
  } else {
    resultNode.textContent = "Неудача";
    resultNode.classList.remove("success");
    resultNode.classList.add("fail");
  }
}

function setupUpgradeFlow() {
  const actionButton = document.getElementById("upgrade-btn");
  const result = document.getElementById("upgrade-result");

  actionButton.addEventListener("click", async () => {
    if (state.isSpinning) return;

    const source = byId(state.data.inventory, state.selectedOwnId);
    const target = byId(state.data.targets, state.selectedTargetId);
    if (!source || !target) return;

    const chance = calculateChance(source, target);
    state.isSpinning = true;

    actionButton.disabled = true;
    actionButton.textContent = "Крутим...";
    result.classList.remove("success", "fail");
    result.textContent = "";

    try {
      const spinResult = await spinArrowToResult(chance);
      applyUpgradeResult(spinResult.success, source, target, spinResult.landed, chance, result);
    } finally {
      state.isSpinning = false;
      actionButton.textContent = "Запустить апгрейд";
      renderAll();
    }
  });
}

function renderProfileGrid(gridId, emptyId, list) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";

  list.forEach((nft) => {
    grid.append(createProfileNftCard(nft));
  });

  hideElementById(emptyId, list.length > 0);
}

function refreshProfileStats() {
  const stats = state.data.stats;
  const nftCount = state.data.profileInventory.length;
  const total = Math.max(0, stats.upgradesTotal);
  const won = Math.max(0, stats.upgradesWon);
  const winrate = total > 0 ? (won / total) * 100 : null;

  document.getElementById("profile-rank").textContent = stats.rank ?? "-";
  document.getElementById("stat-nft-count").textContent = String(nftCount);
  document.getElementById("stat-upgrades").textContent = total > 0 ? String(total) : "-";
  document.getElementById("stat-winrate").textContent = winrate === null ? "-" : `${winrate.toFixed(1)}%`;
}

function applyProfileTab(tab) {
  state.profileTab = tab;

  const tabButtons = Array.from(document.querySelectorAll(".profile-tab-btn"));
  const grids = Array.from(document.querySelectorAll(".profile-nft-grid"));

  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.profileTab === tab);
  });

  grids.forEach((grid) => {
    grid.classList.toggle("is-active", grid.dataset.profileGrid === tab);
  });

  hideElementById("my-empty", !(tab === "my" && state.data.profileInventory.length === 0));
  hideElementById("dropped-empty", !(tab === "dropped" && state.data.dropped.length === 0));
}

function setupProfileTabs() {
  const buttons = Array.from(document.querySelectorAll(".profile-tab-btn"));
  if (!state.profileTabsBound) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => applyProfileTab(button.dataset.profileTab));
    });
    state.profileTabsBound = true;
  }
  applyProfileTab(state.profileTab);
}

function renderAll() {
  renderTasks();
  renderCases();
  renderBonuses();
  renderTargetChips();
  renderOwnNftCards();
  refreshUpgradeState();
  renderProfileGrid("my-nft-grid", "my-empty", state.data.profileInventory);
  renderProfileGrid("dropped-nft-grid", "dropped-empty", state.data.dropped);
  refreshProfileStats();
  setupProfileTabs();
}

function setAvatar(container, user) {
  if (!container) return;

  const seed = (user.first_name || user.username || "U").trim();
  const initial = seed ? seed[0].toUpperCase() : "U";

  if (!user.photo_url) {
    container.textContent = initial;
    return;
  }

  const img = document.createElement("img");
  img.src = user.photo_url;
  img.alt = "User avatar";
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  container.replaceChildren(img);
}

function applyUserProfile(user) {
  const fullNameRaw = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const fullName = normalizeDisplayName(fullNameRaw) || "Гость";
  const handle = user.username ? `@${String(user.username).trim()}` : "";
  const compactId = shortUserId(user.id);

  const nameNode = document.getElementById("profile-name");
  const handleNode = document.getElementById("profile-handle");
  const idNode = document.getElementById("profile-id");

  nameNode.textContent = fullName;
  handleNode.textContent = handle;
  handleNode.classList.toggle("hidden", !handle);

  if (compactId) {
    idNode.textContent = `ID ${compactId}`;
    idNode.classList.remove("hidden");
  } else {
    idNode.textContent = "";
    idNode.classList.add("hidden");
  }

  setAvatar(document.getElementById("profile-avatar"), user);
  setAvatar(document.getElementById("nav-avatar"), user);
}

function setupTelegramUser() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    applyUserProfile(fallbackUser);
    return;
  }

  try {
    tg.ready();
    tg.expand();
    if (typeof tg.setBackgroundColor === "function") tg.setBackgroundColor("#0a0b0f");
    if (typeof tg.setHeaderColor === "function") tg.setHeaderColor("#0a0b0f");
    if (typeof tg.disableVerticalSwipes === "function") tg.disableVerticalSwipes();

    const user = tg.initDataUnsafe?.user;
    applyUserProfile(user ? { ...fallbackUser, ...user } : fallbackUser);
  } catch (error) {
    console.error("Telegram WebApp init error:", error);
    applyUserProfile(fallbackUser);
  }
}

function setupTonConnect() {
  const connectButton = document.getElementById("connect-wallet-btn");
  const walletShort = document.getElementById("wallet-short");
  const walletBubble = document.getElementById("wallet-bubble");
  const walletBubbleBalance = document.getElementById("wallet-bubble-balance");
  const walletBubbleAddress = document.getElementById("wallet-bubble-address");
  const appShell = document.getElementById("app-shell");
  let balanceRefreshTimer = null;
  let balanceRequestToken = 0;
  let nftRefreshTimer = null;
  let nftRequestToken = 0;

  const setWalletButtonText = (label) => {
    const textNode = connectButton.querySelector(".wallet-btn-text");
    if (textNode) {
      textNode.textContent = label;
      return;
    }
    connectButton.textContent = label;
  };

  const stopBalancePolling = () => {
    balanceRequestToken += 1;
    if (balanceRefreshTimer) {
      clearInterval(balanceRefreshTimer);
      balanceRefreshTimer = null;
    }
  };

  const setBubbleState = (connected, address = "") => {
    walletBubble.classList.toggle("hidden", !connected);
    appShell.classList.toggle("has-wallet", connected);
    if (!connected) return;
    walletBubbleAddress.textContent = shortAddress(address);
  };

  const loadWalletBalance = async (address) => {
    const token = ++balanceRequestToken;
    walletBubbleBalance.textContent = "Баланс...";
    const balance = await fetchWalletTonBalance(address);
    if (token !== balanceRequestToken) return;
    walletBubbleBalance.textContent = balance ? `${balance} TON` : "-- TON";
  };

  const startBalancePolling = (address) => {
    stopBalancePolling();
    void loadWalletBalance(address);
    balanceRefreshTimer = window.setInterval(() => {
      void loadWalletBalance(address);
    }, 30000);
  };

  const stopNftPolling = () => {
    nftRequestToken += 1;
    if (nftRefreshTimer) {
      clearInterval(nftRefreshTimer);
      nftRefreshTimer = null;
    }
  };

  const applyWalletMarketData = (marketData) => {
    state.data.profileInventory = safeArray(marketData?.profileInventory);
    state.data.inventory = safeArray(marketData?.inventory);
    state.data.targets = safeArray(marketData?.targets);

    ensureSelectedIds();
    renderAll();
  };

  const loadWalletNfts = async (address) => {
    const token = ++nftRequestToken;
    walletShort.textContent = "Синхронизация NFT...";
    const marketData = await fetchWalletMarketData(address);
    if (token !== nftRequestToken) return;

    if (!marketData) {
      walletShort.textContent = "Ошибка загрузки NFT";
      return;
    }

    applyWalletMarketData(marketData);

    if (marketData.profileInventory.length === 0) {
      walletShort.textContent = "В кошельке нет NFT";
    } else if (marketData.inventory.length === 0) {
      walletShort.textContent = "NFT загружены, но нет TON-цен";
    } else {
      walletShort.textContent = `NFT: ${marketData.profileInventory.length}`;
    }
  };

  const startNftPolling = (address) => {
    stopNftPolling();
    void loadWalletNfts(address);
    nftRefreshTimer = window.setInterval(() => {
      void loadWalletNfts(address);
    }, 90000);
  };

  if (!window.TON_CONNECT_UI?.TonConnectUI) {
    walletShort.textContent = "TonConnect UI не загружен";
    connectButton.disabled = true;
    setBubbleState(false);
    return;
  }

  const manifestUrl = new URL(`./tonconnect-manifest.json?v=${APP_VERSION}`, window.location.href).toString();

  try {
    state.tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
      manifestUrl,
    });
  } catch (error) {
    console.error("TonConnect init error:", error);
    walletShort.textContent = "Ошибка инициализации TON Connect";
    connectButton.disabled = true;
    setBubbleState(false);
    return;
  }

  const paintConnectionState = (wallet) => {
    const address = wallet?.account?.address || state.tonConnectUI?.account?.address || "";
    const connected = Boolean(address);

    setWalletButtonText("Connect Wallet");
    connectButton.classList.toggle("hidden", connected);
    connectButton.disabled = false;
    setBubbleState(connected, address);

    if (connected) {
      walletShort.textContent = "Синхронизация NFT...";
      startBalancePolling(address);
      startNftPolling(address);
    } else {
      stopBalancePolling();
      stopNftPolling();
      walletBubbleBalance.textContent = "-- TON";
      walletBubbleAddress.textContent = "...";
      walletShort.textContent = "Кошелек не подключен";
      void loadAppData().then(() => {
        renderAll();
      });
    }
  };

  paintConnectionState(state.tonConnectUI.wallet);

  state.tonConnectUI.onStatusChange(
    (wallet) => paintConnectionState(wallet),
    (error) => console.error("TonConnect status error:", error),
  );

  connectButton.addEventListener("click", async () => {
    try {
      await state.tonConnectUI.openModal();
    } catch (error) {
      console.error("TonConnect action error:", error);
      walletShort.textContent = "Не удалось подключить кошелек";
    }
  });
}

async function bootstrap() {
  setupTabs();
  setupTelegramUser();
  setOrbitAngle(state.orbitAngle);
  setupUpgradeFlow();

  renderAll();
  await loadAppData();
  renderAll();
  setupTonConnect();
}

bootstrap();

