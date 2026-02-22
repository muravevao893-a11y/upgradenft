const APP_VERSION = "2026-02-22-5";

const tabMeta = {
  tasks: {
    title: "Задания",
    subtitle: "Текущие активности и награды по твоему профилю.",
  },
  upgrades: {
    title: "Апгрейды",
    subtitle: "Выбирай NFT и запускай апгрейд по вероятности.",
  },
  cases: {
    title: "Кейсы",
    subtitle: "Доступные кейсы по твоему уровню и лимитам.",
  },
  bonuses: {
    title: "Бонусы",
    subtitle: "Активные множители и сезонные бусты.",
  },
  profile: {
    title: "Вы",
    subtitle: "Профиль из Telegram и подключение TON Wallet.",
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

function shortAddress(address) {
  if (!address || address.length < 12) return address || "-";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function formatTon(value) {
  const number = toNumber(value, NaN);
  if (!Number.isFinite(number)) return "-";
  return `${number.toFixed(2)} TON`;
}

function byId(list, id) {
  return list.find((item) => item.id === id) ?? null;
}

function setOrbitAngle(angle) {
  state.orbitAngle = angle;
  const orbit = document.querySelector(".chance-orbit");
  if (!orbit) return;
  orbit.style.transform = `rotate(${angle}deg)`;
}

function hideElementById(id, hidden) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

function normalizeNftList(rawList, prefix) {
  return safeArray(rawList)
    .map((item, index) => {
      const value = toNumber(item?.value ?? item?.price, NaN);
      if (!Number.isFinite(value) || value < 0) return null;

      const name = String(item?.name ?? item?.title ?? "").trim();
      if (!name) return null;

      return {
        id: String(item?.id ?? `${prefix}-${index + 1}`),
        name,
        tier: String(item?.tier ?? "Unknown"),
        value,
      };
    })
    .filter(Boolean);
}

function normalizeList(rawList, prefix, shape) {
  return safeArray(rawList)
    .map((item, index) => shape(item, index, prefix))
    .filter(Boolean);
}

function normalizeServerData(rawData) {
  const data = rawData && typeof rawData === "object" ? rawData : {};

  const tasks = normalizeList(data.tasks, "task", (item, index, prefix) => {
    const title = String(item?.title ?? "").trim();
    if (!title) return null;
    return {
      id: String(item?.id ?? `${prefix}-${index + 1}`),
      title,
      reward: String(item?.reward ?? "").trim(),
      status: String(item?.status ?? "").trim(),
    };
  });

  const cases = normalizeList(data.cases, "case", (item, index, prefix) => {
    const title = String(item?.title ?? item?.name ?? "").trim();
    if (!title) return null;
    return {
      id: String(item?.id ?? `${prefix}-${index + 1}`),
      title,
      risk: String(item?.risk ?? "").trim(),
    };
  });

  const bonuses = normalizeList(data.bonuses, "bonus", (item, index, prefix) => {
    const title = String(item?.title ?? item?.name ?? "").trim();
    if (!title) return null;
    return {
      id: String(item?.id ?? `${prefix}-${index + 1}`),
      title,
      value: String(item?.value ?? "").trim(),
    };
  });

  const statsRaw = data.stats && typeof data.stats === "object" ? data.stats : {};

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
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  const defaultTab = document.querySelector(".nav-btn.is-active")?.dataset.tab || "upgrades";
  setTab(defaultTab);
}

function createNftOptionNode(nft, isActive) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `nft-option${isActive ? " is-active" : ""}`;
  button.dataset.id = nft.id;
  button.innerHTML = `
    <span class="nft-title">${nft.name}</span>
    <span class="nft-meta">
      <span>${nft.tier}</span>
      <span>${formatTon(nft.value)}</span>
    </span>
  `;
  return button;
}

function renderTasks() {
  const list = document.getElementById("tasks-list");
  const items = state.data.tasks;
  list.innerHTML = "";

  items.forEach((task) => {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <small>${task.status || "Активно"}</small>
      </div>
      <span>${task.reward || "-"}</span>
    `;
    list.append(row);
  });

  hideElementById("tasks-empty", items.length > 0);
}

function renderCases() {
  const list = document.getElementById("cases-list");
  const items = state.data.cases;
  list.innerHTML = "";

  items.forEach((caseItem) => {
    const card = document.createElement("article");
    card.className = "case-item";
    card.innerHTML = `
      <strong>${caseItem.title}</strong>
      <span>${caseItem.risk || "-"}</span>
    `;
    list.append(card);
  });

  hideElementById("cases-empty", items.length > 0);
}

function renderBonuses() {
  const list = document.getElementById("bonuses-list");
  const items = state.data.bonuses;
  list.innerHTML = "";

  items.forEach((bonus) => {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
      <strong>${bonus.title}</strong>
      <span>${bonus.value || "-"}</span>
    `;
    list.append(row);
  });

  hideElementById("bonuses-empty", items.length > 0);
}

function renderUpgradeLists() {
  ensureSelectedIds();

  const ownList = document.getElementById("own-nft-list");
  const targetList = document.getElementById("target-nft-list");
  ownList.innerHTML = "";
  targetList.innerHTML = "";

  state.data.inventory.forEach((nft) => {
    const node = createNftOptionNode(nft, nft.id === state.selectedOwnId);
    node.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedOwnId = nft.id;
      renderUpgradeLists();
      refreshUpgradeMath();
    });
    ownList.append(node);
  });

  state.data.targets.forEach((nft) => {
    const node = createNftOptionNode(nft, nft.id === state.selectedTargetId);
    node.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedTargetId = nft.id;
      renderUpgradeLists();
      refreshUpgradeMath();
    });
    targetList.append(node);
  });

  hideElementById("own-empty", state.data.inventory.length > 0);
  hideElementById("target-empty", state.data.targets.length > 0);
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

function refreshUpgradeMath() {
  ensureSelectedIds();

  const source = byId(state.data.inventory, state.selectedOwnId);
  const target = byId(state.data.targets, state.selectedTargetId);
  const chance = calculateChance(source, target);

  const chanceRing = document.getElementById("chance-ring");
  const chanceValue = document.getElementById("chance-value");
  const sourceTotal = document.getElementById("source-total");
  const targetTotal = document.getElementById("target-total");
  const ratioOutput = document.getElementById("math-ratio");
  const tierOutput = document.getElementById("math-tier");
  const sourceOutput = document.getElementById("math-source");
  const targetOutput = document.getElementById("math-target");
  const noteOutput = document.getElementById("math-note");
  const button = document.getElementById("upgrade-btn");

  if (!source || !target) {
    chanceRing.style.setProperty("--chance", "0");
    chanceValue.textContent = "0%";
    sourceTotal.textContent = "-";
    targetTotal.textContent = "-";
    sourceOutput.textContent = "-";
    targetOutput.textContent = "-";
    ratioOutput.textContent = "-";
    tierOutput.textContent = "-";
    noteOutput.textContent = "Для апгрейда нужны реальные данные NFT.";
    button.disabled = true;
    return;
  }

  const valueRatio = source.value / target.value;
  const tierPressure = ((tierWeight[target.tier] || 1) / (tierWeight[source.tier] || 1)).toFixed(2);

  chanceRing.style.setProperty("--chance", chance.toFixed(2));
  chanceValue.textContent = `${chance.toFixed(1)}%`;
  sourceTotal.textContent = formatTon(source.value);
  targetTotal.textContent = formatTon(target.value);
  sourceOutput.textContent = `${source.tier} / ${formatTon(source.value)}`;
  targetOutput.textContent = `${target.tier} / ${formatTon(target.value)}`;
  ratioOutput.textContent = `${valueRatio.toFixed(2)}x`;
  tierOutput.textContent = `${tierPressure}x`;
  noteOutput.textContent = "Чем дороже и выше tier цели, тем ниже шанс.";
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

function renderProfileGrid(targetGridId, targetEmptyId, list) {
  const grid = document.getElementById(targetGridId);
  grid.innerHTML = "";

  list.forEach((nft) => {
    const tile = document.createElement("article");
    tile.className = "nft-tile";
    tile.innerHTML = `
      <strong>${nft.name}</strong>
      <span>${nft.tier}</span>
      <em>${formatTon(nft.value)}</em>
    `;
    grid.append(tile);
  });

  hideElementById(targetEmptyId, list.length > 0);
}

function refreshProfileStats() {
  const stats = state.data.stats;
  const inventoryCount = state.data.inventory.length;
  const total = Math.max(0, stats.upgradesTotal);
  const won = Math.max(0, stats.upgradesWon);
  const winrate = total > 0 ? (won / total) * 100 : null;

  document.getElementById("profile-rank").textContent = stats.rank ?? "-";
  document.getElementById("stat-nft-count").textContent = String(inventoryCount);
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
  const tabButtons = Array.from(document.querySelectorAll(".profile-tab-btn"));
  if (!state.profileTabsBound) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => applyProfileTab(button.dataset.profileTab));
    });
    state.profileTabsBound = true;
  }

  applyProfileTab(state.profileTab);
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

function renderAll() {
  renderTasks();
  renderCases();
  renderBonuses();
  renderUpgradeLists();
  refreshUpgradeMath();
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
  img.referrerPolicy = "no-referrer";
  img.loading = "lazy";
  container.replaceChildren(img);
}

function applyUserProfile(user) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Гость";
  const handle = user.username ? `@${user.username}` : "@без_username";

  document.getElementById("profile-name").textContent = fullName;
  document.getElementById("profile-handle").textContent = handle;
  document.getElementById("profile-id").textContent = `ID: ${user.id ?? "-"}`;

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
    tg.setBackgroundColor("#0b0c0f");
    tg.setHeaderColor("#0b0c0f");
    tg.disableVerticalSwipes();

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

    connectButton.textContent = connected ? "Disconnect TON Wallet" : "Connect TON Wallet";
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
