const APP_VERSION = "2026-02-22-50";

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
  settings: {
    title: "",
    subtitle: "",
  },
  language: {
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
  first_name: "",
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

const DEFAULT_LOCALE = "ru";

const LOCALE_OPTIONS = [
  {
    code: "ru",
    short: "RU",
    flagSvg: `
      <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false">
        <rect width="24" height="16" rx="3" fill="#fff"/>
        <rect y="5.33" width="24" height="5.34" fill="#2f67d8"/>
        <rect y="10.66" width="24" height="5.34" fill="#d84444"/>
      </svg>
    `,
    tokens: ["ru", "russian", "russia", "русский", "россия"],
  },
  {
    code: "en",
    short: "EN",
    flagSvg: `
      <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false">
        <rect width="24" height="16" rx="3" fill="#1f4fa6"/>
        <path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="3"/>
        <path d="M0 0 24 16M24 0 0 16" stroke="#d73d3d" stroke-width="1.4"/>
        <path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/>
        <path d="M12 0v16M0 8h24" stroke="#d73d3d" stroke-width="2.2"/>
      </svg>
    `,
    tokens: ["en", "english", "england", "britain", "united kingdom", "английский"],
  },
  {
    code: "uk",
    short: "UK",
    flagSvg: `
      <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false">
        <rect width="24" height="8" rx="3" fill="#2f8bff"/>
        <rect y="8" width="24" height="8" fill="#ffd447"/>
      </svg>
    `,
    tokens: ["uk", "ua", "ukrainian", "ukraine", "українська", "украина"],
  },
];

const SUPPORTED_LOCALES = LOCALE_OPTIONS.map((item) => item.code);

const TRANSLATIONS = {
  ru: {
    app_title: "UPNFT Mini App",
    copy_done: "Скопировано",
    copy_hint: "Нажмите, чтобы скопировать",
    copy_username_title: "Нажми, чтобы скопировать username",
    copy_id_title: "Нажми, чтобы скопировать ID",
    network_idle: "Ожидание",
    network_syncing: "Синхронизация",
    network_ready: "Данные актуальны",
    network_stale: "Данные устарели",
    network_offline: "Нет сети",
    network_error: "Ошибка сети",
    network_restored: "Сеть восстановлена",
    network_done: "Готово",
    network_status: "Статус сети",
    analytics_launches: "Запусков",
    analytics_spins: "Круток",
    analytics_conversion: "Конверсия",
    onboarding_start_title: "Старт",
    onboarding_start_note: "Подключи TON Wallet, чтобы загрузить NFT и рыночные цели.",
    onboarding_wallet_title: "Кошелек подключен",
    onboarding_wallet_note: "NFT пока не найдены. Проверь кошелек и обнови загрузку.",
    onboarding_prices_title: "Нужны рыночные цены",
    onboarding_prices_note: "NFT есть, но для них пока нет TON-оценки. Попробуй обновить позже.",
    onboarding_targets_title: "Нет рыночных целей",
    onboarding_targets_note: "Для выбранных коллекций не найдено доступных целей на рынке.",
    onboarding_connect: "Подключить",
    onboarding_refresh: "Обновить NFT",
    fair_label: "Честный рандом",
    fair_copy: "Копировать",
    chance_probability: "Вероятность",
    note_select_nft: "Выбери NFT",
    button_upgrade_start: "Запустить апгрейд",
    button_upgrade_spin: "Крутим...",
    my_nft_title: "Мои NFT",
    history_title: "История апгрейдов",
    history_clear: "Очистить",
    history_empty: "Пока нет круток.",
    history_win: "WIN",
    history_loss: "LOSE",
    history_meta: "{time} • {chance}% • n{nonce}",
    history_fair: "hash {hash} • seed {seed}",
    tasks_empty: "Нет активных заданий.",
    cases_empty: "Нет кейсов для текущего уровня.",
    bonuses_empty: "Нет активных бонусов.",
    search_target_placeholder: "Поиск цели",
    search_own_placeholder: "Поиск NFT",
    sort_price_low: "Цена: дешевые",
    sort_price_high: "Цена: дорогие",
    sort_name_asc: "Имя: A-Z",
    sort_name_desc: "Имя: Z-A",
    target_empty_unavailable: "Рыночные цели не найдены.",
    target_empty_filter: "Нет результатов по фильтру.",
    own_empty_no_price: "Нет NFT с рыночной TON-ценой.",
    own_empty_filter: "Нет результатов по фильтру.",
    own_empty_not_loaded: "NFT не загружены.",
    nft_status_market: "Маркет",
    nft_status_wallet: "Кошелек",
    task_status_active: "Активно",
    result_win: "Выигрыш",
    result_loss: "Проигрыш",
    result_error: "Ошибка апгрейда",
    guest_name: "Гость",
    avatar_alt: "Аватар пользователя",
    profile_stat_nft: "NFT",
    profile_stat_upgrades: "Апгрейдов",
    profile_stat_winrate: "Winrate",
    profile_tab_my: "Мои NFT",
    profile_tab_dropped: "Выбитые NFT",
    profile_my_empty: "NFT пока нет.",
    profile_dropped_empty: "Выбитых NFT пока нет.",
    wallet_connect: "Подключить кошелек",
    wallet_not_connected: "Кошелек не подключен",
    wallet_balance_loading: "Загрузка...",
    wallet_syncing_nft: "Синхронизация NFT...",
    wallet_nft_load_error: "Ошибка загрузки NFT",
    wallet_no_nft: "В кошельке нет NFT",
    wallet_no_prices: "NFT загружены, цены TON не найдены",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect недоступен",
    wallet_tonconnect_init_error: "Ошибка инициализации TON Connect",
    wallet_connect_failed: "Не удалось подключить кошелек",
    nav_label: "Навигация",
    nav_tasks: "Задания",
    nav_upgrades: "Апгрейды",
    nav_cases: "Кейсы",
    nav_bonuses: "Бонусы",
    nav_profile: "Вы",
    locale_title: "Язык",
    locale_search_placeholder: "Поиск языка или страны",
    locale_select_aria: "Выбрать язык",
    locale_empty: "Ничего не найдено",
    locale_open_aria: "Открыть страницу языка ({language})",
    language_page_title: "Язык",
    language_page_back_aria: "Назад в профиль",
    settings_open_aria: "Открыть настройки",
    settings_page_title: "Настройки",
    settings_back_aria: "Назад в профиль",
    settings_language_title: "Язык",
    settings_language_value: "Выбрать язык интерфейса",
    settings_language_aria: "Открыть языковые настройки",
    lang_ru_name: "Русский",
    lang_ru_country: "Россия",
    lang_en_name: "English",
    lang_en_country: "United Kingdom",
    lang_uk_name: "Українська",
    lang_uk_country: "Україна",
  },
  en: {
    app_title: "UPNFT Mini App",
    copy_done: "Copied",
    copy_hint: "Tap to copy",
    copy_username_title: "Tap to copy username",
    copy_id_title: "Tap to copy ID",
    network_idle: "Idle",
    network_syncing: "Syncing",
    network_ready: "Data is up to date",
    network_stale: "Data is stale",
    network_offline: "Offline",
    network_error: "Network error",
    network_restored: "Network restored",
    network_done: "Ready",
    network_status: "Network status",
    analytics_launches: "Launches",
    analytics_spins: "Spins",
    analytics_conversion: "Conversion",
    onboarding_start_title: "Start",
    onboarding_start_note: "Connect TON Wallet to load NFT and market targets.",
    onboarding_wallet_title: "Wallet connected",
    onboarding_wallet_note: "No NFT found yet. Check your wallet and refresh.",
    onboarding_prices_title: "Market prices required",
    onboarding_prices_note: "NFT loaded, but TON market prices are not available yet. Try again later.",
    onboarding_targets_title: "No market targets",
    onboarding_targets_note: "No available targets were found for selected collections.",
    onboarding_connect: "Connect",
    onboarding_refresh: "Refresh NFT",
    fair_label: "Provably fair",
    fair_copy: "Copy",
    chance_probability: "Probability",
    note_select_nft: "Choose NFT",
    button_upgrade_start: "Start upgrade",
    button_upgrade_spin: "Spinning...",
    my_nft_title: "My NFT",
    history_title: "Upgrade history",
    history_clear: "Clear",
    history_empty: "No spins yet.",
    history_win: "WIN",
    history_loss: "LOSE",
    history_meta: "{time} • {chance}% • n{nonce}",
    history_fair: "hash {hash} • seed {seed}",
    tasks_empty: "No active tasks.",
    cases_empty: "No cases available for your current level.",
    bonuses_empty: "No active bonuses.",
    search_target_placeholder: "Search target",
    search_own_placeholder: "Search NFT",
    sort_price_low: "Price: low first",
    sort_price_high: "Price: high first",
    sort_name_asc: "Name: A-Z",
    sort_name_desc: "Name: Z-A",
    target_empty_unavailable: "No market targets found.",
    target_empty_filter: "No results for current filter.",
    own_empty_no_price: "No NFT with TON market price.",
    own_empty_filter: "No results for current filter.",
    own_empty_not_loaded: "NFT not loaded.",
    nft_status_market: "Market",
    nft_status_wallet: "Wallet",
    task_status_active: "Active",
    result_win: "Win",
    result_loss: "Lose",
    result_error: "Upgrade error",
    guest_name: "Guest",
    avatar_alt: "User avatar",
    profile_stat_nft: "NFT",
    profile_stat_upgrades: "Upgrades",
    profile_stat_winrate: "Winrate",
    profile_tab_my: "My NFT",
    profile_tab_dropped: "Dropped NFT",
    profile_my_empty: "No NFT yet.",
    profile_dropped_empty: "No dropped NFT yet.",
    wallet_connect: "Connect wallet",
    wallet_not_connected: "Wallet not connected",
    wallet_balance_loading: "Loading...",
    wallet_syncing_nft: "Syncing NFT...",
    wallet_nft_load_error: "NFT loading error",
    wallet_no_nft: "No NFT in wallet",
    wallet_no_prices: "NFT loaded, TON prices not found",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect is unavailable",
    wallet_tonconnect_init_error: "TON Connect init error",
    wallet_connect_failed: "Wallet connection failed",
    nav_label: "Navigation",
    nav_tasks: "Tasks",
    nav_upgrades: "Upgrades",
    nav_cases: "Cases",
    nav_bonuses: "Bonuses",
    nav_profile: "You",
    locale_title: "Language",
    locale_search_placeholder: "Search language or country",
    locale_select_aria: "Select language",
    locale_empty: "Nothing found",
    locale_open_aria: "Open language page ({language})",
    language_page_title: "Language",
    language_page_back_aria: "Back to profile",
    settings_open_aria: "Open settings",
    settings_page_title: "Settings",
    settings_back_aria: "Back to profile",
    settings_language_title: "Language",
    settings_language_value: "Choose app language",
    settings_language_aria: "Open language settings",
    lang_ru_name: "Russian",
    lang_ru_country: "Russia",
    lang_en_name: "English",
    lang_en_country: "United Kingdom",
    lang_uk_name: "Ukrainian",
    lang_uk_country: "Ukraine",
  },
  uk: {
    app_title: "UPNFT Mini App",
    copy_done: "Скопійовано",
    copy_hint: "Натисни, щоб скопіювати",
    copy_username_title: "Натисни, щоб скопіювати username",
    copy_id_title: "Натисни, щоб скопіювати ID",
    network_idle: "Очікування",
    network_syncing: "Синхронізація",
    network_ready: "Дані актуальні",
    network_stale: "Дані застаріли",
    network_offline: "Немає мережі",
    network_error: "Помилка мережі",
    network_restored: "Мережу відновлено",
    network_done: "Готово",
    network_status: "Статус мережі",
    analytics_launches: "Запусків",
    analytics_spins: "Прокруток",
    analytics_conversion: "Конверсія",
    onboarding_start_title: "Старт",
    onboarding_start_note: "Підключи TON Wallet, щоб завантажити NFT і ринкові цілі.",
    onboarding_wallet_title: "Гаманець підключено",
    onboarding_wallet_note: "NFT поки не знайдено. Перевір гаманець і онови.",
    onboarding_prices_title: "Потрібні ринкові ціни",
    onboarding_prices_note: "NFT є, але для них поки немає TON-оцінки. Спробуй пізніше.",
    onboarding_targets_title: "Немає ринкових цілей",
    onboarding_targets_note: "Для вибраних колекцій не знайдено доступних цілей.",
    onboarding_connect: "Підключити",
    onboarding_refresh: "Оновити NFT",
    fair_label: "Чесний рандом",
    fair_copy: "Копіювати",
    chance_probability: "Ймовірність",
    note_select_nft: "Обери NFT",
    button_upgrade_start: "Запустити апгрейд",
    button_upgrade_spin: "Крутимо...",
    my_nft_title: "Мої NFT",
    history_title: "Історія апгрейдів",
    history_clear: "Очистити",
    history_empty: "Поки немає прокруток.",
    history_win: "WIN",
    history_loss: "LOSE",
    history_meta: "{time} • {chance}% • n{nonce}",
    history_fair: "hash {hash} • seed {seed}",
    tasks_empty: "Немає активних завдань.",
    cases_empty: "Немає кейсів для поточного рівня.",
    bonuses_empty: "Немає активних бонусів.",
    search_target_placeholder: "Пошук цілі",
    search_own_placeholder: "Пошук NFT",
    sort_price_low: "Ціна: дешевші",
    sort_price_high: "Ціна: дорожчі",
    sort_name_asc: "Ім'я: A-Z",
    sort_name_desc: "Ім'я: Z-A",
    target_empty_unavailable: "Ринкові цілі не знайдено.",
    target_empty_filter: "Немає результатів за фільтром.",
    own_empty_no_price: "Немає NFT з ринковою TON-ціною.",
    own_empty_filter: "Немає результатів за фільтром.",
    own_empty_not_loaded: "NFT не завантажені.",
    nft_status_market: "Маркет",
    nft_status_wallet: "Гаманець",
    task_status_active: "Активно",
    result_win: "Виграш",
    result_loss: "Програш",
    result_error: "Помилка апгрейда",
    guest_name: "Гість",
    avatar_alt: "Аватар користувача",
    profile_stat_nft: "NFT",
    profile_stat_upgrades: "Апгрейдів",
    profile_stat_winrate: "Winrate",
    profile_tab_my: "Мої NFT",
    profile_tab_dropped: "Вибиті NFT",
    profile_my_empty: "NFT поки немає.",
    profile_dropped_empty: "Вибитих NFT поки немає.",
    wallet_connect: "Підключити гаманець",
    wallet_not_connected: "Гаманець не підключено",
    wallet_balance_loading: "Завантаження...",
    wallet_syncing_nft: "Синхронізація NFT...",
    wallet_nft_load_error: "Помилка завантаження NFT",
    wallet_no_nft: "У гаманці немає NFT",
    wallet_no_prices: "NFT завантажені, ціни TON не знайдено",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect недоступний",
    wallet_tonconnect_init_error: "Помилка ініціалізації TON Connect",
    wallet_connect_failed: "Не вдалося підключити гаманець",
    nav_label: "Навігація",
    nav_tasks: "Завдання",
    nav_upgrades: "Апгрейди",
    nav_cases: "Кейси",
    nav_bonuses: "Бонуси",
    nav_profile: "Ви",
    locale_title: "Мова",
    locale_search_placeholder: "Пошук мови або країни",
    locale_select_aria: "Обрати мову",
    locale_empty: "Нічого не знайдено",
    locale_open_aria: "Відкрити сторінку мови ({language})",
    language_page_title: "Мова",
    language_page_back_aria: "Назад у профіль",
    settings_open_aria: "Відкрити налаштування",
    settings_page_title: "Налаштування",
    settings_back_aria: "Назад у профіль",
    settings_language_title: "Мова",
    settings_language_value: "Обрати мову інтерфейсу",
    settings_language_aria: "Відкрити мовні налаштування",
    lang_ru_name: "Російська",
    lang_ru_country: "Росія",
    lang_en_name: "Англійська",
    lang_en_country: "United Kingdom",
    lang_uk_name: "Українська",
    lang_uk_country: "Україна",
  },
};

const LOCAL_KEYS = {
  history: "upnft_history_v2",
  analytics: "upnft_analytics_v2",
  fair: "upnft_fair_v2",
  locale: "upnft_locale_v1",
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
  localeBound: false,
  settingsBound: false,
  upgradesUiBound: false,
  activeTab: "upgrades",
  setTab: null,
  tonConnectUI: null,
  tonAddress: "",
  refreshWalletData: null,
  openWalletModal: null,
  refreshWalletLocale: null,
  orbitAngle: 0,
  isSpinning: false,
  spinRafId: null,
  chanceRafId: null,
  displayedChance: 0,
  upgradeOutcome: null,
  locale: DEFAULT_LOCALE,
  localeSearch: "",
  languageReturnTab: "settings",
  device: "mobile",
  deviceWatchBound: false,
  currentUser: { ...fallbackUser },
  telegramLanguage: "",
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
    detailKey: "",
    pending: 0,
    lastSuccessAt: 0,
  },
  walletUi: {
    shortKey: "wallet_not_connected",
    shortParams: {},
    buttonKey: "wallet_connect",
    balanceLoading: false,
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

function formatI18n(template, params = {}) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (_, key) => {
    if (params[key] === undefined || params[key] === null) return "";
    return String(params[key]);
  });
}

function normalizeLocaleCode(input) {
  const raw = String(input ?? "").trim().toLowerCase().replace(/_/g, "-");
  if (!raw) return DEFAULT_LOCALE;
  const primary = raw.split("-")[0];
  if (primary === "ua") return "uk";
  if (SUPPORTED_LOCALES.includes(primary)) return primary;
  return DEFAULT_LOCALE;
}

function getIntlLocale() {
  if (state.locale === "uk") return "uk-UA";
  if (state.locale === "en") return "en-GB";
  return "ru-RU";
}

function t(key, params) {
  const localePack = TRANSLATIONS[state.locale] || TRANSLATIONS[DEFAULT_LOCALE];
  const fallbackPack = TRANSLATIONS[DEFAULT_LOCALE];
  const value = localePack?.[key] ?? fallbackPack?.[key] ?? key;
  return formatI18n(value, params);
}

function detectDeviceProfile() {
  const tgPlatform = String(window.Telegram?.WebApp?.platform || "").toLowerCase();
  const desktopPlatforms = new Set(["tdesktop", "macos", "web", "weba", "webk", "webz"]);
  const mobilePlatforms = new Set(["android", "ios"]);
  const width = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0);

  if (desktopPlatforms.has(tgPlatform)) return "desktop";
  if (mobilePlatforms.has(tgPlatform)) return "mobile";

  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches === true;
  const touchPoints = toNumber(navigator.maxTouchPoints, 0);

  if (width >= 920 && !coarsePointer && touchPoints < 2) return "desktop";
  return "mobile";
}

function applyDeviceProfile(mode) {
  const normalized = mode === "desktop" ? "desktop" : "mobile";
  state.device = normalized;

  const shell = document.getElementById("app-shell");
  if (!shell) return;
  shell.dataset.device = normalized;
  document.body.dataset.device = normalized;
}

function refreshDeviceProfile() {
  applyDeviceProfile(detectDeviceProfile());
}

function setupDeviceProfileWatcher() {
  refreshDeviceProfile();
  if (state.deviceWatchBound) return;

  let timer = null;
  const onResize = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const prev = state.device;
      refreshDeviceProfile();
      if (prev !== state.device) {
        renderAll();
      }
    }, 120);
  };

  window.addEventListener("resize", onResize, { passive: true });

  const tg = window.Telegram?.WebApp;
  if (tg && typeof tg.onEvent === "function") {
    tg.onEvent("viewportChanged", onResize);
  }

  state.deviceWatchBound = true;
}

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

  node.textContent = t("copy_done");
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
    node.setAttribute("aria-label", t("copy_hint"));

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

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.textContent = value;
}

function setPlaceholder(selector, value) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.setAttribute("placeholder", value);
}

function getLocaleOption(code) {
  const normalized = normalizeLocaleCode(code);
  return LOCALE_OPTIONS.find((item) => item.code === normalized) ?? LOCALE_OPTIONS[0];
}

function getLocaleDisplayName(code) {
  const option = getLocaleOption(code);
  const key = `lang_${option.code}_name`;
  const translated = t(key);
  return translated === key ? option.short : translated;
}

function getLocaleCountryName(code) {
  const option = getLocaleOption(code);
  const key = `lang_${option.code}_country`;
  const translated = t(key);
  return translated === key ? option.code.toUpperCase() : translated;
}

function detectPreferredLocale() {
  try {
    const saved = localStorage.getItem(LOCAL_KEYS.locale);
    if (saved) return normalizeLocaleCode(saved);
  } catch {
    // Ignore storage errors.
  }

  const tgLang = state.telegramLanguage || window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tgLang) return normalizeLocaleCode(tgLang);

  return normalizeLocaleCode(navigator.language || DEFAULT_LOCALE);
}

function renderLanguageShortcut() {
  const trigger = document.getElementById("open-language-from-settings");
  const label = document.getElementById("settings-language-title");
  const value = document.getElementById("settings-language-value");
  if (!trigger || !label || !value) return;

  const current = getLocaleOption(state.locale);
  const currentName = getLocaleDisplayName(current.code);

  label.textContent = t("settings_language_title");
  value.textContent = currentName;
  trigger.setAttribute("aria-label", t("locale_open_aria", { language: currentName }));
}

function renderSettingsPage() {
  const pageTitle = document.getElementById("settings-page-title");
  const openSettingsButton = document.getElementById("open-settings-btn");
  const backButton = document.getElementById("settings-back-btn");
  const openLanguageButton = document.getElementById("open-language-from-settings");

  if (pageTitle) pageTitle.textContent = t("settings_page_title");
  if (openSettingsButton) openSettingsButton.setAttribute("aria-label", t("settings_open_aria"));
  if (backButton) backButton.setAttribute("aria-label", t("settings_back_aria"));
  if (openLanguageButton) openLanguageButton.setAttribute("aria-label", t("settings_language_aria"));

  renderLanguageShortcut();
}

function renderLanguagePage() {
  const title = document.getElementById("language-page-title");
  const backButton = document.getElementById("language-back-btn");
  const search = document.getElementById("language-page-search");
  const list = document.getElementById("language-page-list");
  const empty = document.getElementById("language-page-empty");
  if (!title || !backButton || !search || !list || !empty) return;

  title.textContent = t("language_page_title");
  backButton.setAttribute("aria-label", t("language_page_back_aria"));
  search.setAttribute("placeholder", t("locale_search_placeholder"));
  list.setAttribute("aria-label", t("language_page_title"));
  empty.textContent = t("locale_empty");

  const query = tokenize(state.localeSearch);
  const filtered = LOCALE_OPTIONS.filter((item) => {
    if (!query) return true;
    const name = tokenize(getLocaleDisplayName(item.code));
    const country = tokenize(getLocaleCountryName(item.code));
    const tokens = tokenize(item.tokens.join(" "));
    return name.includes(query)
      || country.includes(query)
      || tokens.includes(query)
      || item.short.toLowerCase().includes(query);
  });

  list.innerHTML = "";
  empty.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach((item) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = `locale-option${item.code === state.locale ? " is-active" : ""}`;
    option.dataset.locale = item.code;

    const flag = document.createElement("span");
    flag.className = "locale-option-flag";
    if (item.flagSvg) {
      flag.innerHTML = item.flagSvg;
    } else {
      flag.textContent = item.short;
    }

    const textWrap = document.createElement("span");
    textWrap.className = "locale-option-text";
    const name = document.createElement("strong");
    name.textContent = getLocaleDisplayName(item.code);
    const country = document.createElement("small");
    country.textContent = getLocaleCountryName(item.code);
    textWrap.append(name, country);

    const code = document.createElement("span");
    code.className = "locale-option-code";
    code.textContent = item.short;

    option.append(flag, textWrap, code);
    option.addEventListener("click", () => {
      setLocale(item.code);
      if (typeof state.setTab === "function") {
        state.setTab(state.languageReturnTab || "settings");
      }
    });
    list.append(option);
  });
}

function setupLanguagePage() {
  if (state.localeBound) return;
  const backButton = document.getElementById("language-back-btn");
  const search = document.getElementById("language-page-search");
  if (!backButton || !search) return;

  backButton.addEventListener("click", () => {
    if (typeof state.setTab === "function") {
      state.setTab(state.languageReturnTab || "settings");
    }
  });

  search.addEventListener("input", (event) => {
    state.localeSearch = event.target.value || "";
    renderLanguagePage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (state.activeTab !== "language") return;
    if (typeof state.setTab === "function") {
      state.setTab(state.languageReturnTab || "settings");
    }
  });

  state.localeBound = true;
}

function setupSettingsPage() {
  if (state.settingsBound) return;

  const openSettingsButton = document.getElementById("open-settings-btn");
  const backButton = document.getElementById("settings-back-btn");
  const openLanguageButton = document.getElementById("open-language-from-settings");
  const languageSearch = document.getElementById("language-page-search");

  if (!openSettingsButton || !backButton || !openLanguageButton) return;

  openSettingsButton.addEventListener("click", () => {
    if (typeof state.setTab === "function") state.setTab("settings");
  });

  backButton.addEventListener("click", () => {
    if (typeof state.setTab === "function") state.setTab("profile");
  });

  openLanguageButton.addEventListener("click", () => {
    state.languageReturnTab = "settings";
    state.localeSearch = "";
    if (languageSearch) languageSearch.value = "";
    renderLanguagePage();
    if (typeof state.setTab === "function") state.setTab("language");
  });

  state.settingsBound = true;
}

function applyStaticLocalization() {
  document.documentElement.lang = state.locale;
  document.title = t("app_title");

  setText("#tasks-empty", t("tasks_empty"));
  setText("#cases-empty", t("cases_empty"));
  setText("#bonuses-empty", t("bonuses_empty"));
  setText("#target-empty", t("target_empty_unavailable"));
  setText("#own-empty", t("own_empty_not_loaded"));
  setText("#history-empty", t("history_empty"));
  setText(".fair-label", t("fair_label"));
  setText("#copy-fair-btn", t("fair_copy"));
  setText("#chance-ring .chance-core small", t("chance_probability"));
  setText("#math-note", t("note_select_nft"));
  setText(".upgrade-screen .block-title", t("my_nft_title"));
  setText(".history-head h3", t("history_title"));
  setText("#history-clear-btn", t("history_clear"));
  setText("#upgrade-btn", state.isSpinning ? t("button_upgrade_spin") : t("button_upgrade_start"));
  setText("#onboarding-connect", t("onboarding_connect"));
  setText("#onboarding-refresh", t("onboarding_refresh"));

  const fairCopyBtn = document.getElementById("copy-fair-btn");
  if (fairCopyBtn) {
    fairCopyBtn.dataset.copyLabel = t("fair_copy");
  }

  setPlaceholder("#target-search", t("search_target_placeholder"));
  setPlaceholder("#own-search", t("search_own_placeholder"));
  setText("#target-sort option[value='value-asc']", t("sort_price_low"));
  setText("#target-sort option[value='value-desc']", t("sort_price_high"));
  setText("#target-sort option[value='name-asc']", t("sort_name_asc"));
  setText("#target-sort option[value='name-desc']", t("sort_name_desc"));
  setText("#own-sort option[value='value-asc']", t("sort_price_low"));
  setText("#own-sort option[value='value-desc']", t("sort_price_high"));
  setText("#own-sort option[value='name-asc']", t("sort_name_asc"));
  setText("#own-sort option[value='name-desc']", t("sort_name_desc"));

  setText(".stat-row div:nth-child(1) span", t("profile_stat_nft"));
  setText(".stat-row div:nth-child(2) span", t("profile_stat_upgrades"));
  setText(".stat-row div:nth-child(3) span", t("profile_stat_winrate"));
  setText(".wallet-btn-text", t("wallet_connect"));
  if (!state.tonAddress) {
    setText("#wallet-short", t("wallet_not_connected"));
  }
  setText(".profile-tab-btn[data-profile-tab='my']", t("profile_tab_my"));
  setText(".profile-tab-btn[data-profile-tab='dropped']", t("profile_tab_dropped"));
  setText("#my-empty", t("profile_my_empty"));
  setText("#dropped-empty", t("profile_dropped_empty"));

  const nav = document.querySelector(".bottom-nav");
  if (nav) nav.setAttribute("aria-label", t("nav_label"));
  setText(".nav-btn[data-tab='tasks'] > span:last-child", t("nav_tasks"));
  setText(".nav-btn[data-tab='upgrades'] > span:last-child", t("nav_upgrades"));
  setText(".nav-btn[data-tab='cases'] > span:last-child", t("nav_cases"));
  setText(".nav-btn[data-tab='bonuses'] > span:last-child", t("nav_bonuses"));
  setText(".nav-btn[data-tab='profile'] > span:last-child", t("nav_profile"));

  const navTasks = document.querySelector(".nav-btn[data-tab='tasks']");
  const navUpgrades = document.querySelector(".nav-btn[data-tab='upgrades']");
  const navCases = document.querySelector(".nav-btn[data-tab='cases']");
  const navBonuses = document.querySelector(".nav-btn[data-tab='bonuses']");
  const navProfile = document.querySelector(".nav-btn[data-tab='profile']");
  if (navTasks) navTasks.setAttribute("aria-label", t("nav_tasks"));
  if (navUpgrades) navUpgrades.setAttribute("aria-label", t("nav_upgrades"));
  if (navCases) navCases.setAttribute("aria-label", t("nav_cases"));
  if (navBonuses) navBonuses.setAttribute("aria-label", t("nav_bonuses"));
  if (navProfile) navProfile.setAttribute("aria-label", t("nav_profile"));

  const handleNode = document.getElementById("profile-handle");
  const idNode = document.getElementById("profile-id");
  if (handleNode) handleNode.setAttribute("aria-label", t("copy_hint"));
  if (idNode) idNode.setAttribute("aria-label", t("copy_hint"));

  const languageSearch = document.getElementById("language-page-search");
  const languageList = document.getElementById("language-page-list");
  const languageBack = document.getElementById("language-back-btn");
  if (languageSearch) languageSearch.setAttribute("placeholder", t("locale_search_placeholder"));
  if (languageList) languageList.setAttribute("aria-label", t("language_page_title"));
  if (languageBack) languageBack.setAttribute("aria-label", t("language_page_back_aria"));

  setText("#settings-page-title", t("settings_page_title"));
  setText("#settings-language-title", t("settings_language_title"));
}

function setLocale(nextLocale, options = {}) {
  const { persist = true, rerender = true } = options;
  const normalized = normalizeLocaleCode(nextLocale);
  state.locale = normalized;

  if (persist) {
    try {
      localStorage.setItem(LOCAL_KEYS.locale, normalized);
    } catch {
      // Ignore storage errors.
    }
  }

  applyStaticLocalization();
  renderSettingsPage();
  renderLanguagePage();
  updateNetworkPill();

  if (typeof state.refreshWalletLocale === "function") {
    state.refreshWalletLocale();
  }

  if (state.currentUser) {
    applyUserProfile(state.currentUser);
  }

  if (rerender) {
    renderAll();
  }
}

function setupLocalization() {
  const locale = detectPreferredLocale();
  setLocale(locale, { persist: false, rerender: false });
  setupSettingsPage();
  setupLanguagePage();
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

  const { status, detailKey } = state.network;
  const fallbackMap = {
    idle: "network_idle",
    syncing: "network_syncing",
    ready: "network_ready",
    stale: "network_stale",
    offline: "network_offline",
    error: "network_error",
  };
  const labelKey = detailKey || fallbackMap[status] || "network_status";
  const label = t(labelKey);

  pill.className = `network-pill${status ? ` is-${status}` : ""}`;
  text.textContent = label;
  pill.classList.remove("hidden");
}

function setNetworkStatus(status, detailKey = "") {
  state.network.status = status;
  state.network.detailKey = detailKey;
  if (status === "ready") {
    state.network.lastSuccessAt = nowMs();
  }
  updateNetworkPill();
}

function markNetworkRequestStart() {
  state.network.pending += 1;
  if (state.network.online) {
    setNetworkStatus("syncing");
  } else {
    setNetworkStatus("offline");
  }
}

function markNetworkRequestEnd(ok) {
  state.network.pending = Math.max(0, state.network.pending - 1);
  if (state.network.pending > 0) return;

  if (!state.network.online) {
    setNetworkStatus("offline");
    return;
  }

  if (ok) {
    setNetworkStatus("ready");
    return;
  }

  setNetworkStatus("error");
}

function monitorNetworkFreshness() {
  window.addEventListener("online", () => {
    state.network.online = true;
    setNetworkStatus("ready", "network_restored");
  });
  window.addEventListener("offline", () => {
    state.network.online = false;
    setNetworkStatus("offline");
  });

  window.setInterval(() => {
    if (!state.network.lastSuccessAt || state.network.pending > 0 || !state.network.online) return;
    if (nowMs() - state.network.lastSuccessAt > STALE_MS) {
      setNetworkStatus("stale");
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
    { label: t("analytics_launches"), value: String(state.analytics.launches) },
    { label: t("analytics_spins"), value: String(attempts) },
    { label: t("analytics_conversion"), value: conversion },
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
  try {
    localStorage.removeItem("upnft_history_v1");
    localStorage.removeItem("upnft_analytics_v1");
    localStorage.removeItem("upnft_fair_v1");
  } catch {
    // Ignore storage errors.
  }

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
    result.textContent = item.success ? t("history_win") : t("history_loss");
    top.append(title, result);

    const meta = document.createElement("p");
    meta.className = "history-meta";
    meta.textContent = t("history_meta", {
      time: new Date(item.at).toLocaleTimeString(getIntlLocale()),
      chance: item.chance.toFixed(1),
      nonce: item.nonce,
    });

    const fair = document.createElement("p");
    fair.className = "history-fair";
    fair.textContent = t("history_fair", {
      hash: shortHash(item.commitment, 8, 8),
      seed: shortHash(item.serverSeed, 6, 6),
    });

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
    items.sort((left, right) => String(left.name).localeCompare(String(right.name), getIntlLocale()));
    return items;
  }
  if (mode === "name-desc") {
    items.sort((left, right) => String(right.name).localeCompare(String(left.name), getIntlLocale()));
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
    titleText = t("onboarding_start_title");
    noteText = t("onboarding_start_note");
    showConnect = true;
  } else if (state.data.profileInventory.length === 0) {
    visible = true;
    titleText = t("onboarding_wallet_title");
    noteText = t("onboarding_wallet_note");
    showRefresh = true;
  } else if (state.data.inventory.length === 0) {
    visible = true;
    titleText = t("onboarding_prices_title");
    noteText = t("onboarding_prices_note");
    showRefresh = true;
  } else if (state.data.targets.length === 0) {
    visible = true;
    titleText = t("onboarding_targets_title");
    noteText = t("onboarding_targets_note");
    showRefresh = true;
  }

  panel.classList.toggle("hidden", !visible);
  title.textContent = titleText;
  note.textContent = noteText;
  connectBtn.textContent = t("onboarding_connect");
  refreshBtn.textContent = t("onboarding_refresh");
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

async function fetchAccountNftItemsPage(owner, indirectOwnership) {
  const encodedOwner = encodeURIComponent(owner);
  const collected = [];
  let offset = 0;
  let hadResponse = false;
  const indirectParam = typeof indirectOwnership === "boolean" ? `&indirect_ownership=${indirectOwnership}` : "";

  for (let page = 0; page < NFT_MAX_PAGES; page += 1) {
    const url = `${TONAPI_BASE}/accounts/${encodedOwner}/nfts?limit=${NFT_PAGE_LIMIT}&offset=${offset}${indirectParam}`;
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

async function fetchAccountNftItems(address) {
  const owner = String(address || "").trim();
  if (!owner) return [];

  const ownDirect = await fetchAccountNftItemsPage(owner, false);
  if (ownDirect === null) return null;
  if (ownDirect.length > 0) return ownDirect;

  const ownIndirect = await fetchAccountNftItemsPage(owner, true);
  if (ownIndirect === null) return ownDirect;
  if (ownIndirect.length > 0) return ownIndirect;

  const ownDefault = await fetchAccountNftItemsPage(owner, null);
  if (ownDefault === null) return ownDirect;
  return ownDefault.length > 0 ? ownDefault : ownDirect;
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
  const bottomNav = document.querySelector(".bottom-nav");
  const appShell = document.getElementById("app-shell");
  const navTabs = new Set(buttons.map((button) => String(button.dataset.tab || "").trim()).filter(Boolean));

  const setTab = (nextTab) => {
    const fallbackTab = "upgrades";
    const targetTab = sections.some((section) => section.dataset.tabSection === nextTab) ? nextTab : fallbackTab;
    const isMainTab = navTabs.has(targetTab);
    state.activeTab = targetTab;

    buttons.forEach((button) => {
      const isActive = isMainTab && button.dataset.tab === targetTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    sections.forEach((section) => {
      section.classList.toggle("is-active", section.dataset.tabSection === targetTab);
    });

    const meta = tabMeta[targetTab] || tabMeta[fallbackTab];
    const subtitleText = meta.subtitle || "";
    title.textContent = meta.title || "";
    subtitle.textContent = subtitleText;
    subtitle.classList.toggle("hidden", targetTab === "profile" || targetTab === "language" || !subtitleText);

    if (bottomNav) bottomNav.classList.toggle("is-hidden", !isMainTab);
    if (appShell) appShell.classList.toggle("is-internal-screen", !isMainTab);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  state.setTab = setTab;
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
  status.textContent = nft.listed ? t("nft_status_market") : t("nft_status_wallet");

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
    status.textContent = task.status || t("task_status_active");
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
      ? t("target_empty_filter")
      : t("target_empty_unavailable");
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
      emptyNode.textContent = t("own_empty_no_price");
    } else if (state.data.inventory.length > 0 && filteredOwn.length === 0) {
      emptyNode.textContent = t("own_empty_filter");
    } else {
      emptyNode.textContent = t("own_empty_not_loaded");
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

function applyChanceOutcomeVisual() {
  const chanceRing = document.getElementById("chance-ring");
  if (!chanceRing) return;
  chanceRing.classList.toggle("is-win", state.upgradeOutcome === "win");
  chanceRing.classList.toggle("is-lose", state.upgradeOutcome === "lose");
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
    note.textContent = t("note_select_nft");
    button.disabled = true;
    applyChanceOutcomeVisual();
    return;
  }

  chanceRing.classList.remove("is-empty");
  animateChanceTo(chance, state.isSpinning ? 240 : 680);
  note.textContent = `${source.name} -> ${target.name}`;
  button.disabled = state.isSpinning;
  applyChanceOutcomeVisual();
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

  state.upgradeOutcome = success ? "win" : "lose";
  applyChanceOutcomeVisual();
  resultNode.classList.remove("success", "fail");
  resultNode.textContent = "";
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
    state.upgradeOutcome = null;
    applyChanceOutcomeVisual();

    actionButton.disabled = true;
    actionButton.textContent = t("button_upgrade_spin");
    result.classList.remove("success", "fail");
    result.textContent = "";

    try {
      const fairRoll = await getFairRoll(chance);
      const spinResult = await spinArrowToResult(fairRoll.targetAngle);
      applyUpgradeResult(fairRoll.success, source, target, spinResult.landed, chance, result);
      recordAnalytics("upgradeAttempts");

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
      state.upgradeOutcome = null;
      applyChanceOutcomeVisual();
      result.classList.remove("success", "fail");
      result.textContent = "";
    } finally {
      state.isSpinning = false;
      actionButton.textContent = t("button_upgrade_start");
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
  applyStaticLocalization();
  renderSettingsPage();
  renderLanguagePage();
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
    img.alt = t("avatar_alt");
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
    video.setAttribute("aria-label", t("avatar_alt"));
    video.preload = "metadata";
    video.onerror = () => applyImage(avatarUrl);
    container.replaceChildren(video);
    return;
  }

  applyImage(avatarUrl);
}

function applyUserProfile(user) {
  const fullNameRaw = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const fullName = normalizeDisplayName(fullNameRaw) || t("guest_name");
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
  handleNode.setAttribute("title", handle ? t("copy_username_title") : "");

  if (compactId) {
    idNode.textContent = `ID ${compactId}`;
    idNode.classList.remove("hidden");
    idNode.dataset.copyLabel = `ID ${compactId}`;
    idNode.dataset.copyValue = fullId || compactId;
    idNode.setAttribute("title", t("copy_id_title"));
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
    state.currentUser = { ...fallbackUser };
    applyUserProfile(state.currentUser);
    return;
  }

  try {
    tg.ready();
    tg.expand();
    if (typeof tg.setBackgroundColor === "function") tg.setBackgroundColor("#0a0b0f");
    if (typeof tg.setHeaderColor === "function") tg.setHeaderColor("#0a0b0f");
    if (typeof tg.disableVerticalSwipes === "function") tg.disableVerticalSwipes();

    const user = tg.initDataUnsafe?.user;
    const mergedUser = user ? { ...fallbackUser, ...user } : { ...fallbackUser };
    state.currentUser = mergedUser;
    state.telegramLanguage = String(user?.language_code || "").trim();
    applyUserProfile(mergedUser);
  } catch (error) {
    console.error("Telegram WebApp init error:", error);
    state.currentUser = { ...fallbackUser };
    applyUserProfile(state.currentUser);
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

  const setWalletButtonKey = (key) => {
    state.walletUi.buttonKey = key;
    setWalletButtonText(t(key));
  };

  const setWalletShort = (key, params = {}) => {
    state.walletUi.shortKey = key;
    state.walletUi.shortParams = params;
    walletShort.textContent = t(key, params);
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

  const refreshWalletLocale = () => {
    setWalletButtonText(t(state.walletUi.buttonKey || "wallet_connect"));
    walletShort.textContent = t(state.walletUi.shortKey || "wallet_not_connected", state.walletUi.shortParams || {});
    if (state.walletUi.balanceLoading) {
      walletBubbleBalance.textContent = t("wallet_balance_loading");
    }
  };

  state.refreshWalletLocale = refreshWalletLocale;

  const loadWalletBalance = async (address) => {
    const token = ++balanceRequestToken;
    state.walletUi.balanceLoading = true;
    walletBubbleBalance.textContent = t("wallet_balance_loading");
    const balance = await fetchWalletTonBalance(address);
    if (token !== balanceRequestToken) return;
    state.walletUi.balanceLoading = false;
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
    setWalletShort("wallet_syncing_nft");
    const marketData = await fetchWalletMarketData(address);
    if (token !== nftRequestToken) return null;

    if (!marketData) {
      setWalletShort("wallet_nft_load_error");
      return null;
    }

    applyWalletMarketData(marketData);

    if (marketData.profileInventory.length === 0) {
      setWalletShort("wallet_no_nft");
    } else if (marketData.inventory.length === 0) {
      setWalletShort("wallet_no_prices");
    } else {
      setWalletShort("wallet_nft_count", { count: marketData.profileInventory.length });
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
    setWalletShort("wallet_tonconnect_missing");
    setWalletButtonKey("wallet_connect");
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
    setWalletShort("wallet_tonconnect_init_error");
    setWalletButtonKey("wallet_connect");
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

    setWalletButtonKey("wallet_connect");
    connectButton.classList.toggle("hidden", connected);
    connectButton.disabled = false;
    setBubbleState(connected);

    if (connected) {
      const isNewConnection = state.tonAddress !== address;
      state.tonAddress = address;
      if (isNewConnection) {
        recordAnalytics("walletConnects");
      }

      setWalletShort("wallet_syncing_nft");
      startBalancePolling(address);
      startNftPolling(address);
    } else {
      state.tonAddress = "";
      stopBalancePolling();
      stopNftPolling();
      state.walletUi.balanceLoading = false;
      walletBubbleBalance.textContent = "-- TON";
      setWalletShort("wallet_not_connected");
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
      setWalletShort("wallet_connect_failed");
    }
  });
}

async function bootstrap() {
  loadPersistentData();
  recordAnalytics("launches");
  setNetworkStatus("idle");
  monitorNetworkFreshness();
  await prepareFairState();
  setupDeviceProfileWatcher();
  setupTabs();
  setupTelegramUser();
  setupLocalization();
  setupProfileCopyActions();
  setOrbitAngle(state.orbitAngle);
  paintChance(state.displayedChance);
  setupUpgradeFlow();

  renderAll();
  await loadAppData();
  renderAll();
  setNetworkStatus(state.network.online ? "ready" : "offline", state.network.online ? "network_done" : "network_offline");
  setupTonConnect();
}

bootstrap();
