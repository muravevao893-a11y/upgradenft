const tabMeta = {
  tasks: {
    title: "Задания",
    subtitle: "Быстрые миссии на XP, билеты и бусты к апгрейду.",
  },
  upgrades: {
    title: "Апгрейды",
    subtitle: "Выбери свой NFT, задай цель и крути апгрейд по формуле шансов.",
  },
  cases: {
    title: "Кейсы",
    subtitle: "Открывай кейсы под риск-профиль: Bronze, Silver, Black.",
  },
  bonuses: {
    title: "Бонусы",
    subtitle: "Серия входа и активность дают стабильный буст к вероятности.",
  },
  profile: {
    title: "Вы",
    subtitle: "Профиль из Telegram + TON Wallet, без отдельной регистрации.",
  },
};

const tierWeight = {
  Common: 0.92,
  Uncommon: 1,
  Rare: 1.08,
  Epic: 1.16,
  Legendary: 1.26,
};

const targetPool = [
  { id: "t1", name: "Carbon Wolf #402", tier: "Epic", value: 4.6 },
  { id: "t2", name: "Orbit Ape #911", tier: "Legendary", value: 9.4 },
  { id: "t3", name: "Drift Raven #077", tier: "Legendary", value: 16.5 },
  { id: "t4", name: "Mirror Fox #238", tier: "Epic", value: 7.1 },
];

const player = {
  upgradesTotal: 39,
  upgradesWon: 24,
  owned: [
    { id: "o1", name: "Neon Lynx #120", tier: "Rare", value: 2.8 },
    { id: "o2", name: "Ghost Rhino #056", tier: "Epic", value: 7.9 },
    { id: "o3", name: "Null Dragon #008", tier: "Legendary", value: 14.2 },
    { id: "o4", name: "Mono Shark #319", tier: "Uncommon", value: 1.6 },
    { id: "o5", name: "Static Crow #772", tier: "Rare", value: 3.2 },
    { id: "o6", name: "Metal Deer #510", tier: "Epic", value: 6.4 },
  ],
  dropped: [
    { id: "d1", name: "Pulse Tiger #201", tier: "Epic", value: 6.8 },
    { id: "d2", name: "Night Owl #403", tier: "Rare", value: 3.6 },
    { id: "d3", name: "Chrome Bull #915", tier: "Legendary", value: 12.7 },
    { id: "d4", name: "Echo Fox #039", tier: "Rare", value: 2.9 },
    { id: "d5", name: "Storm Hare #614", tier: "Epic", value: 7.2 },
    { id: "d6", name: "Iron Mantis #147", tier: "Uncommon", value: 2.2 },
  ],
};

const state = {
  selectedOwnId: player.owned[0]?.id ?? null,
  selectedTargetId: targetPool[0]?.id ?? null,
  profileTab: "my",
  tonConnectUI: null,
  orbitAngle: 0,
  isSpinning: false,
  spinRafId: null,
};

const APP_VERSION = "2026-02-22-3";

const fallbackUser = {
  id: null,
  first_name: "Гость",
  last_name: "",
  username: "guest",
  photo_url: "",
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

function setOrbitAngle(angle) {
  state.orbitAngle = angle;
  const orbit = document.querySelector(".chance-orbit");
  if (!orbit) return;
  orbit.style.transform = `rotate(${angle}deg)`;
}

function byId(list, id) {
  return list.find((item) => item.id === id) ?? null;
}

function formatTon(value) {
  return `${value.toFixed(2)} TON`;
}

function shortAddress(address) {
  if (!address || address.length < 12) return address || "-";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
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

function createOptionNode(nft, isActive) {
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

function ensureSelectedIds() {
  if (!byId(player.owned, state.selectedOwnId)) {
    state.selectedOwnId = player.owned[0]?.id ?? null;
  }

  if (!byId(targetPool, state.selectedTargetId)) {
    state.selectedTargetId = targetPool[0]?.id ?? null;
  }
}

function refreshUpgradeMath() {
  ensureSelectedIds();

  const source = byId(player.owned, state.selectedOwnId);
  const target = byId(targetPool, state.selectedTargetId);
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
    ratioOutput.textContent = "-";
    tierOutput.textContent = "-";
    sourceOutput.textContent = "Нет NFT";
    targetOutput.textContent = "Выбери цель";
    noteOutput.textContent = "У тебя закончились NFT. Получи новые в кейсах или бонусах.";
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
  noteOutput.textContent = "Чем выше стоимость цели и ее tier, тем сильнее просадка вероятности.";
  button.disabled = state.isSpinning;
}

function renderUpgradeLists() {
  ensureSelectedIds();

  const ownList = document.getElementById("own-nft-list");
  const targetList = document.getElementById("target-nft-list");
  ownList.innerHTML = "";
  targetList.innerHTML = "";

  player.owned.slice(0, 4).forEach((nft) => {
    const option = createOptionNode(nft, nft.id === state.selectedOwnId);
    option.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedOwnId = nft.id;
      renderUpgradeLists();
      refreshUpgradeMath();
    });
    ownList.append(option);
  });

  targetPool.forEach((nft) => {
    const option = createOptionNode(nft, nft.id === state.selectedTargetId);
    option.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.selectedTargetId = nft.id;
      renderUpgradeLists();
      refreshUpgradeMath();
    });
    targetList.append(option);
  });
}

function renderProfileGrid(targetElementId, list) {
  const grid = document.getElementById(targetElementId);
  grid.innerHTML = "";

  list.slice(0, 6).forEach((nft) => {
    const tile = document.createElement("article");
    tile.className = "nft-tile";
    tile.innerHTML = `
      <strong>${nft.name}</strong>
      <span>${nft.tier}</span>
      <em>${formatTon(nft.value)}</em>
    `;
    grid.append(tile);
  });
}

function refreshProfileStats() {
  const nftCount = player.owned.length;
  const winrate = player.upgradesTotal > 0
    ? (player.upgradesWon / player.upgradesTotal) * 100
    : 0;

  document.getElementById("stat-nft-count").textContent = String(nftCount);
  document.getElementById("stat-winrate").textContent = `${winrate.toFixed(1)}%`;
}

function setupProfileTabs() {
  const tabButtons = Array.from(document.querySelectorAll(".profile-tab-btn"));
  const grids = Array.from(document.querySelectorAll(".profile-nft-grid"));

  const setProfileTab = (tab) => {
    state.profileTab = tab;

    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.profileTab === tab);
    });

    grids.forEach((grid) => {
      grid.classList.toggle("is-active", grid.dataset.profileGrid === tab);
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setProfileTab(button.dataset.profileTab));
  });

  setProfileTab(state.profileTab);
}

function spinArrowToResult(chancePercent) {
  const chanceDegrees = chancePercent * 3.6;
  const targetAngle = Math.random() * 360;
  const currentNormalized = normalizeAngle(state.orbitAngle);
  const deltaToTarget = (targetAngle - currentNormalized + 360) % 360;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const totalDelta = (extraSpins * 360) + deltaToTarget;
  const startAngle = state.orbitAngle;
  const duration = 2600 + Math.random() * 600;
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
  player.owned = player.owned.filter((nft) => nft.id !== source.id);
  player.upgradesTotal += 1;

  const sectorText = `Сектор остановки: ${landedAngle.toFixed(1)}° из ${(chance * 3.6).toFixed(1)}° win-зоны.`;

  if (success) {
    player.upgradesWon += 1;

    const minted = {
      ...target,
      id: `m${Date.now()}`,
    };

    player.owned.unshift(minted);
    player.dropped.unshift(minted);
    resultNode.textContent = `Успех: ${source.name} -> ${target.name}. ${sectorText}`;
    resultNode.classList.remove("fail");
    resultNode.classList.add("success");
  } else {
    resultNode.textContent = `Неудача: ${source.name} сгорел в апгрейде. ${sectorText}`;
    resultNode.classList.remove("success");
    resultNode.classList.add("fail");
  }

  renderProfileGrid("my-nft-grid", player.owned);
  renderProfileGrid("dropped-nft-grid", player.dropped);
  refreshProfileStats();
}

function setupUpgradeFlow() {
  const actionButton = document.getElementById("upgrade-btn");
  const result = document.getElementById("upgrade-result");

  actionButton.addEventListener("click", async () => {
    if (state.isSpinning) return;

    const source = byId(player.owned, state.selectedOwnId);
    const target = byId(targetPool, state.selectedTargetId);
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
      renderUpgradeLists();
      refreshUpgradeMath();
    }
  });
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

  setAvatar(document.getElementById("nav-avatar"), user);
  setAvatar(document.getElementById("profile-avatar"), user);
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
    tg.setBackgroundColor("#0b0b0d");
    tg.setHeaderColor("#0b0b0d");

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

    connectButton.textContent = connected ? "Отключить TON Wallet" : "Connect TON Wallet";
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

function bootstrap() {
  setupTabs();
  setupTelegramUser();
  setupProfileTabs();
  setOrbitAngle(state.orbitAngle);
  setupUpgradeFlow();
  renderUpgradeLists();
  refreshUpgradeMath();
  renderProfileGrid("my-nft-grid", player.owned);
  renderProfileGrid("dropped-nft-grid", player.dropped);
  refreshProfileStats();
  setupTonConnect();
}

bootstrap();
