const APP_VERSION = "2026-02-22-41";

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

const TONAPI_BASE = String(window.__UPNFT_TONAPI_BASE__ || "https://tonapi.io/v2").replace(/\/$/, "");
const TONCENTER_BASE = String(window.__UPNFT_TONCENTER_BASE__ || "https://toncenter.com/api/v2").replace(/\/$/, "");
const NFT_PAGE_LIMIT = 100;
const NFT_MAX_PAGES = 4;
const COLLECTION_SCAN_LIMIT = 60;
const MAX_COLLECTIONS_FOR_MARKET = 6;
const MAX_TARGETS = 60;
const HISTORY_LIMIT = 60;
const RENDER_CHUNK_SIZE = 16;
const STALE_MS = 120000;

const LOCAL_KEYS = {
  history: "upnft_history_v1",
  analytics: "upnft_analytics_v1",
  fair: "upnft_fair_v1",
};

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
  profileCopyBound: false,
  upgradesUiBound: false,
  tonConnectUI: null,
  tonAddress: "",
  refreshWalletData: null,
  openWalletModal: null,
  orbitAngle: 0,
  isSpinning: false,
  spinRafId: null,
  chanceRafId: null,
  displayedChance: 0,
  ui: {
    ownSearch: "",
    ownSort: "value-desc",
    targetSearch: "",
    targetSort: "value-asc",
  },
  history: [],
  analytics: {
    launches: 0,
    walletConnects: 0,
    nftSyncSuccess: 0,
    upgradeAttempts: 0,
    upgradeWins: 0,
    upgradeLosses: 0,
    filtersUsed: 0,
    lastUpdated: 0,
  },
  network: {
    online: navigator.onLine !== false,
    status: "idle",
    detail: "",
    pending: 0,
    lastSuccessAt: 0,
  },
  fair: {
    nonce: 0,
    serverSeed: "",
    commitment: "",
    nextSeed: "",
    nextCommitment: "",
    ready: false,
  },
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

function easeInOutCubic(t) {
  if (t < 0.5) return 4 * t * t * t;
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function randomUnit() {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return Math.random();
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

async function copyTextToClipboard(text) {
  const payload = String(text ?? "").trim();
  if (!payload) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
      return true;
    }
  } catch {
    // Continue to fallback.
  }

  try {
    const temp = document.createElement("textarea");
    temp.value = payload;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    temp.style.pointerEvents = "none";
    document.body.append(temp);
    temp.select();
    const copied = document.execCommand("copy");
    temp.remove();
    return copied;
  } catch {
    return false;
  }
}

function showCopyFeedback(node) {
  if (!node) return;
  if (!node.dataset.copyLabel) {
    node.dataset.copyLabel = node.textContent || "";
  }

  if (node.__copyTimer) {
    clearTimeout(node.__copyTimer);
  }

  node.textContent = "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E";
  node.classList.add("is-copied");

  node.__copyTimer = setTimeout(() => {
    node.textContent = node.dataset.copyLabel || node.textContent || "";
    node.classList.remove("is-copied");
    node.__copyTimer = null;
  }, 950);
}

function setupProfileCopyActions() {
  if (state.profileCopyBound) return;

  const handleNode = document.getElementById("profile-handle");
  const idNode = document.getElementById("profile-id");
  const copyNodes = [handleNode, idNode].filter(Boolean);

  copyNodes.forEach((node) => {
    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C");

    const triggerCopy = async () => {
      const value = String(node.dataset.copyValue || "").trim();
      if (!value) return;
      const copied = await copyTextToClipboard(value);
      if (copied) showCopyFeedback(node);
    };

    node.addEventListener("click", () => {
      void triggerCopy();
    });

    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      void triggerCopy();
    });
  });

  state.profileCopyBound = true;
}

function nowMs() {
  return Date.now();
}

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota/private mode errors.
  }
}

function shortHash(value, prefix = 8, suffix = 8) {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";
  if (raw.length <= prefix + suffix + 3) return raw;
  return `${raw.slice(0, prefix)}...${raw.slice(-suffix)}`;
}

function updateNetworkPill() {
  const pill = document.getElementById("network-pill");
  const text = document.getElementById("network-pill-text");
  if (!pill || !text) return;

  const { status, detail } = state.network;
  const fallbackMap = {
    idle: "Ожидание",
    syncing: "Синхронизация",
    ready: "Данные актуальны",
    stale: "Данные устарели",
    offline: "Нет сети",
    error: "Ошибка сети",
  };
  const label = detail || fallbackMap[status] || "Статус сети";

  pill.className = `network-pill${status ? ` is-${status}` : ""}`;
  text.textContent = label;
  pill.classList.remove("hidden");
}

function setNetworkStatus(status, detail = "") {
  state.network.status = status;
  state.network.detail = detail;
  if (status === "ready") {
    state.network.lastSuccessAt = nowMs();
  }
  updateNetworkPill();
}

function markNetworkRequestStart() {
  state.network.pending += 1;
  if (state.network.online) {
    setNetworkStatus("syncing", "Синхронизация");
  } else {
    setNetworkStatus("offline", "Нет сети");
  }
}

function markNetworkRequestEnd(ok) {
  state.network.pending = Math.max(0, state.network.pending - 1);
  if (state.network.pending > 0) return;

  if (!state.network.online) {
    setNetworkStatus("offline", "Нет сети");
    return;
  }

  if (ok) {
    setNetworkStatus("ready", "Данные актуальны");
    return;
  }

  setNetworkStatus("error", "Ошибка сети");
}

function monitorNetworkFreshness() {
  window.addEventListener("online", () => {
    state.network.online = true;
    setNetworkStatus("ready", "Сеть восстановлена");
  });
  window.addEventListener("offline", () => {
    state.network.online = false;
    setNetworkStatus("offline", "Нет сети");
  });

  window.setInterval(() => {
    if (!state.network.lastSuccessAt || state.network.pending > 0 || !state.network.online) return;
    if (nowMs() - state.network.lastSuccessAt > STALE_MS) {
      setNetworkStatus("stale", "Данные устарели");
    }
  }, 15000);
}

function recordAnalytics(eventName) {
  if (!eventName) return;
  if (!(eventName in state.analytics)) return;
  state.analytics[eventName] += 1;
  state.analytics.lastUpdated = nowMs();
  writeLocalJson(LOCAL_KEYS.analytics, state.analytics);
}

function renderAnalyticsRow() {
  const node = document.getElementById("analytics-row");
  if (!node) return;

  const attempts = state.analytics.upgradeAttempts;
  const wins = state.analytics.upgradeWins;
  const conversion = attempts > 0 ? `${((wins / attempts) * 100).toFixed(1)}%` : "-";

  node.innerHTML = "";

  const cells = [
    { label: "Запусков", value: String(state.analytics.launches) },
    { label: "Круток", value: String(attempts) },
    { label: "Конверсия", value: conversion },
  ];

  cells.forEach((cell) => {
    const item = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = cell.label;
    const value = document.createElement("strong");
    value.textContent = cell.value;
    item.append(label, value);
    node.append(item);
  });
}

function loadPersistentData() {
  const savedHistory = readLocalJson(LOCAL_KEYS.history, []);
  state.history = safeArray(savedHistory).slice(0, HISTORY_LIMIT);

  const savedAnalytics = readLocalJson(LOCAL_KEYS.analytics, null);
  if (savedAnalytics && typeof savedAnalytics === "object") {
    state.analytics = {
      ...state.analytics,
      ...savedAnalytics,
    };
  }

  const savedFair = readLocalJson(LOCAL_KEYS.fair, null);
  if (savedFair && typeof savedFair === "object") {
    state.fair = {
      ...state.fair,
      ...savedFair,
      ready: false,
    };
  }
}

async function sha256Hex(input) {
  const text = String(input ?? "");
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(bytes = 32) {
  const safeBytes = Math.max(8, Math.min(128, Math.floor(toNumber(bytes, 32))));
  const buffer = new Uint8Array(safeBytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function prepareFairState() {
  if (!state.fair.serverSeed) {
    state.fair.serverSeed = randomHex(32);
  }

  if (!state.fair.nextSeed) {
    state.fair.nextSeed = randomHex(32);
  }

  state.fair.commitment = await sha256Hex(state.fair.serverSeed);
  state.fair.nextCommitment = await sha256Hex(state.fair.nextSeed);
  state.fair.ready = true;
  writeLocalJson(LOCAL_KEYS.fair, {
    nonce: state.fair.nonce,
    serverSeed: state.fair.serverSeed,
    commitment: state.fair.commitment,
    nextSeed: state.fair.nextSeed,
    nextCommitment: state.fair.nextCommitment,
  });
}

function renderFairCommitment() {
  const hashNode = document.getElementById("fair-commitment");
  if (!hashNode) return;
  hashNode.textContent = shortHash(state.fair.commitment, 10, 10);
  hashNode.title = state.fair.commitment || "";
}

async function rotateFairState() {
  state.fair.serverSeed = state.fair.nextSeed || randomHex(32);
  state.fair.nextSeed = randomHex(32);
  state.fair.commitment = await sha256Hex(state.fair.serverSeed);
  state.fair.nextCommitment = await sha256Hex(state.fair.nextSeed);
  state.fair.ready = true;
  writeLocalJson(LOCAL_KEYS.fair, {
    nonce: state.fair.nonce,
    serverSeed: state.fair.serverSeed,
    commitment: state.fair.commitment,
    nextSeed: state.fair.nextSeed,
    nextCommitment: state.fair.nextCommitment,
  });
  renderFairCommitment();
}

async function getFairRoll(chancePercent) {
  if (!state.fair.ready) {
    await prepareFairState();
  }

  const nonce = state.fair.nonce + 1;
  const clientSeedRaw = [
    state.tonAddress || "no-wallet",
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? "anon",
    nowMs(),
    randomHex(8),
  ].join(":");
  const clientSeed = await sha256Hex(clientSeedRaw);
  const digest = await sha256Hex(`${state.fair.serverSeed}:${clientSeed}:${nonce}`);
  const fraction = parseInt(digest.slice(0, 13), 16) / 0x20000000000000;
  const targetAngle = normalizeAngle(fraction * 360);
  const chanceDegrees = clamp(chancePercent, 0, 100) * 3.6;
  const success = targetAngle <= chanceDegrees;

  state.fair.nonce = nonce;
  writeLocalJson(LOCAL_KEYS.fair, {
    nonce: state.fair.nonce,
    serverSeed: state.fair.serverSeed,
    commitment: state.fair.commitment,
    nextSeed: state.fair.nextSeed,
    nextCommitment: state.fair.nextCommitment,
  });

  return {
    nonce,
    targetAngle,
    success,
    digest,
    clientSeed,
    serverSeed: state.fair.serverSeed,
    commitment: state.fair.commitment,
  };
}

function clearHistory() {
  state.history = [];
  writeLocalJson(LOCAL_KEYS.history, state.history);
  renderUpgradeHistory();
}

function pushHistoryEntry(entry) {
  state.history.unshift(entry);
  state.history = state.history.slice(0, HISTORY_LIMIT);
  writeLocalJson(LOCAL_KEYS.history, state.history);
  renderUpgradeHistory();
}

function renderUpgradeHistory() {
  const list = document.getElementById("upgrade-history");
  const empty = document.getElementById("history-empty");
  if (!list || !empty) return;

  list.innerHTML = "";

  state.history.forEach((item) => {
    const row = document.createElement("article");
    row.className = `history-item${item.success ? " is-success" : " is-fail"}`;

    const top = document.createElement("div");
    top.className = "history-top";
    const title = document.createElement("strong");
    title.textContent = `${item.sourceName} -> ${item.targetName}`;
    const result = document.createElement("span");
    result.textContent = item.success ? "WIN" : "LOSE";
    top.append(title, result);

    const meta = document.createElement("p");
    meta.className = "history-meta";
    meta.textContent = `${new Date(item.at).toLocaleTimeString()} • ${item.chance.toFixed(1)}% • n${item.nonce}`;

    const fair = document.createElement("p");
    fair.className = "history-fair";
    fair.textContent = `hash ${shortHash(item.commitment, 8, 8)} • seed ${shortHash(item.serverSeed, 6, 6)}`;

    row.append(top, meta, fair);
    list.append(row);
  });

  hideElementById("history-empty", state.history.length > 0);
}

function tokenize(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function sortNfts(list, mode) {
  const items = [...list];
  if (mode === "value-asc") {
    items.sort((left, right) => left.value - right.value);
    return items;
  }
  if (mode === "name-asc") {
    items.sort((left, right) => String(left.name).localeCompare(String(right.name), "ru"));
    return items;
  }
  if (mode === "name-desc") {
    items.sort((left, right) => String(right.name).localeCompare(String(left.name), "ru"));
    return items;
  }
  items.sort((left, right) => right.value - left.value);
  return items;
}

function filterNfts(list, query) {
  const q = tokenize(query);
  if (!q) return list;
  return list.filter((item) => {
    const haystack = tokenize(`${item.name} ${item.tier} ${item.value}`);
    return haystack.includes(q);
  });
}

function appendInBatches(container, items, buildNode, chunkSize = RENDER_CHUNK_SIZE) {
  const safeChunk = Math.max(6, chunkSize);
  let index = 0;

  const renderChunk = () => {
    const fragment = document.createDocumentFragment();
    const max = Math.min(index + safeChunk, items.length);
    for (; index < max; index += 1) {
      const item = items[index];
      const node = buildNode(item, index);
      if (node) fragment.append(node);
    }
    container.append(fragment);

    if (index < items.length) {
      requestAnimationFrame(renderChunk);
    }
  };

  renderChunk();
}

function getFilteredTargets() {
  const filtered = filterNfts(state.data.targets, state.ui.targetSearch);
  return sortNfts(filtered, state.ui.targetSort);
}

function getFilteredOwnNfts() {
  const filtered = filterNfts(state.data.inventory, state.ui.ownSearch);
  return sortNfts(filtered, state.ui.ownSort);
}

function setupUpgradeUiControls() {
  if (state.upgradesUiBound) return;

  const targetSearch = document.getElementById("target-search");
  const targetSort = document.getElementById("target-sort");
  const ownSearch = document.getElementById("own-search");
  const ownSort = document.getElementById("own-sort");
  const historyClear = document.getElementById("history-clear-btn");
  const copyFair = document.getElementById("copy-fair-btn");
  const onboardingConnect = document.getElementById("onboarding-connect");
  const onboardingRefresh = document.getElementById("onboarding-refresh");

  if (targetSearch) {
    targetSearch.value = state.ui.targetSearch;
    targetSearch.addEventListener("input", (event) => {
      state.ui.targetSearch = event.target.value;
      recordAnalytics("filtersUsed");
      renderTargetChips();
      refreshUpgradeState();
    });
  }

  if (targetSort) {
    targetSort.value = state.ui.targetSort;
    targetSort.addEventListener("change", (event) => {
      state.ui.targetSort = event.target.value;
      renderTargetChips();
      refreshUpgradeState();
    });
  }

  if (ownSearch) {
    ownSearch.value = state.ui.ownSearch;
    ownSearch.addEventListener("input", (event) => {
      state.ui.ownSearch = event.target.value;
      recordAnalytics("filtersUsed");
      renderOwnNftCards();
      refreshUpgradeState();
    });
  }

  if (ownSort) {
    ownSort.value = state.ui.ownSort;
    ownSort.addEventListener("change", (event) => {
      state.ui.ownSort = event.target.value;
      renderOwnNftCards();
      refreshUpgradeState();
    });
  }

  if (historyClear) {
    historyClear.addEventListener("click", clearHistory);
  }

  if (copyFair) {
    copyFair.addEventListener("click", async () => {
      const copied = await copyTextToClipboard(state.fair.commitment);
      if (copied) showCopyFeedback(copyFair);
    });
  }

  if (onboardingConnect) {
    onboardingConnect.addEventListener("click", async () => {
      if (typeof state.openWalletModal === "function") {
        await state.openWalletModal();
      }
    });
  }

  if (onboardingRefresh) {
    onboardingRefresh.addEventListener("click", async () => {
      if (typeof state.refreshWalletData === "function") {
        await state.refreshWalletData();
      }
    });
  }

  state.upgradesUiBound = true;
}

function renderOnboarding() {
  const panel = document.getElementById("onboarding-panel");
  const title = document.getElementById("onboarding-title");
  const note = document.getElementById("onboarding-note");
  const connectBtn = document.getElementById("onboarding-connect");
  const refreshBtn = document.getElementById("onboarding-refresh");
  if (!panel || !title || !note || !connectBtn || !refreshBtn) return;

  let visible = false;
  let titleText = "";
  let noteText = "";
  let showConnect = false;
  let showRefresh = false;

  const connected = Boolean(state.tonAddress);

  if (!connected) {
    visible = true;
    titleText = "Старт";
    noteText = "Подключи TON Wallet, чтобы загрузить NFT и рыночные цели.";
    showConnect = true;
  } else if (state.data.profileInventory.length === 0) {
    visible = true;
    titleText = "Кошелек подключен";
    noteText = "NFT пока не найдены. Проверь кошелек и обнови загрузку.";
    showRefresh = true;
  } else if (state.data.inventory.length === 0) {
    visible = true;
    titleText = "Нужны рыночные цены";
    noteText = "NFT есть, но для них пока нет TON-оценки. Попробуй обновить позже.";
    showRefresh = true;
  } else if (state.data.targets.length === 0) {
    visible = true;
    titleText = "Нет рыночных целей";
    noteText = "Для выбранных коллекций не найдено доступных целей на рынке.";
    showRefresh = true;
  }

  panel.classList.toggle("hidden", !visible);
  title.textContent = titleText;
  note.textContent = noteText;
  connectBtn.classList.toggle("hidden", !showConnect);
  refreshBtn.classList.toggle("hidden", !showRefresh);
}

function setOrbitAngle(angle) {
  state.orbitAngle = angle;
  const orbit = document.querySelector(".chance-orbit");
  if (!orbit) return;
  orbit.style.transform = `rotate(${angle}deg)`;
}

function paintChance(value) {
  const chanceRing = document.getElementById("chance-ring");
  const chanceValue = document.getElementById("chance-value");
  if (!chanceRing || !chanceValue) return;

  const normalized = clamp(toNumber(value, 0), 0, 100);
  state.displayedChance = normalized;
  chanceRing.style.setProperty("--chance", normalized.toFixed(4));
  chanceValue.textContent = `${normalized.toFixed(1)}%`;
}

function stopChanceAnimation() {
  if (!state.chanceRafId) return;
  cancelAnimationFrame(state.chanceRafId);
  state.chanceRafId = null;
}

function animateChanceTo(targetChance, duration = 620) {
  const chanceRing = document.getElementById("chance-ring");
  const chanceValue = document.getElementById("chance-value");
  if (!chanceRing || !chanceValue) return;

  stopChanceAnimation();

  const start = clamp(toNumber(state.displayedChance, 0), 0, 100);
  const end = clamp(toNumber(targetChance, 0), 0, 100);
  const totalTime = Math.max(200, toNumber(duration, 620));

  if (Math.abs(end - start) < 0.05) {
    paintChance(end);
    return;
  }

  const startedAt = performance.now();
  const step = (now) => {
    const progress = clamp((now - startedAt) / totalTime, 0, 1);
    const eased = easeInOutCubic(progress);
    const value = start + ((end - start) * eased);
    paintChance(value);

    if (progress < 1) {
      state.chanceRafId = requestAnimationFrame(step);
      return;
    }

    state.chanceRafId = null;
    paintChance(end);
  };

  state.chanceRafId = requestAnimationFrame(step);
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
  markNetworkRequestStart();
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      markNetworkRequestEnd(false);
      return null;
    }
    const payload = await response.json();
    markNetworkRequestEnd(true);
    return payload;
  } catch {
    markNetworkRequestEnd(false);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWalletTonBalance(address) {
  const normalized = String(address || "").trim();
  if (!normalized) return null;
  const encoded = encodeURIComponent(normalized);

  const tonApiData = await fetchJsonWithTimeout(`${TONAPI_BASE}/accounts/${encoded}`);
  const tonApiBalance = tonApiData?.balance;
  if (tonApiBalance !== undefined && tonApiBalance !== null) {
    const parsed = formatTonFromNano(tonApiBalance);
    if (parsed !== null) return parsed;
  }

  const tonCenterData = await fetchJsonWithTimeout(`${TONCENTER_BASE}/getAddressInformation?address=${encoded}`);
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
  status.textContent = nft.listed ? "Маркет" : "Кошелек";

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

  const filteredTargets = getFilteredTargets();
  if (!byId(filteredTargets, state.selectedTargetId)) {
    state.selectedTargetId = filteredTargets[0]?.id ?? null;
  }

  appendInBatches(list, filteredTargets, (target) => {
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

    return chip;
  });

  if (emptyNode) {
    emptyNode.textContent = state.data.targets.length > 0
      ? "Нет результатов по фильтру."
      : "Рыночные цели не найдены.";
  }
  hideElementById("target-empty", filteredTargets.length > 0);
}

function renderOwnNftCards() {
  ensureSelectedIds();
  const list = document.getElementById("own-nft-list");
  const emptyNode = document.getElementById("own-empty");
  list.innerHTML = "";

  const filteredOwn = getFilteredOwnNfts();
  if (!byId(filteredOwn, state.selectedOwnId)) {
    state.selectedOwnId = filteredOwn[0]?.id ?? null;
  }

  appendInBatches(list, filteredOwn, (nft) => {
    const card = createOwnNftCard(nft, nft.id === state.selectedOwnId);
    card.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedOwnId = nft.id;
      renderOwnNftCards();
      refreshUpgradeState();
    });
    return card;
  });

  if (emptyNode) {
    if (state.data.profileInventory.length > 0 && state.data.inventory.length === 0) {
      emptyNode.textContent = "Нет NFT с рыночной TON-ценой.";
    } else if (state.data.inventory.length > 0 && filteredOwn.length === 0) {
      emptyNode.textContent = "Нет результатов по фильтру.";
    } else {
      emptyNode.textContent = "NFT не загружены.";
    }
  }

  hideElementById("own-empty", filteredOwn.length > 0);
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
  const note = document.getElementById("math-note");
  const button = document.getElementById("upgrade-btn");

  if (!source || !target) {
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 460);
    note.textContent = "\u0412\u044b\u0431\u0435\u0440\u0438 NFT";
    button.disabled = true;
    return;
  }

  chanceRing.classList.remove("is-empty");
  animateChanceTo(chance, state.isSpinning ? 240 : 680);
  note.textContent = `${source.name} -> ${target.name}`;
  button.disabled = state.isSpinning;
}

function spinArrowToResult(targetAngle) {
  const currentNormalized = normalizeAngle(state.orbitAngle);
  const normalizedTarget = normalizeAngle(targetAngle);
  const deltaToTarget = (normalizedTarget - currentNormalized + 360) % 360;
  const extraSpins = 6 + Math.floor(randomUnit() * 3);
  const totalDelta = (extraSpins * 360) + deltaToTarget;
  const startAngle = state.orbitAngle;
  const duration = 3300 + randomUnit() * 900;
  const startTime = performance.now();

  if (state.spinRafId) {
    cancelAnimationFrame(state.spinRafId);
    state.spinRafId = null;
  }

  return new Promise((resolve) => {
    const step = (now) => {
      const progress = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const angle = startAngle + (totalDelta * eased);
      setOrbitAngle(angle);

      if (progress < 1) {
        state.spinRafId = requestAnimationFrame(step);
        return;
      }

      state.spinRafId = null;
      const landed = normalizeAngle(startAngle + totalDelta);
      setOrbitAngle(landed);
      resolve({ landed });
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
    resultNode.textContent = "Выигрыш";
    resultNode.classList.remove("fail");
    resultNode.classList.add("success");
  } else {
    resultNode.textContent = "Проигрыш";
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
    recordAnalytics("upgradeAttempts");

    actionButton.disabled = true;
    actionButton.textContent = "Крутим...";
    result.classList.remove("success", "fail");
    result.textContent = "";

    try {
      const fairRoll = await getFairRoll(chance);
      const spinResult = await spinArrowToResult(fairRoll.targetAngle);
      applyUpgradeResult(fairRoll.success, source, target, spinResult.landed, chance, result);

      pushHistoryEntry({
        id: `h-${Date.now()}`,
        at: nowMs(),
        success: fairRoll.success,
        chance,
        landed: spinResult.landed,
        sourceName: source.name,
        targetName: target.name,
        commitment: fairRoll.commitment,
        serverSeed: fairRoll.serverSeed,
        digest: fairRoll.digest,
        nonce: fairRoll.nonce,
      });

      if (fairRoll.success) {
        recordAnalytics("upgradeWins");
      } else {
        recordAnalytics("upgradeLosses");
      }

      await rotateFairState();
    } catch (error) {
      console.error("Upgrade flow error:", error);
      result.classList.remove("success");
      result.classList.add("fail");
      result.textContent = "Ошибка апгрейда";
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

  document.getElementById("stat-nft-count").textContent = String(nftCount);
  document.getElementById("stat-upgrades").textContent = total > 0 ? String(total) : "-";
  document.getElementById("stat-winrate").textContent = winrate === null ? "-" : `${winrate.toFixed(1)}%`;
  renderAnalyticsRow();
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
  setupUpgradeUiControls();
  renderTargetChips();
  renderOwnNftCards();
  refreshUpgradeState();
  renderFairCommitment();
  renderUpgradeHistory();
  renderOnboarding();
  renderProfileGrid("my-nft-grid", "my-empty", state.data.profileInventory);
  renderProfileGrid("dropped-nft-grid", "dropped-empty", state.data.dropped);
  refreshProfileStats();
  setupProfileTabs();
}

function setAvatar(container, user) {
  if (!container) return;

  const seed = (user.first_name || user.username || "U").trim();
  const initial = seed ? seed[0].toUpperCase() : "U";
  const resetToInitial = () => {
    container.textContent = initial;
  };

  const avatarUrl = normalizeMediaUrl(firstNonEmptyString(
    user?.video_avatar_url,
    user?.videoAvatarUrl,
    user?.avatar_url,
    user?.avatarUrl,
    user?.photo_url,
    user?.photoUrl,
  ));

  if (!avatarUrl) {
    resetToInitial();
    return;
  }

  const applyImage = (url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "User avatar";
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => resetToInitial();
    container.replaceChildren(img);
  };

  if (isLikelyVideoUrl(avatarUrl)) {
    const video = document.createElement("video");
    video.src = avatarUrl;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-label", "User avatar");
    video.preload = "metadata";
    video.onerror = () => applyImage(avatarUrl);
    container.replaceChildren(video);
    return;
  }

  applyImage(avatarUrl);
}

function applyUserProfile(user) {
  const fullNameRaw = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const fullName = normalizeDisplayName(fullNameRaw) || "Гость";
  const handle = user.username ? `@${String(user.username).trim()}` : "";
  const fullId = user?.id !== undefined && user?.id !== null ? String(user.id).trim() : "";
  const compactId = shortUserId(user.id);

  const nameNode = document.getElementById("profile-name");
  const handleNode = document.getElementById("profile-handle");
  const idNode = document.getElementById("profile-id");

  nameNode.textContent = fullName;
  handleNode.textContent = handle;
  handleNode.classList.toggle("hidden", !handle);
  handleNode.dataset.copyLabel = handle;
  handleNode.dataset.copyValue = handle;
  handleNode.setAttribute("title", handle ? "\u041D\u0430\u0436\u043C\u0438, \u0447\u0442\u043E\u0431\u044B \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C username" : "");

  if (compactId) {
    idNode.textContent = `ID ${compactId}`;
    idNode.classList.remove("hidden");
    idNode.dataset.copyLabel = `ID ${compactId}`;
    idNode.dataset.copyValue = fullId || compactId;
    idNode.setAttribute("title", "\u041D\u0430\u0436\u043C\u0438, \u0447\u0442\u043E\u0431\u044B \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C ID");
  } else {
    idNode.textContent = "";
    idNode.classList.add("hidden");
    idNode.dataset.copyLabel = "";
    idNode.dataset.copyValue = "";
    idNode.setAttribute("title", "");
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

  const setBubbleState = (connected) => {
    walletBubble.classList.toggle("hidden", !connected);
    appShell.classList.toggle("has-wallet", connected);
  };

  const loadWalletBalance = async (address) => {
    const token = ++balanceRequestToken;
    walletBubbleBalance.textContent = "Загрузка...";
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
    if (token !== nftRequestToken) return null;

    if (!marketData) {
      walletShort.textContent = "Ошибка загрузки NFT";
      return null;
    }

    applyWalletMarketData(marketData);

    if (marketData.profileInventory.length === 0) {
      walletShort.textContent = "В кошельке нет NFT";
    } else if (marketData.inventory.length === 0) {
      walletShort.textContent = "NFT загружены, цены TON не найдены";
    } else {
      walletShort.textContent = `NFT: ${marketData.profileInventory.length}`;
      recordAnalytics("nftSyncSuccess");
    }

    return marketData;
  };

  const startNftPolling = (address) => {
    stopNftPolling();
    void loadWalletNfts(address);
    nftRefreshTimer = window.setInterval(() => {
      void loadWalletNfts(address);
    }, 90000);
  };

  if (!window.TON_CONNECT_UI?.TonConnectUI) {
    walletShort.textContent = "TonConnect недоступен";
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

  state.openWalletModal = async () => {
    if (!state.tonConnectUI) return;
    await state.tonConnectUI.openModal();
  };

  state.refreshWalletData = async () => {
    if (!state.tonAddress) return;
    await loadWalletNfts(state.tonAddress);
  };

  const paintConnectionState = (wallet) => {
    const address = wallet?.account?.address || state.tonConnectUI?.account?.address || "";
    const connected = Boolean(address);

    setWalletButtonText("Подключить кошелек");
    connectButton.classList.toggle("hidden", connected);
    connectButton.disabled = false;
    setBubbleState(connected);

    if (connected) {
      const isNewConnection = state.tonAddress !== address;
      state.tonAddress = address;
      if (isNewConnection) {
        recordAnalytics("walletConnects");
      }

      walletShort.textContent = "Синхронизация NFT...";
      startBalancePolling(address);
      startNftPolling(address);
    } else {
      state.tonAddress = "";
      stopBalancePolling();
      stopNftPolling();
      walletBubbleBalance.textContent = "-- TON";
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
      await state.openWalletModal();
    } catch (error) {
      console.error("TonConnect action error:", error);
      walletShort.textContent = "Не удалось подключить кошелек";
    }
  });
}

async function bootstrap() {
  loadPersistentData();
  recordAnalytics("launches");
  setNetworkStatus("idle", "Ожидание");
  monitorNetworkFreshness();
  await prepareFairState();
  setupTabs();
  setupTelegramUser();
  setupProfileCopyActions();
  setOrbitAngle(state.orbitAngle);
  paintChance(state.displayedChance);
  setupUpgradeFlow();

  renderAll();
  await loadAppData();
  renderAll();
  setNetworkStatus(state.network.online ? "ready" : "offline", state.network.online ? "Готово" : "Нет сети");
  setupTonConnect();
}

bootstrap();
