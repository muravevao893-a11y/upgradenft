const APP_VERSION = "2026-02-22-13";

const tabMeta = {
  tasks: {
    title: "Задания",
    subtitle: "Текущие активности аккаунта.",
  },
  upgrades: {
    title: "Апгрейды",
    subtitle: "Выбирай цель и запускай апгрейд.",
  },
  cases: {
    title: "Кейсы",
    subtitle: "Кейсы по текущему рангу и лимитам.",
  },
  bonuses: {
    title: "Бонусы",
    subtitle: "Активные бусты и сезонные множители.",
  },
  profile: {
    title: "Вы",
    subtitle: "Профиль",
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

const state = {
  data: {
    tasks: [],
    cases: [],
    bonuses: [],
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

function shortAddress(address) {
  if (!address || address.length < 12) return address || "-";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
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

      if (!name || !Number.isFinite(value) || value < 0) {
        return null;
      }

      return {
        id: String(item?.id ?? `${prefix}-${index + 1}`),
        name,
        tier: String(item?.tier ?? "Unknown"),
        value,
        imageUrl: String(
          item?.imageUrl
          ?? item?.image
          ?? item?.photo_url
          ?? item?.photoUrl
          ?? item?.preview
          ?? "",
        ).trim(),
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

  return {
    tasks,
    cases,
    bonuses,
    inventory: normalizeNftList(data.inventory, "inv"),
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

    title.textContent = tabMeta[nextTab].title;
    subtitle.textContent = tabMeta[nextTab].subtitle;
    subtitle.classList.toggle("hidden", nextTab === "profile");
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  const defaultTab = document.querySelector(".nav-btn.is-active")?.dataset.tab || "upgrades";
  setTab(defaultTab);
}

function createNftThumb(imageUrl) {
  const thumb = document.createElement("div");
  thumb.className = "nft-thumb";

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "NFT";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    thumb.append(img);
  }

  return thumb;
}

function createOwnNftCard(nft, isActive) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `nft-card${isActive ? " is-active" : ""}`;
  card.dataset.id = nft.id;

  const body = document.createElement("div");
  body.className = "nft-body";

  const title = document.createElement("strong");
  title.textContent = nft.name;

  const tier = document.createElement("small");
  tier.textContent = nft.tier;

  const value = document.createElement("span");
  value.textContent = formatTon(nft.value);

  body.append(title, tier, value);
  card.append(createNftThumb(nft.imageUrl), body);
  return card;
}

function createProfileNftCard(nft) {
  const card = document.createElement("article");
  card.className = "profile-nft-card";

  const body = document.createElement("div");
  body.className = "nft-body";

  const title = document.createElement("strong");
  title.textContent = nft.name;

  const tier = document.createElement("small");
  tier.textContent = nft.tier;

  const value = document.createElement("span");
  value.textContent = formatTon(nft.value);

  body.append(title, tier, value);
  card.append(createNftThumb(nft.imageUrl), body);
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

  hideElementById("target-empty", true);
}

function renderOwnNftCards() {
  ensureSelectedIds();
  const list = document.getElementById("own-nft-list");
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
    chanceRing.style.setProperty("--chance", "0");
    chanceValue.textContent = "0%";
    note.textContent = "Нужны реальные NFT и цели апгрейда.";
    button.disabled = true;
    return;
  }

  const ratio = source.value / target.value;
  chanceRing.style.setProperty("--chance", chance.toFixed(2));
  chanceValue.textContent = `${chance.toFixed(1)}%`;
  note.textContent = `${source.name} -> ${target.name}. Ratio ${ratio.toFixed(2)}x`;
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
  state.data.stats.upgradesTotal += 1;

  if (success) {
    state.data.stats.upgradesWon += 1;
    const minted = {
      ...target,
      id: `mint-${Date.now()}`,
    };
    state.data.inventory.unshift(minted);
    state.data.dropped.unshift(minted);
  }

  const zone = (chance * 3.6).toFixed(1);
  const stop = landedAngle.toFixed(1);
  if (success) {
    resultNode.textContent = `Успех. Стрелка: ${stop}°, win-зона: ${zone}°.`;
    resultNode.classList.remove("fail");
    resultNode.classList.add("success");
  } else {
    resultNode.textContent = `Неудача. Стрелка: ${stop}°, win-зона: ${zone}°.`;
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
    result.textContent = "Стрелка вращается...";

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
  const nftCount = state.data.inventory.length;
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

  hideElementById("my-empty", !(tab === "my" && state.data.inventory.length === 0));
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
  renderProfileGrid("my-nft-grid", "my-empty", state.data.inventory);
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
  const setWalletButtonText = (label) => {
    const textNode = connectButton.querySelector(".wallet-btn-text");
    if (textNode) {
      textNode.textContent = label;
      return;
    }
    connectButton.textContent = label;
  };

  if (!window.TON_CONNECT_UI?.TonConnectUI) {
    walletShort.textContent = "TonConnect UI не загружен";
    connectButton.disabled = true;
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
    return;
  }

  const paintConnectionState = (wallet) => {
    const address = wallet?.account?.address || state.tonConnectUI?.account?.address || "";
    const connected = Boolean(address);

    setWalletButtonText(connected ? "Disconnect Wallet" : "Connect Wallet");
    walletShort.textContent = connected
      ? `Подключен: ${shortAddress(address)}`
      : "Кошелек не подключен";
  };

  paintConnectionState(state.tonConnectUI.wallet);

  state.tonConnectUI.onStatusChange(
    (wallet) => paintConnectionState(wallet),
    (error) => console.error("TonConnect status error:", error),
  );

  connectButton.addEventListener("click", async () => {
    try {
      if (state.tonConnectUI.connected) {
        await state.tonConnectUI.disconnect();
      } else {
        await state.tonConnectUI.openModal();
      }
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
  setupTonConnect();

  renderAll();
  await loadAppData();
  renderAll();
}

bootstrap();

