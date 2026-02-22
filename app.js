const APP_VERSION = "2026-02-22-76";

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
const TONAPI_TESTNET_BASE = String(window.__UPNFT_TONAPI_TESTNET_BASE__ || "https://testnet.tonapi.io/v2").replace(/\/$/, "");
const TONCENTER_TESTNET_BASE = String(window.__UPNFT_TONCENTER_TESTNET_BASE__ || "https://testnet.toncenter.com/api/v2").replace(/\/$/, "");
const TELEGRAM_GIFTS_ENDPOINT = String(window.__UPNFT_GIFTS_ENDPOINT__ || "").trim();
const UPGRADE_API_BASE = String(window.__UPNFT_UPGRADE_API_BASE__ || "").trim().replace(/\/$/, "");
const BANK_WALLET_ADDRESS = String(
  window.__UPNFT_BANK_WALLET__
  || "UQCgQQSGPlFWr5TY8UVT7XvtkVtNkRPIGUEnFOB4gRZbQEu4",
).trim();
const SECURE_UPGRADE_REQUIRED = window.__UPNFT_SECURE_UPGRADE_REQUIRED__ !== false;
const NFT_PAGE_LIMIT = 100;
const NFT_MAX_PAGES = 4;
const COLLECTION_SCAN_LIMIT = 60;
const MAX_COLLECTIONS_FOR_MARKET = 6;
const MAX_TARGETS = 60;
const HISTORY_LIMIT = 60;
const RENDER_CHUNK_SIZE = 16;
const STALE_MS = 120000;
const UPGRADE_COOLDOWN_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_UPGRADE_COOLDOWN_MS__, 4500)),
  500,
  60000,
);
const UPGRADE_QUEUE_MAX_WAIT_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_UPGRADE_QUEUE_MAX_WAIT_MS__, 60000)),
  5000,
  60000,
);
const UPGRADE_QUEUE_POLL_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_UPGRADE_QUEUE_POLL_MS__, 1200)),
  450,
  5000,
);
const UPGRADE_OFFER_TTL_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_OFFER_TTL_MS__, 60000)),
  10000,
  60000,
);
const UPGRADE_DECLINE_PENALTY_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_UPGRADE_DECLINE_PENALTY_MS__, 60000)),
  5000,
  300000,
);
const UPGRADE_MAX_TARGET_MULTIPLIER = clamp(
  toNumber(window.__UPNFT_MAX_TARGET_MULTIPLIER__, 1.67),
  1,
  20,
);
const UPGRADE_MAX_TARGET_OFFSET = clamp(
  toNumber(window.__UPNFT_MAX_TARGET_OFFSET__, 0),
  0,
  1000000,
);
const MAX_UPGRADE_SOURCE_NFTS = clamp(
  Math.floor(toNumber(window.__UPNFT_MAX_SOURCE_NFTS__, 5)),
  1,
  5,
);
const UPGRADE_STEP_SOURCE = "source";
const UPGRADE_STEP_TARGET = "target";
const BOOT_SPLASH_MIN_MS = clamp(
  Math.floor(toNumber(window.__UPNFT_BOOT_SPLASH_MIN_MS__, 800)),
  250,
  5000,
);
const TON_CHAIN_MAINNET = "-239";
const TON_CHAIN_TESTNET = "-3";

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
    note_secure_backend_required: "Апгрейд временно недоступен: не подключен защищенный сервер.",
    note_secure_wallet_required: "Подключи кошелек для защищенного апгрейда.",

    note_upgrade_cooldown: "Cooldown: {seconds}s",
    note_upgrade_penalty: "Offer lock: {seconds}s",
    button_upgrade_start: "Запустить апгрейд",
    button_upgrade_spin: "Крутим...",
    button_continue: "Продолжить",
    button_back: "Назад",
    title_pick_target: "Выбор NFT",
    note_pick_target: "Выбери цель апгрейда",
    note_pick_source: "Выбери до {count} NFT",

    button_upgrade_queue: "Queue...",
    button_upgrade_cooldown: "Cooldown {seconds}s",
    button_upgrade_penalty: "Blocked {seconds}s",
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
    nft_card_auction_soon: "Аукцион скоро завершится",
    nft_card_owned: "В инвентаре",
    nft_status_for_sale: "For sale",
    nft_status_market: "Маркет",
    nft_status_wallet: "Кошелек",
    nft_status_telegram: "Telegram",
    nft_status_bank: "Банк",
    task_status_active: "Активно",
    result_win: "Выигрыш",
    result_loss: "Проигрыш",
    result_error: "Ошибка апгрейда",
    result_security_reject: "Операция отклонена защитой",

    result_cooldown: "Cooldown active: {seconds}s",
    result_penalty: "Offer lock: {seconds}s",
    result_queue_wait: "Queue: ~{seconds}s",
    result_queue_wait_pos: "Queue #{position}: ~{seconds}s",
    result_queue_timeout: "Queue wait timeout. Try again.",
    result_offer_timeout: "Offer expired. Try again later.",
    result_offer_rejected: "Offer was not accepted.",
    payout_ton_label: "TON выплата",
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
    wallet_no_nft: "NFT не найдены ни в кошельке, ни в Telegram-профиле.",
    wallet_no_prices: "NFT загружены, цены TON не найдены",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect недоступен",
    wallet_tonconnect_init_error: "Ошибка инициализации TON Connect",
    wallet_connect_failed: "Не удалось подключить кошелек",
    wallet_disconnect: "Отвязать кошелек",
    wallet_actions_aria: "Действия кошелька",
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
    note_secure_backend_required: "Upgrade is unavailable: secure backend is not configured.",
    note_secure_wallet_required: "Connect wallet to run a secure upgrade.",

    note_upgrade_cooldown: "Cooldown: {seconds}s",
    note_upgrade_penalty: "Offer lock: {seconds}s",
    button_upgrade_start: "Start upgrade",
    button_upgrade_spin: "Spinning...",
    button_continue: "Continue",
    button_back: "Back",
    title_pick_target: "Pick target",
    note_pick_target: "Pick upgrade target",
    note_pick_source: "Choose up to {count} NFT",

    button_upgrade_queue: "Queue...",
    button_upgrade_cooldown: "Cooldown {seconds}s",
    button_upgrade_penalty: "Blocked {seconds}s",
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
    nft_card_auction_soon: "Auction will close soon",
    nft_card_owned: "In inventory",
    nft_status_for_sale: "For sale",
    nft_status_market: "Market",
    nft_status_wallet: "Wallet",
    nft_status_telegram: "Telegram",
    nft_status_bank: "Bank",
    task_status_active: "Active",
    result_win: "Win",
    result_loss: "Lose",
    result_error: "Upgrade error",
    result_security_reject: "Blocked by security checks",

    result_cooldown: "Cooldown active: {seconds}s",
    result_penalty: "Offer lock: {seconds}s",
    result_queue_wait: "Queue: ~{seconds}s",
    result_queue_wait_pos: "Queue #{position}: ~{seconds}s",
    result_queue_timeout: "Queue wait timeout. Try again.",
    result_offer_timeout: "Offer expired. Try again later.",
    result_offer_rejected: "Offer was not accepted.",
    payout_ton_label: "TON payout",
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
    wallet_no_nft: "No NFT found in wallet or Telegram profile.",
    wallet_no_prices: "NFT loaded, TON prices not found",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect is unavailable",
    wallet_tonconnect_init_error: "TON Connect init error",
    wallet_connect_failed: "Wallet connection failed",
    wallet_disconnect: "Disconnect wallet",
    wallet_actions_aria: "Wallet actions",
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
    note_secure_backend_required: "Апгрейд тимчасово недоступний: не підключено захищений сервер.",
    note_secure_wallet_required: "Підключи гаманець для захищеного апгрейда.",

    note_upgrade_cooldown: "Cooldown: {seconds}s",
    note_upgrade_penalty: "Offer lock: {seconds}s",
    button_upgrade_start: "Запустити апгрейд",
    button_upgrade_spin: "Крутимо...",
    button_continue: "Продовжити",
    button_back: "Назад",
    title_pick_target: "Вибір NFT",
    note_pick_target: "Обери ціль апгрейду",
    note_pick_source: "Обери до {count} NFT",

    button_upgrade_queue: "Queue...",
    button_upgrade_cooldown: "Cooldown {seconds}s",
    button_upgrade_penalty: "Blocked {seconds}s",
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
    nft_card_auction_soon: "Аукціон скоро завершиться",
    nft_card_owned: "В інвентарі",
    nft_status_for_sale: "For sale",
    nft_status_market: "Маркет",
    nft_status_wallet: "Гаманець",
    nft_status_telegram: "Telegram",
    nft_status_bank: "Банк",
    task_status_active: "Активно",
    result_win: "Виграш",
    result_loss: "Програш",
    result_error: "Помилка апгрейда",
    result_security_reject: "Операцію відхилено захистом",

    result_cooldown: "Cooldown active: {seconds}s",
    result_penalty: "Offer lock: {seconds}s",
    result_queue_wait: "Queue: ~{seconds}s",
    result_queue_wait_pos: "Queue #{position}: ~{seconds}s",
    result_queue_timeout: "Queue wait timeout. Try again.",
    result_offer_timeout: "Offer expired. Try again later.",
    result_offer_rejected: "Offer was not accepted.",
    payout_ton_label: "TON виплата",
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
    wallet_no_nft: "NFT не знайдено ні в гаманці, ні в Telegram-профілі.",
    wallet_no_prices: "NFT завантажені, ціни TON не знайдено",
    wallet_nft_count: "NFT: {count}",
    wallet_tonconnect_missing: "TonConnect недоступний",
    wallet_tonconnect_init_error: "Помилка ініціалізації TON Connect",
    wallet_connect_failed: "Не вдалося підключити гаманець",
    wallet_disconnect: "Відвʼязати гаманець",
    wallet_actions_aria: "Дії гаманця",
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
  upgradeGuard: "upnft_upgrade_guard_v1",
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
  selectedOwnIds: [],
  selectedTargetId: null,
  upgradeStep: UPGRADE_STEP_SOURCE,
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
  tonChain: "",
  refreshWalletData: null,
  refreshTelegramGifts: null,
  openWalletModal: null,
  refreshWalletLocale: null,
  orbitAngle: 0,
  isSpinning: false,
  spinRafId: null,
  chanceRafId: null,
  upgradeGuardTimerId: null,
  displayedChance: 0,
  upgradeOutcome: null,
  upgradeFlow: {
    waitingQueue: false,
    cooldownUntil: 0,
    penaltyUntil: 0,
  },
  locale: DEFAULT_LOCALE,
  localeSearch: "",
  languageReturnTab: "settings",
  device: "mobile",
  deviceWatchBound: false,
  layoutRafId: null,
  navGlowRafId: null,
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

let bootSplashStartedAt = (typeof performance !== "undefined" && typeof performance.now === "function")
  ? performance.now()
  : Date.now();

const CP1251_DECODER = (() => {
  try {
    return new TextDecoder("windows-1251", { fatal: false });
  } catch {
    return null;
  }
})();

const UTF8_DECODER = (() => {
  try {
    return new TextDecoder("utf-8", { fatal: false });
  } catch {
    return null;
  }
})();

const CP1251_CHAR_TO_BYTE = (() => {
  const map = new Map();
  if (!CP1251_DECODER) return map;

  for (let index = 0; index < 256; index += 1) {
    const byte = Uint8Array.of(index);
    const char = CP1251_DECODER.decode(byte);
    if (!map.has(char)) {
      map.set(char, index);
    }
  }
  return map;
})();

function looksLikeMojibakeText(value) {
  const raw = String(value ?? "");
  if (!raw) return false;
  if (raw.includes("вЂ") || raw.includes("в„")) return true;
  const chunks = raw.match(/[РС][А-Яа-яЁёЇїІіЄє]/g) || [];
  return chunks.length >= 2;
}

function decodeCp1251Utf8Mojibake(value) {
  const raw = String(value ?? "");
  if (!raw || !UTF8_DECODER || CP1251_CHAR_TO_BYTE.size === 0) return raw;

  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    const byte = CP1251_CHAR_TO_BYTE.get(raw[index]);
    if (byte === undefined) {
      return raw;
    }
    bytes[index] = byte;
  }

  try {
    return UTF8_DECODER.decode(bytes);
  } catch {
    return raw;
  }
}

function fixMojibakeText(value) {
  const raw = String(value ?? "");
  if (!raw || !looksLikeMojibakeText(raw)) return raw;

  const decoded = decodeCp1251Utf8Mojibake(raw);
  if (!decoded || decoded === raw || decoded.includes("�")) return raw;

  const decodedLetters = (decoded.match(/[A-Za-zА-Яа-яЁёЇїІіЄє]/g) || []).length;
  if (decodedLetters === 0 && !decoded.includes("•")) return raw;
  return decoded;
}

function sanitizeTranslationsAndLocales() {
  Object.keys(TRANSLATIONS).forEach((localeCode) => {
    const pack = TRANSLATIONS[localeCode];
    if (!pack || typeof pack !== "object") return;
    Object.keys(pack).forEach((key) => {
      if (typeof pack[key] !== "string") return;
      pack[key] = fixMojibakeText(pack[key]);
    });
  });

  LOCALE_OPTIONS.forEach((option) => {
    if (!option || typeof option !== "object") return;
    if (!Array.isArray(option.tokens)) return;
    option.tokens = option.tokens
      .map((token) => fixMojibakeText(token))
      .map((token) => String(token ?? "").trim())
      .filter(Boolean);
  });
}

function fixMojibakeInDom(root = document) {
  if (!root?.body || typeof root.createTreeWalker !== "function") return;

  const textFilter = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
  const walker = root.createTreeWalker(root.body, textFilter);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const nextValue = fixMojibakeText(node.nodeValue ?? "");
    if (nextValue && nextValue !== node.nodeValue) {
      node.nodeValue = nextValue;
    }
  });

  const attributes = ["placeholder", "aria-label", "title"];
  root.querySelectorAll("*").forEach((element) => {
    attributes.forEach((attribute) => {
      const raw = element.getAttribute(attribute);
      if (!raw) return;
      const fixed = fixMojibakeText(raw);
      if (fixed && fixed !== raw) {
        element.setAttribute(attribute, fixed);
      }
    });
  });
}

sanitizeTranslationsAndLocales();

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
  return formatI18n(fixMojibakeText(value), params);
}

function detectDeviceProfile() {
  const tgPlatform = String(window.Telegram?.WebApp?.platform || "").toLowerCase();
  const desktopPlatforms = new Set(["tdesktop", "macos", "web", "weba", "webk", "webz"]);
  const mobilePlatforms = new Set(["android", "ios"]);
  const width = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0);
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches === true;
  const touchPoints = toNumber(navigator.maxTouchPoints, 0);

  if (desktopPlatforms.has(tgPlatform)) {
    // Telegram Desktop often opens Mini Apps in narrow popups.
    // Use mobile layout for narrow widths to avoid cropped desktop cards.
    if (width < 980 || coarsePointer || touchPoints > 1) return "mobile";
    return "desktop";
  }
  if (mobilePlatforms.has(tgPlatform)) return "mobile";

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
      scheduleLayoutAnchors();
    }, 120);
  };

  window.addEventListener("resize", onResize, { passive: true });

  const tg = window.Telegram?.WebApp;
  if (tg && typeof tg.onEvent === "function") {
    tg.onEvent("viewportChanged", onResize);
  }

  state.deviceWatchBound = true;
  scheduleLayoutAnchors();
}

function refreshLayoutAnchors() {
  const shell = document.getElementById("app-shell");
  const sectionsWrap = document.querySelector(".sections-wrap");
  const walletBubble = document.getElementById("wallet-bubble");
  const bottomNav = document.querySelector(".bottom-nav");
  if (!shell || !sectionsWrap) return;

  const shellRect = shell.getBoundingClientRect();
  const layoutMode = shellRect.width >= 900 ? "wide" : "compact";
  shell.dataset.layout = layoutMode;
  document.body.dataset.layout = layoutMode;
  let topPad = 4;

  if (walletBubble && !walletBubble.classList.contains("hidden")) {
    const bubbleRect = walletBubble.getBoundingClientRect();
    const offsetFromShellTop = bubbleRect.bottom - shellRect.top;
    topPad = Math.max(8, Math.round(offsetFromShellTop + 8));
  }

  sectionsWrap.style.setProperty("--sections-top-pad", `${topPad}px`);

  const navHeight = bottomNav ? Math.round(bottomNav.getBoundingClientRect().height) : 88;
  shell.style.setProperty("--runtime-nav-height", `${Math.max(64, navHeight)}px`);
  scheduleNavGlowIndicator();
}

function scheduleLayoutAnchors() {
  if (state.layoutRafId) {
    cancelAnimationFrame(state.layoutRafId);
    state.layoutRafId = null;
  }

  state.layoutRafId = requestAnimationFrame(() => {
    state.layoutRafId = null;
    refreshLayoutAnchors();
  });
}

function updateNavGlowIndicator() {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;

  const activeButton = nav.querySelector(".nav-btn.is-active");
  if (!activeButton || nav.classList.contains("is-hidden")) {
    nav.classList.remove("is-ready");
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();
  const centerX = (buttonRect.left - navRect.left) + (buttonRect.width / 2);
  const glowWidth = clamp(buttonRect.width * 0.42, 24, 56);

  nav.style.setProperty("--nav-glow-x", `${centerX.toFixed(2)}px`);
  nav.style.setProperty("--nav-glow-w", `${glowWidth.toFixed(2)}px`);
  nav.classList.add("is-ready");
}

function scheduleNavGlowIndicator() {
  if (state.navGlowRafId) {
    cancelAnimationFrame(state.navGlowRafId);
    state.navGlowRafId = null;
  }

  state.navGlowRafId = requestAnimationFrame(() => {
    state.navGlowRafId = null;
    updateNavGlowIndicator();
  });
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

function randomBetween(min, max) {
  const start = toNumber(min, 0);
  const end = toNumber(max, start);
  if (end <= start) return start;
  return start + (randomUnit() * (end - start));
}

function createClientRequestId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  const part = Math.floor(randomUnit() * 1e9).toString(36);
  return `rq-${Date.now().toString(36)}-${part}`;
}

function normalizeComparable(value) {
  return String(value ?? "").trim();
}

function ensureBindingMatch(actualValue, expectedValue, label) {
  const actual = normalizeComparable(actualValue);
  const expected = normalizeComparable(expectedValue);
  if (!actual || !expected) return;
  if (actual !== expected) {
    throw new Error(`Security mismatch: ${label}`);
  }
}

function assertUpgradePayloadBinding(payload, context = {}) {
  const safePayload = payload && typeof payload === "object" ? payload : {};
  const safeContext = context && typeof context === "object" ? context : {};

  ensureBindingMatch(
    safePayload.session_id ?? safePayload.sessionId,
    safeContext.sessionId,
    "session_id",
  );
  ensureBindingMatch(
    safePayload.client_request_id ?? safePayload.clientRequestId,
    safeContext.requestId,
    "client_request_id",
  );
  ensureBindingMatch(
    safePayload.source_nft_id ?? safePayload.sourceNftId,
    safeContext.sourceId,
    "source_nft_id",
  );
  ensureBindingMatch(
    safePayload.target_nft_id ?? safePayload.targetNftId,
    safeContext.targetId,
    "target_nft_id",
  );
  ensureBindingMatch(
    safePayload.wallet ?? safePayload.wallet_address ?? safePayload.walletAddress,
    safeContext.wallet,
    "wallet",
  );
  ensureBindingMatch(
    safePayload.user_id ?? safePayload.userId,
    safeContext.userId,
    "user_id",
  );
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
  node.textContent = fixMojibakeText(value);
}

function setPlaceholder(selector, value) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.setAttribute("placeholder", fixMojibakeText(value));
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
  setText("#upgrade-side-title", t("my_nft_title"));
  setText("#upgrade-continue-btn", t("button_continue"));
  setText("#upgrade-back-btn", t("button_back"));
  setText(".history-head h3", t("history_title"));
  setText("#history-clear-btn", t("history_clear"));
  setText("#upgrade-btn", getUpgradeButtonLabel());
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
  setText("#wallet-disconnect-btn", t("wallet_disconnect"));
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

  const walletBubble = document.getElementById("wallet-bubble");
  const walletMenu = document.getElementById("wallet-menu");
  if (walletBubble) walletBubble.setAttribute("aria-label", t("wallet_actions_aria"));
  if (walletMenu) walletMenu.setAttribute("aria-label", t("wallet_actions_aria"));

  scheduleNavGlowIndicator();

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

function nowHiResMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return nowMs();
}

function markBootSplashStart() {
  bootSplashStartedAt = nowHiResMs();
}

async function hideBootSplash() {
  const loader = document.getElementById("boot-loader");
  if (!loader || loader.classList.contains("is-hidden")) return;

  const elapsed = Math.max(0, nowHiResMs() - bootSplashStartedAt);
  const waitMs = Math.max(0, BOOT_SPLASH_MIN_MS - elapsed);
  if (waitMs > 0) {
    await sleepMs(waitMs);
  }

  loader.classList.add("is-hiding");
  await sleepMs(320);
  loader.classList.add("is-hidden");
  loader.setAttribute("aria-hidden", "true");
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

function createUpgradeError(code, message = "") {
  const safeCode = String(code || "upgrade_error");
  const error = new Error(message || safeCode);
  error.code = safeCode;
  return error;
}

function normalizeUpgradeErrorCode(error) {
  const directCode = String(error?.code || "").trim().toLowerCase();
  if (directCode) {
    if (directCode.startsWith("security")) return "security";
    if (directCode.startsWith("offer_timeout")) return "offer_timeout";
    if (directCode.startsWith("offer_rejected")) return "offer_rejected";
    if (directCode.startsWith("queue_timeout")) return "queue_timeout";
    if (directCode.startsWith("cooldown")) return "cooldown";
    if (directCode.startsWith("penalty")) return "penalty";
    return directCode;
  }

  const message = String(error?.message || "").toLowerCase();
  if (message.includes("queue timeout")) return "queue_timeout";
  if (message.includes("offer timeout")) return "offer_timeout";
  if (message.includes("offer rejected")) return "offer_rejected";
  if (message.includes("cooldown")) return "cooldown";
  if (message.includes("security")) return "security";
  return "unknown";
}

function getUpgradeCooldownRemainingMs(referenceTime = nowMs()) {
  return Math.max(0, toNumber(state.upgradeFlow.cooldownUntil, 0) - referenceTime);
}

function getUpgradePenaltyRemainingMs(referenceTime = nowMs()) {
  return Math.max(0, toNumber(state.upgradeFlow.penaltyUntil, 0) - referenceTime);
}

function persistUpgradeGuardState() {
  writeLocalJson(LOCAL_KEYS.upgradeGuard, {
    cooldownUntil: Math.max(0, Math.floor(toNumber(state.upgradeFlow.cooldownUntil, 0))),
    penaltyUntil: Math.max(0, Math.floor(toNumber(state.upgradeFlow.penaltyUntil, 0))),
  });
}

function clearUpgradeGuardExpired() {
  const now = nowMs();
  if (toNumber(state.upgradeFlow.cooldownUntil, 0) <= now) {
    state.upgradeFlow.cooldownUntil = 0;
  }
  if (toNumber(state.upgradeFlow.penaltyUntil, 0) <= now) {
    state.upgradeFlow.penaltyUntil = 0;
  }
}

function syncUpgradeGuardTicker() {
  clearUpgradeGuardExpired();
  const hasGuardWindow = getUpgradeCooldownRemainingMs() > 0 || getUpgradePenaltyRemainingMs() > 0;
  if (hasGuardWindow) {
    if (state.upgradeGuardTimerId) return;
    state.upgradeGuardTimerId = window.setInterval(() => {
      clearUpgradeGuardExpired();
      refreshUpgradeState();
      if (getUpgradeCooldownRemainingMs() <= 0 && getUpgradePenaltyRemainingMs() <= 0) {
        clearInterval(state.upgradeGuardTimerId);
        state.upgradeGuardTimerId = null;
      }
    }, 300);
    return;
  }

  if (state.upgradeGuardTimerId) {
    clearInterval(state.upgradeGuardTimerId);
    state.upgradeGuardTimerId = null;
  }
}

function armUpgradeCooldown(extraMs = UPGRADE_COOLDOWN_MS) {
  const now = nowMs();
  const cooldownMs = clamp(Math.floor(toNumber(extraMs, UPGRADE_COOLDOWN_MS)), 500, 600000);
  state.upgradeFlow.cooldownUntil = Math.max(toNumber(state.upgradeFlow.cooldownUntil, 0), now + cooldownMs);
  persistUpgradeGuardState();
  syncUpgradeGuardTicker();
}

function armUpgradePenalty(extraMs = UPGRADE_DECLINE_PENALTY_MS) {
  const now = nowMs();
  const penaltyMs = clamp(Math.floor(toNumber(extraMs, UPGRADE_DECLINE_PENALTY_MS)), 1000, 900000);
  state.upgradeFlow.penaltyUntil = Math.max(toNumber(state.upgradeFlow.penaltyUntil, 0), now + penaltyMs);
  state.upgradeFlow.cooldownUntil = Math.max(toNumber(state.upgradeFlow.cooldownUntil, 0), now + Math.min(penaltyMs, UPGRADE_OFFER_TTL_MS));
  persistUpgradeGuardState();
  syncUpgradeGuardTicker();
}

function getUpgradeButtonLabel() {
  if (state.isSpinning && state.upgradeFlow.waitingQueue) {
    return t("button_upgrade_queue");
  }
  if (state.isSpinning) {
    return t("button_upgrade_spin");
  }

  const penaltyLeft = getUpgradePenaltyRemainingMs();
  if (penaltyLeft > 0) {
    return t("button_upgrade_penalty", { seconds: Math.max(1, Math.ceil(penaltyLeft / 1000)) });
  }

  const cooldownLeft = getUpgradeCooldownRemainingMs();
  if (cooldownLeft > 0) {
    return t("button_upgrade_cooldown", { seconds: Math.max(1, Math.ceil(cooldownLeft / 1000)) });
  }

  return t("button_upgrade_start");
}

function formatTargetLimitNote(maxTargetValue) {
  const maxText = formatTon(maxTargetValue);
  if (state.locale === "en") return `Max target: ${maxText}`;
  if (state.locale === "uk") return `Макс ціль: ${maxText}`;
  return `Макс цель: ${maxText}`;
}

function formatTargetLimitError(maxTargetValue) {
  const maxText = formatTon(maxTargetValue);
  if (state.locale === "en") return `Target is above limit (${maxText})`;
  if (state.locale === "uk") return `Ціль вище ліміту (${maxText})`;
  return `Цель выше лимита (${maxText})`;
}

function getUpgradeErrorMessage(error) {
  const code = normalizeUpgradeErrorCode(error);
  if (code === "queue_timeout") return t("result_queue_timeout");
  if (code === "offer_timeout") return t("result_offer_timeout");
  if (code === "offer_rejected") return t("result_offer_rejected");
  if (code === "target_limit") {
    return formatTargetLimitError(toNumber(error?.maxTargetValue, 0));
  }
  if (code === "cooldown") {
    return t("result_cooldown", { seconds: Math.max(1, Math.ceil(getUpgradeCooldownRemainingMs() / 1000)) });
  }
  if (code === "penalty") {
    return t("result_penalty", { seconds: Math.max(1, Math.ceil(getUpgradePenaltyRemainingMs() / 1000)) });
  }
  if (code === "security") return t("result_security_reject");
  return t("result_error");
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

  const savedUpgradeGuard = readLocalJson(LOCAL_KEYS.upgradeGuard, null);
  if (savedUpgradeGuard && typeof savedUpgradeGuard === "object") {
    state.upgradeFlow.cooldownUntil = Math.max(0, Math.floor(toNumber(savedUpgradeGuard.cooldownUntil, 0)));
    state.upgradeFlow.penaltyUntil = Math.max(0, Math.floor(toNumber(savedUpgradeGuard.penaltyUntil, 0)));
  }
  clearUpgradeGuardExpired();
  persistUpgradeGuardState();
  syncUpgradeGuardTicker();
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

function getMaxTargetValueForSourceValue(sourceValue) {
  const safeSourceValue = toNumber(sourceValue, NaN);
  if (!Number.isFinite(safeSourceValue) || safeSourceValue <= 0) return 0;
  const raised = (safeSourceValue * UPGRADE_MAX_TARGET_MULTIPLIER) + UPGRADE_MAX_TARGET_OFFSET;
  return Math.max(safeSourceValue, raised);
}

function getMaxTargetValueForSource(source) {
  return getMaxTargetValueForSourceValue(source?.value);
}

function isTargetWithinUpgradeLimit(source, target) {
  if (!source || !target) return false;
  const maxTargetValue = getMaxTargetValueForSource(source);
  if (!Number.isFinite(maxTargetValue) || maxTargetValue <= 0) return false;
  return toNumber(target?.value, 0) <= (maxTargetValue + 1e-9);
}

function getEligibleTargetsForSource(source, list = state.data.targets) {
  if (!source) return [];
  return safeArray(list).filter((target) => isTargetWithinUpgradeLimit(source, target));
}

function getFilteredTargets(source = getSelectedSourceAggregate()) {
  const eligibleTargets = getEligibleTargetsForSource(source, state.data.targets);
  const filtered = filterNfts(eligibleTargets, state.ui.targetSearch);
  return sortNfts(filtered, state.ui.targetSort);
}

function getFilteredOwnNfts() {
  const filtered = filterNfts(state.data.inventory, state.ui.ownSearch);
  return sortNfts(filtered, state.ui.ownSort);
}

function moveTargetPanelToSide() {
  const sideCol = document.querySelector(".upgrade-side-col");
  const targetPanel = document.getElementById("target-panel");
  if (!sideCol || !targetPanel) return;

  if (targetPanel.parentElement !== sideCol) {
    sideCol.append(targetPanel);
  }
}

function updateUpgradeStepLayout() {
  moveTargetPanelToSide();
  const sourceStep = state.upgradeStep === UPGRADE_STEP_SOURCE;
  const selectedCount = getSelectedOwnItems().length;

  const screen = document.querySelector(".upgrade-screen");
  const sideTitle = document.getElementById("upgrade-side-title");
  const targetPanel = document.getElementById("target-panel");
  const ownControls = document.getElementById("own-controls");
  const ownList = document.getElementById("own-nft-list");
  const ownEmpty = document.getElementById("own-empty");
  const continueBtn = document.getElementById("upgrade-continue-btn");
  const backBtn = document.getElementById("upgrade-back-btn");

  if (screen) {
    screen.classList.toggle("is-source-step", sourceStep);
    screen.classList.toggle("is-target-step", !sourceStep);
  }
  if (sideTitle) {
    sideTitle.textContent = sourceStep ? t("my_nft_title") : t("title_pick_target");
  }
  if (targetPanel) targetPanel.classList.toggle("hidden", sourceStep);
  if (ownControls) ownControls.classList.toggle("hidden", !sourceStep);
  if (ownList) ownList.classList.toggle("hidden", !sourceStep);
  if (ownEmpty && !sourceStep) ownEmpty.classList.add("hidden");

  if (continueBtn) {
    continueBtn.textContent = t("button_continue");
    continueBtn.classList.toggle("hidden", !sourceStep || selectedCount === 0 || state.isSpinning);
  }

  if (backBtn) {
    backBtn.textContent = t("button_back");
    backBtn.classList.toggle("hidden", sourceStep || state.isSpinning);
  }
}

function toggleSelectedSourceNft(nftId) {
  const id = String(nftId ?? "").trim();
  if (!id) return false;

  const next = safeArray(state.selectedOwnIds)
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  const currentIndex = next.indexOf(id);
  if (currentIndex >= 0) {
    next.splice(currentIndex, 1);
  } else {
    if (next.length >= MAX_UPGRADE_SOURCE_NFTS) return false;
    next.push(id);
  }

  state.selectedOwnIds = next;
  state.selectedOwnId = next[0] ?? null;
  return true;
}

function setupUpgradeUiControls() {
  if (state.upgradesUiBound) return;

  moveTargetPanelToSide();

  const targetSearch = document.getElementById("target-search");
  const targetSort = document.getElementById("target-sort");
  const ownSearch = document.getElementById("own-search");
  const ownSort = document.getElementById("own-sort");
  const continueBtn = document.getElementById("upgrade-continue-btn");
  const backBtn = document.getElementById("upgrade-back-btn");
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

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (state.isSpinning) return;
      ensureSelectedIds();
      if (getSelectedOwnItems().length === 0) return;
      state.upgradeStep = UPGRADE_STEP_TARGET;
      renderTargetChips();
      updateUpgradeStepLayout();
      refreshUpgradeState();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (state.isSpinning) return;
      state.upgradeStep = UPGRADE_STEP_SOURCE;
      updateUpgradeStepLayout();
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
  updateUpgradeStepLayout();
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

function normalizeTonChainId(chainValue) {
  const raw = String(chainValue ?? "").trim();
  if (!raw) return "";

  const lower = raw.toLowerCase();
  if (
    lower === TON_CHAIN_MAINNET
    || lower === "239"
    || lower === "mainnet"
    || lower === "main"
    || lower === "livenet"
  ) {
    return TON_CHAIN_MAINNET;
  }
  if (
    lower === TON_CHAIN_TESTNET
    || lower === "3"
    || lower === "testnet"
    || lower === "test"
    || lower === "sandbox"
  ) {
    return TON_CHAIN_TESTNET;
  }

  return raw;
}

function isTonTestnetChain(chainValue) {
  return normalizeTonChainId(chainValue) === TON_CHAIN_TESTNET;
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

function getTonChainLookupOrder(chainValue) {
  const normalized = normalizeTonChainId(chainValue);
  if (normalized === TON_CHAIN_TESTNET) return [TON_CHAIN_TESTNET, TON_CHAIN_MAINNET];
  if (normalized === TON_CHAIN_MAINNET) return [TON_CHAIN_MAINNET, TON_CHAIN_TESTNET];
  return [TON_CHAIN_MAINNET, TON_CHAIN_TESTNET];
}

function resolveTonApiBase(chainValue) {
  return isTonTestnetChain(chainValue) ? TONAPI_TESTNET_BASE : TONAPI_BASE;
}

function resolveTonCenterBase(chainValue) {
  return isTonTestnetChain(chainValue) ? TONCENTER_TESTNET_BASE : TONCENTER_BASE;
}

async function fetchJsonWithTimeout(url, timeoutMs = 9000, requestInit = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  markNetworkRequestStart();
  try {
    const baseOptions = requestInit && typeof requestInit === "object" ? requestInit : {};
    const response = await fetch(url, {
      ...baseOptions,
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

async function fetchWalletTonBalance(address, chain = "") {
  const normalizedAddress = normalizeTonAddress(address);
  if (!normalizedAddress) return null;

  const addressCandidates = getTonAddressCandidates(normalizedAddress);
  const normalizedChain = normalizeTonChainId(chain);
  const primaryChain = normalizedChain || TON_CHAIN_MAINNET;
  const fallbackChain = primaryChain === TON_CHAIN_TESTNET ? TON_CHAIN_MAINNET : TON_CHAIN_TESTNET;
  const allowFallback = Boolean(normalizedChain);

  const fetchBalanceForChain = async (chainCandidate) => {
    const tonApiBase = resolveTonApiBase(chainCandidate);
    const tonCenterBase = resolveTonCenterBase(chainCandidate);
    let responded = false;
    let best = null;

    const rememberBalance = (parsed) => {
      if (parsed === null) return;
      const numeric = toNumber(parsed, NaN);
      if (!best) {
        best = { parsed, numeric };
        return;
      }
      if (Number.isFinite(numeric) && (!Number.isFinite(best.numeric) || numeric > best.numeric)) {
        best = { parsed, numeric };
      }
    };

    for (const candidateAddress of addressCandidates) {
      const encoded = encodeURIComponent(candidateAddress);
      let tonApiData = await fetchJsonWithTimeout(`${tonApiBase}/accounts/${encoded}`);
      if (!tonApiData) {
        tonApiData = await fetchJsonWithTimeout(`${tonApiBase}/accounts/${encoded}`);
      }
      if (tonApiData) {
        responded = true;
      }
      const tonApiBalance = tonApiData?.balance;
      if (tonApiBalance !== undefined && tonApiBalance !== null) {
        rememberBalance(formatTonFromNano(tonApiBalance));
      }
    }

    for (const candidateAddress of addressCandidates) {
      const encoded = encodeURIComponent(candidateAddress);
      let tonCenterData = await fetchJsonWithTimeout(`${tonCenterBase}/getAddressInformation?address=${encoded}`);
      if (!tonCenterData) {
        tonCenterData = await fetchJsonWithTimeout(`${tonCenterBase}/getAddressInformation?address=${encoded}`);
      }
      if (tonCenterData) {
        responded = true;
      }
      const tonCenterBalance = tonCenterData?.result?.balance;
      if (tonCenterData?.ok && tonCenterBalance !== undefined && tonCenterBalance !== null) {
        rememberBalance(formatTonFromNano(tonCenterBalance));
      }
    }

    return {
      responded,
      balance: best?.parsed ?? null,
    };
  };

  const primary = await fetchBalanceForChain(primaryChain);
  if (primary.balance !== null) {
    const primaryNumeric = toNumber(primary.balance, NaN);
    // Mobile wallets sometimes report the wrong chain; if explicit chain gives zero,
    // probe the opposite chain and use it only when it has a positive balance.
    if (allowFallback && Number.isFinite(primaryNumeric) && primaryNumeric <= 0) {
      const probe = await fetchBalanceForChain(fallbackChain);
      const probeNumeric = toNumber(probe.balance, NaN);
      if (probe.balance !== null && Number.isFinite(probeNumeric) && probeNumeric > 0) {
        return probe.balance;
      }
    }
    return primary.balance;
  }

  // If chain is unknown, never "mix" balances between mainnet/testnet.
  // Use testnet only when mainnet is unreachable.
  if (!allowFallback && primary.responded) {
    return null;
  }

  const fallback = await fetchBalanceForChain(fallbackChain);
  if (fallback.balance !== null) {
    return fallback.balance;
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

function isLikelyImageAnimationUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.gif|\.webp|\.apng)([\?#].*)?$/.test(raw)
    || raw.includes("gif");
}

function isUnsupportedAnimationUrl(url) {
  const raw = String(url ?? "").trim().toLowerCase();
  if (!raw) return false;
  return /(\.tgs|\.json)([\?#].*)?$/.test(raw);
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
    metadata.tgs,
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

function pickNftAnimationUrl(item) {
  return pickNftAnimationCandidates(item)[0] || "";
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

function pickBestPreviewUrl(item) {
  return pickNftImageCandidates(item)[0] || "";
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
    animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
    animationCandidates,
    backgroundColor: pickNftBackgroundColor(item),
    backgroundImageUrl: pickNftBackgroundImageUrl(item),
    collectionAddress: String(item?.collection?.address ?? "").trim(),
    listed: Boolean(item?.sale),
    source: "wallet",
  };
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

function firstNonEmptyStringFromPaths(source, paths) {
  for (const path of safeArray(paths)) {
    const text = String(readPathValue(source, path) ?? "").trim();
    if (text) return text;
  }
  return "";
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

function normalizeGiftColor(rawValue) {
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    const hex = Math.max(0, Math.floor(rawValue)).toString(16).padStart(6, "0").slice(-6);
    return `#${hex}`;
  }
  const raw = String(rawValue ?? "").trim();
  if (!raw) return "";
  if (/^#?[0-9a-f]{3,8}$/i.test(raw)) {
    return raw.startsWith("#") ? raw : `#${raw}`;
  }
  return normalizeColorValue(raw);
}

function appendGiftColorCandidates(target, rawValue, depth = 0) {
  if (depth > 3 || rawValue === undefined || rawValue === null) return;

  if (Array.isArray(rawValue)) {
    rawValue.forEach((entry) => appendGiftColorCandidates(target, entry, depth + 1));
    return;
  }

  if (typeof rawValue === "object") {
    const colorKeys = [
      "color",
      "hex",
      "value",
      "start",
      "end",
      "from",
      "to",
      "center_color",
      "centerColor",
      "edge_color",
      "edgeColor",
      "top_color",
      "topColor",
      "bottom_color",
      "bottomColor",
      "left_color",
      "leftColor",
      "right_color",
      "rightColor",
      "accent_color",
      "accentColor",
    ];
    colorKeys.forEach((key) => appendGiftColorCandidates(target, rawValue[key], depth + 1));
    return;
  }

  const normalized = normalizeGiftColor(rawValue);
  if (normalized) target.push(normalized);
}

function buildGiftGradient(rawPalette) {
  const palette = [];
  appendGiftColorCandidates(palette, rawPalette, 0);
  const unique = Array.from(new Set(palette)).slice(0, 5);
  if (unique.length < 2) return "";
  return `linear-gradient(145deg, ${unique.join(", ")})`;
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

function isLikelyUpgradedTelegramGift(item) {
  if (!item || typeof item !== "object") return false;
  if (resolveBooleanFromPaths(item, ["is_upgraded", "isUpgraded", "gift.is_upgraded", "gift.isUpgraded"])) return true;
  if (resolveBooleanFromPaths(item, ["is_unique", "isUnique", "gift.is_unique", "gift.isUnique"])) return true;
  if (String(item?.nft_address ?? item?.nftAddress ?? "").trim()) return true;
  if (String(readPathValue(item, "nft.address") ?? "").trim()) return true;
  if (String(readPathValue(item, "gift.nft_address") ?? "").trim()) return true;
  if (String(readPathValue(item, "unique_gift.nft_address") ?? "").trim()) return true;
  if (String(readPathValue(item, "gift.unique_gift.nft_address") ?? "").trim()) return true;
  if (String(readPathValue(item, "gift.number") ?? "").trim()) return true;
  return false;
}

function isLikelyGiftRecord(item) {
  if (!item || typeof item !== "object") return false;
  if (isLikelyUpgradedTelegramGift(item)) return true;
  if (readPathValue(item, "gift")) return true;
  if (readPathValue(item, "unique_gift")) return true;
  if (readPathValue(item, "gift.unique_gift")) return true;
  if (String(item?.name ?? item?.title ?? "").trim()) return true;
  if (String(item?.image_url ?? item?.preview_url ?? "").trim()) return true;
  return false;
}

function extractTelegramGiftItems(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.gifts,
    payload?.items,
    payload?.result,
    payload?.data?.gifts,
    payload?.data?.items,
    payload?.data?.result,
    payload?.response?.gifts,
    payload?.response?.items,
    payload?.payload?.gifts,
    payload?.payload?.items,
  ];

  for (const candidate of candidates) {
    const items = safeArray(candidate);
    if (items.length === 0) continue;
    if (items.some((entry) => isLikelyGiftRecord(entry))) return items;
    if (items.length > 0) return items;
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const nested = safeArray(
      candidate.gifts
      ?? candidate.items
      ?? candidate.result
      ?? candidate.data?.gifts
      ?? candidate.data?.items,
    );
    if (nested.length === 0) continue;
    if (nested.some((entry) => isLikelyGiftRecord(entry))) return nested;
    return nested;
  }

  return [];
}

function buildNftModelFromTelegramGift(item, index) {
  const fallbackFingerprint = firstNonEmptyStringFromPaths(item, [
    "nft.address",
    "gift.nft_address",
    "gift.number",
    "number",
    "gift.id",
    "id",
    "name",
    "title",
    "preview_url",
    "image_url",
  ]);
  const fallbackSlug = String(fallbackFingerprint || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  const giftId = firstNonEmptyString(
    firstNonEmptyStringFromPaths(item, [
      "nft_address",
      "nftAddress",
      "nft.address",
      "gift.nft_address",
      "gift.nftAddress",
      "gift.nft.address",
      "unique_gift.nft_address",
      "uniqueGift.nftAddress",
      "id",
      "gift_id",
      "giftId",
      "gift.id",
      "gift.gift_id",
      "unique_gift.id",
      "uniqueGift.id",
      "token_id",
      "tokenId",
      "nft.id",
      "nft.token_id",
      "number",
      "gift.number",
      "nft.number",
      "unique_gift.number",
      "gift.unique_gift.number",
    ]),
    fallbackSlug ? `tg-gift-${fallbackSlug}` : "",
    `tg-gift-${index + 1}`,
  );
  if (!giftId) return null;

  const animationCandidates = collectMediaCandidatesFromPaths(item, [
    "animation_url",
    "animationUrl",
    "video_url",
    "videoUrl",
    "gif_url",
    "gifUrl",
    "media_url",
    "mediaUrl",
    "media.animation",
    "media.video",
    "media.gif",
    "media.animation_url",
    "media.video_url",
    "media.gif_url",
    "preview.animation",
    "preview.video",
    "preview.gif",
    "preview.animation_url",
    "preview.video_url",
    "nft.animation_url",
    "nft.video_url",
    "nft.preview.video_url",
    "nft.preview.animation_url",
    "nft.preview.video",
    "nft.preview.animation",
    "gift.animation_url",
    "gift.video_url",
    "gift.preview.video_url",
    "gift.preview.animation_url",
    "gift.preview.video",
    "gift.preview.animation",
    "gift.media.animation_url",
    "gift.media.video_url",
    "unique_gift.animation_url",
    "unique_gift.video_url",
    "gift.unique_gift.animation_url",
    "gift.unique_gift.video_url",
    "model.animation_url",
    "model.video_url",
    "model.gif_url",
    "gift.model.animation_url",
    "gift.model.video_url",
    "gift.model.gif_url",
    "unique_gift.model.animation_url",
    "unique_gift.model.video_url",
    "sticker.animation_url",
    "sticker.video_url",
    "sticker.gif_url",
    "fragment.animation_url",
    "fragment.video_url",
  ]);

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
    "preview.image",
    "preview.url",
    "preview.src",
    "media.preview_url",
    "media.thumbnail_url",
    "media.image_url",
    "media.image.url",
    "media.url",
    "media.content_url",
    "nft.image_url",
    "nft.image",
    "nft.preview_url",
    "nft.preview.image_url",
    "nft.preview.url",
    "nft.media.image_url",
    "gift.image_url",
    "gift.photo_url",
    "gift.preview_url",
    "gift.preview.image_url",
    "gift.preview.url",
    "gift.media.url",
    "gift.media.image_url",
    "gift.nft.image_url",
    "gift.nft.preview_url",
    "unique_gift.preview_url",
    "unique_gift.preview.image_url",
    "gift.unique_gift.preview_url",
    "gift.unique_gift.preview.image_url",
    "gift.unique_gift.model.image_url",
    "model.image_url",
    "model.preview_url",
    "model.media_url",
    "model.sticker_url",
    "sticker.url",
    "sticker.image_url",
    "sticker.thumbnail_url",
    "fragment.image_url",
    "fragment.preview_url",
    "fragment.preview.url",
  ]);

  const previewMixedCandidates = normalizeMediaCandidateList(
    readPathValue(item, "previews"),
    readPathValue(item, "preview.items"),
    readPathValue(item, "gift.previews"),
    readPathValue(item, "gift.preview.items"),
    readPathValue(item, "nft.previews"),
    readPathValue(item, "nft.preview.items"),
  );
  previewMixedCandidates.forEach((url) => {
    if (isLikelyVideoUrl(url) || isLikelyImageAnimationUrl(url)) {
      pushUniqueMediaCandidate(animationCandidates, url);
    } else {
      pushUniqueMediaCandidate(imageCandidates, url);
    }
  });

  const animationUrl = animationCandidates.find((url) => !isUnsupportedAnimationUrl(url)) || "";
  const imageUrl = imageCandidates[0] || "";

  const rawPriceNode = firstMeaningfulValueFromPaths(item, [
    "sale.price",
    "market.price",
    "fragment.price",
    "price",
    "gift.price",
    "nft.price",
    "auction.price",
    "listing.price",
  ]);

  let priceTon = parseTonPriceNode(rawPriceNode);
  if (!Number.isFinite(priceTon)) {
    priceTon = firstFiniteNumberFromPaths(item, [
      "price_ton",
      "priceTon",
      "ton_price",
      "tonPrice",
      "value",
      "price",
      "market.price_ton",
      "market.floor_ton",
      "market.floor_price_ton",
      "market.ton_price",
      "fragment.price_ton",
      "fragment.floor_ton",
      "fragment.floor_price_ton",
      "nft.price_ton",
      "nft.market_price_ton",
      "gift.price_ton",
      "gift.market_price_ton",
      "listing.price_ton",
      "auction.price_ton",
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
      "gift.market.price",
      "nft.price",
      "nft.market.price",
      "valuation.ton",
      "market.floor_price",
    ]));
  }
  if (Number.isFinite(priceTon) && priceTon > 1000000) {
    priceTon = priceTon / 1000000000;
  }

  const isFromBlockchain = resolveBooleanFromPaths(item, [
    "is_from_blockchain",
    "isFromBlockchain",
    "nft.is_from_blockchain",
    "gift.is_from_blockchain",
  ]);
  const normalizedTier = String(
    firstNonEmptyStringFromPaths(item, [
      "tier",
      "rarity",
      "nft.rarity",
      "gift.rarity",
      "model.rarity",
      "gift.model.rarity",
      "unique_gift.rarity",
      "gift.unique_gift.rarity",
    ])
    || ((isLikelyUpgradedTelegramGift(item) || isFromBlockchain) ? "Rare" : "Common"),
  ).trim() || "Common";

  const explicitBgColor = normalizeGiftColor(firstNonEmptyStringFromPaths(item, [
    "background_color",
    "backgroundColor",
    "bg_color",
    "bgColor",
    "background.color",
    "theme.background_color",
    "backdrop.background_color",
    "backdrop.center_color",
    "backdrop.centerColor",
    "gift.background_color",
    "gift.backdrop.background_color",
    "gift.backdrop.center_color",
    "gift.theme.background_color",
  ]));

  const paletteSource = firstMeaningfulValueFromPaths(item, [
    "background.colors",
    "background.palette",
    "background.gradient_colors",
    "background.gradient",
    "theme.colors",
    "theme.palette",
    "theme.gradient",
    "backdrop.colors",
    "backdrop.palette",
    "backdrop.gradient",
    "gift.background.colors",
    "gift.theme.colors",
    "gift.backdrop.colors",
    "gift.backdrop.palette",
    "gift.backdrop.gradient",
    "unique_gift.backdrop.colors",
    "model.background.colors",
  ]);
  const gradientBg = buildGiftGradient(paletteSource);

  const backgroundImageUrl = normalizeMediaUrl(firstNonEmptyStringFromPaths(item, [
    "background_image",
    "backgroundImage",
    "pattern_url",
    "patternUrl",
    "background.image_url",
    "background.image.url",
    "background.pattern_url",
    "background.pattern.url",
    "theme.background_image",
    "theme.pattern_url",
    "preview.background_image",
    "preview.pattern_url",
    "gift.background_image",
    "gift.background.image_url",
    "gift.background.pattern_url",
    "nft.background_image",
    "backdrop.image_url",
    "backdrop.pattern_url",
    "backdrop.url",
    "gift.backdrop.image_url",
    "gift.backdrop.pattern_url",
    "gift.backdrop.url",
    "model.background_image_url",
    "model.backdrop_url",
    "fragment.background_url",
    "fragment.pattern_url",
  ]));

  const giftName = String(
    firstNonEmptyStringFromPaths(item, [
      "name",
      "title",
      "nft.name",
      "gift.name",
      "gift.title",
      "model.name",
      "gift.model.name",
      "unique_gift.name",
      "gift.unique_gift.name",
      "base_name",
      "gift.base_name",
      "collection_name",
      "gift.collection_name",
    ]) || "Telegram Gift",
  ).trim() || "Telegram Gift";

  return {
    id: giftId,
    name: giftName,
    tier: normalizedTier,
    value: Number.isFinite(priceTon) && priceTon > 0 ? priceTon : NaN,
    imageUrl,
    imageCandidates,
    animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
    animationCandidates: animationCandidates.filter((url) => !isUnsupportedAnimationUrl(url)),
    backgroundColor: explicitBgColor,
    backgroundGradient: gradientBg,
    backgroundImageUrl,
    collectionAddress: String(
      firstNonEmptyStringFromPaths(item, [
        "collection.address",
        "nft.collection.address",
        "gift.collection.address",
      ]) || "telegram-gifts",
    ),
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
        if (!merged.imageUrl) {
          merged.imageUrl = mergedImageCandidates[0];
        }
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

      const patchIfMissing = [
        "name",
        "tier",
        "imageUrl",
        "animationUrl",
        "imageCandidates",
        "animationCandidates",
        "backgroundColor",
        "backgroundGradient",
        "backgroundImageUrl",
        "collectionAddress",
      ];
      patchIfMissing.forEach((key) => {
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

async function fetchTelegramProfileGifts(ownerAddress = "") {
  const userId = String(state.currentUser?.id ?? "").trim();
  const ownerWallet = normalizeTonAddress(ownerAddress);

  const injectedItems = extractTelegramGiftItems(window.__UPNFT_TELEGRAM_GIFTS__);
  const injectedUpgraded = injectedItems.filter((item) => isLikelyUpgradedTelegramGift(item));
  let mergedInjected = (injectedUpgraded.length > 0 ? injectedUpgraded : injectedItems)
    .map((item, index) => buildNftModelFromTelegramGift(item, index))
    .filter(Boolean);

  if (!userId) return mergedInjected;

  const endpointCandidates = [];
  const pushEndpoint = (value) => {
    const endpoint = String(value ?? "").trim();
    if (!endpoint) return;
    if (!endpointCandidates.includes(endpoint)) {
      endpointCandidates.push(endpoint);
    }
  };

  pushEndpoint(state.telegramGiftsEndpoint);
  pushEndpoint(TELEGRAM_GIFTS_ENDPOINT);

  const apiBase = String(UPGRADE_API_BASE || "").trim().replace(/\/$/, "");
  if (apiBase) {
    pushEndpoint(`${apiBase}/telegram/gifts`);
    pushEndpoint(`${apiBase}/telegram-gifts`);
    pushEndpoint(`${apiBase}/gifts`);
  }

  pushEndpoint("/api/telegram/gifts");
  pushEndpoint("/api/telegram-gifts");
  pushEndpoint("/api/gifts");

  if (endpointCandidates.length === 0) return mergedInjected;

  const initData = String(window.Telegram?.WebApp?.initData ?? "").trim();
  const headers = {};
  if (initData) {
    headers["X-Telegram-Init-Data"] = initData;
  }

  const requestVariants = [
    {
      scope: "all",
      source: "all",
      includeWallet: true,
      wallet: ownerWallet,
    },
    {
      scope: "profile",
      source: "telegram",
      includeWallet: false,
      wallet: "",
    },
  ];

  if (!ownerWallet) {
    requestVariants.shift();
  }

  const uniqueVariants = requestVariants.filter((variant, index, array) => {
    const key = `${variant.scope}|${variant.source}|${variant.wallet}`;
    return array.findIndex((entry) => `${entry.scope}|${entry.source}|${entry.wallet}` === key) === index;
  });

  for (const endpoint of endpointCandidates) {
    let endpointMerged = [];
    let endpointResponded = false;

    for (const variant of uniqueVariants) {
      let url;
      try {
        url = new URL(endpoint, window.location.href);
      } catch {
        continue;
      }

      url.searchParams.set("user_id", userId);
      if (state.currentUser?.username) {
        url.searchParams.set("username", String(state.currentUser.username).trim());
      }
      if (variant.wallet) {
        url.searchParams.set("wallet", variant.wallet);
        url.searchParams.set("wallet_address", variant.wallet);
      }
      const rawOwnerWallet = String(ownerAddress ?? "").trim();
      if (rawOwnerWallet && rawOwnerWallet !== variant.wallet) {
        url.searchParams.set("wallet_raw", rawOwnerWallet);
      }
      if (ownerWallet) {
        url.searchParams.set("connected_wallet", ownerWallet);
      }
      url.searchParams.set("upgraded_only", "1");
      url.searchParams.set("include_upgraded", "1");
      url.searchParams.set("include_profile", "1");
      url.searchParams.set("include_wallet", variant.includeWallet ? "1" : "0");
      url.searchParams.set("scope", variant.scope);
      url.searchParams.set("source", variant.source);

      const payload = await fetchJsonWithTimeout(
        url.toString(),
        12000,
        Object.keys(headers).length ? { headers } : null,
      );
      if (!payload) continue;
      endpointResponded = true;

      const items = extractTelegramGiftItems(payload);
      const upgradedItems = items.filter((entry) => isLikelyUpgradedTelegramGift(entry));
      const sourceItems = upgradedItems.length > 0 ? upgradedItems : items;
      const models = sourceItems
        .map((entry, index) => buildNftModelFromTelegramGift(entry, index))
        .filter(Boolean);
      endpointMerged = mergeUniqueNfts(endpointMerged, models);
    }

    if (!endpointResponded) continue;
    state.telegramGiftsEndpoint = endpoint;

    if (endpointMerged.length > 0) {
      return mergeUniqueNfts(mergedInjected, endpointMerged);
    }
  }

  return mergedInjected;
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
      let payload = await fetchJsonWithTimeout(url, 12000);
      if (!payload) {
        payload = await fetchJsonWithTimeout(url, 12000);
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

  // Try multiple TonAPI ownership modes because behavior differs across wallets.
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

  // Fail-open for UI: if TonAPI is temporarily unavailable,
  // keep inventory flow alive so Telegram gifts can still render.
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
    );
    if (!profileItem) return;

    const taggedProfile = { ...profileItem, source: sourceTag };
    profileInventory.push(taggedProfile);

    if (Number.isFinite(resolvedValue) && resolvedValue > 0) {
      inventory.push({ ...taggedProfile, value: resolvedValue, source: sourceTag });
    }
  });

  return { profileInventory, inventory };
}

async function fetchBankWalletTargets(chain = "") {
  const bankAddress = String(BANK_WALLET_ADDRESS || "").trim();
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

function normalizeBackendNft(rawNft, fallbackTarget = null) {
  const raw = rawNft && typeof rawNft === "object" ? rawNft : {};
  const fallback = fallbackTarget && typeof fallbackTarget === "object" ? fallbackTarget : {};

  const name = String(raw.name ?? raw.title ?? fallback.name ?? "").trim();
  const value = toNumber(raw.value ?? raw.price ?? fallback.value, NaN);
  const animationCandidates = normalizeMediaCandidateList(
    raw.animationCandidates,
    raw.animation_candidates,
    raw.animationUrl,
    raw.animation_url,
    raw.videoUrl,
    raw.video_url,
    raw.preview_video_url,
    raw.previewVideoUrl,
    raw.gif_url,
    raw.gifUrl,
    raw.animation,
    raw.video,
    raw.gif,
    raw.media,
    raw.preview,
    fallback.animationCandidates,
    fallback.animationUrl,
  ).filter((url) => !isUnsupportedAnimationUrl(url));
  const animationUrl = animationCandidates[0] || "";

  if (!name || !Number.isFinite(value) || value < 0) return null;

  const imageCandidates = normalizeMediaCandidateList(
    raw.imageCandidates,
    raw.image_candidates,
    raw.imageUrl,
    raw.image_url,
    raw.image,
    raw.photo_url,
    raw.photoUrl,
    raw.preview,
    raw.preview_url,
    raw.previewUrl,
    raw.thumbnail_url,
    raw.thumbnailUrl,
    raw.poster,
    raw.media,
    fallback.imageCandidates,
    fallback.imageUrl,
  );
  const imageUrl = imageCandidates[0] || "";

  return {
    id: String(raw.id ?? fallback.id ?? `reward-${Date.now()}`),
    name,
    tier: String(raw.tier ?? raw.rarity ?? fallback.tier ?? "Unknown"),
    value,
    imageUrl,
    imageCandidates,
    animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
    animationCandidates,
    backgroundColor: normalizeColorValue(
      raw.backgroundColor
      ?? raw.background_color
      ?? fallback.backgroundColor
      ?? "",
    ),
    backgroundImageUrl: normalizeMediaUrl(firstNonEmptyString(
      raw.backgroundImageUrl,
      raw.background_image,
      raw.patternUrl,
      raw.pattern_url,
      fallback.backgroundImageUrl,
    )),
    collectionAddress: String(raw.collectionAddress ?? raw.collection_address ?? fallback.collectionAddress ?? "").trim(),
    listed: Boolean(raw.listed ?? fallback.listed),
    source: String(raw.source ?? "bank"),
  };
}

async function postUpgradeApi(path, payload) {
  const base = String(UPGRADE_API_BASE || "").trim().replace(/\/$/, "");
  if (!base) return null;

  const initData = String(window.Telegram?.WebApp?.initData ?? "").trim();
  const headers = {
    "Content-Type": "application/json",
  };
  if (initData) {
    headers["X-Telegram-Init-Data"] = initData;
  }

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  return fetchJsonWithTimeout(
    url,
    20000,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload || {}),
    },
  );
}

function sleepMs(durationMs) {
  const timeoutMs = Math.max(0, Math.floor(toNumber(durationMs, 0)));
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });
}

function parseUpgradeQueueState(payload) {
  const queue = payload?.queue && typeof payload.queue === "object" ? payload.queue : {};
  const status = String(payload?.status ?? queue.status ?? "").trim().toLowerCase();
  const queued = (
    payload?.queued === true
    || payload?.pending === true
    || queue.queued === true
    || queue.pending === true
    || ["queued", "pending", "enqueued", "waiting", "wait"].includes(status)
  );
  const retryAfterMsRaw = toNumber(
    payload?.retry_after_ms
    ?? payload?.retryAfterMs
    ?? queue.retry_after_ms
    ?? queue.retryAfterMs
    ?? payload?.poll_after_ms
    ?? payload?.pollAfterMs,
    NaN,
  );
  const etaMsRaw = toNumber(
    payload?.eta_ms
    ?? payload?.etaMs
    ?? payload?.wait_ms
    ?? payload?.waitMs
    ?? queue.eta_ms
    ?? queue.etaMs,
    NaN,
  );
  const positionRaw = toNumber(
    payload?.queue_position
    ?? payload?.queuePosition
    ?? queue.position
    ?? queue.queue_position,
    NaN,
  );
  return {
    queued,
    status,
    retryAfterMs: Number.isFinite(retryAfterMsRaw) ? Math.max(0, retryAfterMsRaw) : NaN,
    etaMs: Number.isFinite(etaMsRaw) ? Math.max(0, etaMsRaw) : NaN,
    position: Number.isFinite(positionRaw) ? Math.max(0, Math.floor(positionRaw)) : NaN,
  };
}

async function waitForPreparedUpgrade(preparePayload, onQueueUpdate = null) {
  const startedAt = nowMs();
  const deadline = startedAt + UPGRADE_QUEUE_MAX_WAIT_MS;

  while (true) {
    const prepared = await postUpgradeApi("/upgrade/prepare", preparePayload);
    if (!prepared || prepared.ok === false) {
      throw createUpgradeError("security_prepare_failed", "Security: prepare failed");
    }

    const queueState = parseUpgradeQueueState(prepared);
    if (!queueState.queued) {
      if (typeof onQueueUpdate === "function") {
        onQueueUpdate({
          queued: false,
          waitMs: 0,
          retryAfterMs: 0,
          position: NaN,
        });
      }
      return prepared;
    }

    const remainingMs = deadline - nowMs();
    if (remainingMs <= 0) {
      throw createUpgradeError("queue_timeout", "Queue timeout");
    }

    const waitHint = Number.isFinite(queueState.retryAfterMs)
      ? queueState.retryAfterMs
      : (Number.isFinite(queueState.etaMs) ? queueState.etaMs : UPGRADE_QUEUE_POLL_MS);
    const waitMs = clamp(Math.floor(waitHint), 450, Math.min(5000, remainingMs));

    if (typeof onQueueUpdate === "function") {
      onQueueUpdate({
        queued: true,
        waitMs,
        retryAfterMs: queueState.retryAfterMs,
        etaMs: queueState.etaMs,
        position: queueState.position,
        remainingMs,
      });
    }

    await sleepMs(waitMs);
  }
}

async function sendWalletTransactionWithTimeout(txRequest, timeoutMs = UPGRADE_OFFER_TTL_MS) {
  if (!state.tonConnectUI?.sendTransaction) {
    throw createUpgradeError("security_wallet_transport", "Security: wallet transport unavailable");
  }

  const safeTimeoutMs = clamp(Math.floor(toNumber(timeoutMs, UPGRADE_OFFER_TTL_MS)), 5000, 180000);
  let timeoutId = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(createUpgradeError("offer_timeout", "Offer timeout"));
    }, safeTimeoutMs);
  });

  try {
    return await Promise.race([
      state.tonConnectUI.sendTransaction(txRequest),
      timeoutPromise,
    ]);
  } catch (error) {
    const message = String(error?.message || error || "").toLowerCase();
    if (normalizeUpgradeErrorCode(error) === "offer_timeout") {
      throw error;
    }
    if (
      message.includes("reject")
      || message.includes("decline")
      || message.includes("cancel")
      || message.includes("denied")
      || message.includes("closed")
    ) {
      throw createUpgradeError("offer_rejected", "Offer rejected");
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

async function reportUpgradeAbort(sessionId, requestId, reasonCode = "client_abort") {
  const safeSessionId = String(sessionId || "").trim();
  if (!safeSessionId || !UPGRADE_API_BASE) return;
  await postUpgradeApi("/upgrade/abort", {
    session_id: safeSessionId,
    client_request_id: String(requestId || "").trim(),
    reason: String(reasonCode || "client_abort"),
  });
}

async function resolveUpgradeViaBackend({ source, target, chance, onQueueUpdate = null }) {
  if (!UPGRADE_API_BASE) return null;
  if (!state.tonAddress) {
    throw createUpgradeError("security_wallet_required", "Security: wallet is required");
  }
  const maxTargetValue = getMaxTargetValueForSource(source);
  if (!isTargetWithinUpgradeLimit(source, target)) {
    const limitError = createUpgradeError("target_limit", "Target above allowed cap");
    limitError.maxTargetValue = maxTargetValue;
    throw limitError;
  }

  const requestId = createClientRequestId();
  const sourceIds = safeArray(source?.sourceIds).map((id) => String(id ?? "").trim()).filter(Boolean);
  const primarySourceId = sourceIds[0] || source?.id || "";
  const binding = {
    requestId,
    sourceId: primarySourceId,
    targetId: target?.id ?? "",
    wallet: state.tonAddress,
    userId: state.currentUser?.id ?? "",
  };

  const preparePayload = {
    user_id: state.currentUser?.id ?? null,
    username: state.currentUser?.username ?? "",
    wallet: state.tonAddress || "",
    client_request_id: requestId,
    source_nft_id: primarySourceId,
    source_nft_ids: sourceIds,
    source_bundle_size: sourceIds.length || 1,
    target_nft_id: target?.id ?? "",
    source_value: toNumber(source?.value, 0),
    target_value: toNumber(target?.value, 0),
    chance: toNumber(chance, 0),
    limits: {
      max_target_value: maxTargetValue,
      max_target_multiplier: UPGRADE_MAX_TARGET_MULTIPLIER,
      max_target_offset: UPGRADE_MAX_TARGET_OFFSET,
    },
    bank_wallet: BANK_WALLET_ADDRESS,
    settlement: {
      stake_offer_required: true,
      stake_escrow_mode: "temporary",
      stake_to_bank_always: true,
      win_stake_disposition: "convert_to_ton_for_bank",
      win_reward_mode: "nft_offer",
      win_reward_fallback_mode: "ton_payout_if_nft_unavailable",
      lose_stake_disposition: "bank_in_kind_nft",
      reward_offer_required: true,
    },
    security: {
      strict: true,
      fail_closed: true,
    },
    queue: {
      enabled: true,
      mode: "fifo",
      max_wait_ms: UPGRADE_QUEUE_MAX_WAIT_MS,
      poll_ms: UPGRADE_QUEUE_POLL_MS,
      offer_timeout_ms: UPGRADE_OFFER_TTL_MS,
      serialize_per_wallet: true,
      serialize_per_user: true,
      max_parallel_per_wallet: 1,
    },
    rate_limit: {
      min_interval_ms: UPGRADE_COOLDOWN_MS,
      max_parallel: 1,
    },
  };

  let sessionId = "";
  try {
    const prepared = await waitForPreparedUpgrade(preparePayload, onQueueUpdate);

    sessionId = String(prepared?.session_id ?? prepared?.sessionId ?? "").trim();
    if (!sessionId) {
      throw createUpgradeError("security_missing_session", "Security: missing session_id");
    }

    assertUpgradePayloadBinding(prepared, {
      ...binding,
      sessionId,
    });

    const txRequest = prepared?.tx ?? prepared?.escrow?.tx ?? null;
    if (!txRequest) {
      throw createUpgradeError("security_missing_stake_tx", "Security: missing stake transaction");
    }
    await sendWalletTransactionWithTimeout(txRequest, UPGRADE_OFFER_TTL_MS);

    const payload = await postUpgradeApi("/upgrade/resolve", {
      session_id: sessionId,
      client_request_id: requestId,
    });
    if (!payload || payload.ok === false) {
      throw createUpgradeError("security_resolve_failed", "Security: resolve failed");
    }

    assertUpgradePayloadBinding(payload, {
      ...binding,
      sessionId,
    });

    const rewardOfferTx = payload?.reward_offer_tx ?? payload?.rewardOfferTx ?? null;
    if (rewardOfferTx) {
      await sendWalletTransactionWithTimeout(rewardOfferTx, UPGRADE_OFFER_TTL_MS);
    }

    if (typeof payload.success !== "boolean") {
      throw createUpgradeError("security_invalid_success", "Security: invalid success flag");
    }
    const success = payload.success;
    const targetAngleRaw = toNumber(payload.target_angle ?? payload.targetAngle, NaN);
    const targetAngle = Number.isFinite(targetAngleRaw)
      ? targetAngleRaw
      : (success ? randomBetween(6, Math.max(8, chance - 1.2)) : randomBetween(Math.min(97, chance + 1.2), 99.4)) * 3.6;

    const rewardModeRaw = String(payload.reward_mode ?? payload.rewardMode ?? "").trim().toLowerCase();
    const payoutTon = toNumber(payload.payout_ton ?? payload.payoutTon, NaN);
    const rewardMode = rewardModeRaw || ((success && Number.isFinite(payoutTon) && payoutTon > 0) ? "ton" : "nft");

    const rewardNft = normalizeBackendNft(
      payload.reward_nft
      ?? payload.rewardNft
      ?? payload.target_nft
      ?? payload.targetNft,
      target,
    );

    if (success && rewardMode === "nft" && !rewardNft) {
      throw createUpgradeError("security_missing_reward", "Security: missing reward NFT on WIN");
    }
    if (success && rewardMode === "ton" && !(Number.isFinite(payoutTon) && payoutTon > 0)) {
      throw createUpgradeError("security_invalid_payout", "Security: invalid TON payout on WIN");
    }

    return {
      success,
      targetAngle,
      rewardMode,
      payoutTon,
      targetNft: rewardNft || target,
      commitment: String(payload.commitment ?? state.fair.commitment ?? ""),
      serverSeed: String(payload.server_seed ?? payload.serverSeed ?? state.fair.serverSeed ?? ""),
      digest: String(payload.digest ?? payload.hash ?? ""),
      nonce: toNumber(payload.nonce, state.fair.nonce),
    };
  } catch (error) {
    const errorCode = normalizeUpgradeErrorCode(error);
    if (sessionId && ["offer_timeout", "offer_rejected", "security"].includes(errorCode)) {
      await reportUpgradeAbort(sessionId, requestId, errorCode);
    }
    throw error;
  }
}

async function fetchWalletMarketData(address, chain = "") {
  const ownerAddress = normalizeTonAddress(address);
  if (!ownerAddress) {
    return {
      profileInventory: [],
      inventory: [],
      targets: [],
    };
  }

  const ownItems = await fetchAccountNftItems(ownerAddress, chain);
  const uniqueCollections = Array.from(
    new Set(
      ownItems
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

  const telegramGifts = await fetchTelegramProfileGifts(ownerAddress);
  const profileMerged = mergeUniqueNfts(profileInventory, telegramGifts);
  const pricedTelegramGifts = telegramGifts.filter((item) => Number.isFinite(item.value) && item.value > 0);
  const inventoryMerged = mergeUniqueNfts(inventory, pricedTelegramGifts);

  const targets = Array.from(targetMap.values())
    .filter((item) => Number.isFinite(item.value) && item.value > 0)
    .sort((left, right) => left.value - right.value)
    .slice(0, MAX_TARGETS);

  return {
    profileInventory: profileMerged,
    inventory: inventoryMerged,
    targets,
  };
}

async function fetchTelegramOnlyMarketData() {
  const telegramGifts = await fetchTelegramProfileGifts("");
  if (!telegramGifts.length) {
    return {
      profileInventory: [],
      inventory: [],
    };
  }

  const pricedTelegramGifts = telegramGifts.filter((item) => Number.isFinite(item.value) && item.value > 0);
  return {
    profileInventory: telegramGifts,
    inventory: pricedTelegramGifts,
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
      const animationCandidates = normalizeMediaCandidateList(
        item?.animationCandidates,
        item?.animation_candidates,
        item?.animationUrl,
        item?.animation_url,
        item?.videoUrl,
        item?.video_url,
        item?.preview_video_url,
        item?.previewVideoUrl,
        item?.gif_url,
        item?.gifUrl,
        item?.animation,
        item?.video,
        item?.gif,
        item?.media,
        item?.preview,
      ).filter((url) => !isUnsupportedAnimationUrl(url));
      const animationUrl = animationCandidates[0] || "";

      if (!name || !Number.isFinite(value) || value < 0) {
        return null;
      }

      const imageCandidates = normalizeMediaCandidateList(
        item?.imageCandidates,
        item?.image_candidates,
        item?.imageUrl,
        item?.image_url,
        item?.image,
        item?.photo_url,
        item?.photoUrl,
        item?.preview,
        item?.preview_url,
        item?.previewUrl,
        item?.thumbnail_url,
        item?.thumbnailUrl,
        item?.poster,
        item?.media,
      );
      const imageUrl = imageCandidates[0] || "";

      return {
        id: String(item?.id ?? `${prefix}-${index + 1}`),
        name,
        tier: String(item?.tier ?? "Unknown"),
        value,
        imageUrl,
        imageCandidates,
        animationUrl: !isUnsupportedAnimationUrl(animationUrl) ? animationUrl : "",
        animationCandidates,
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
        source: String(item?.source ?? "").trim() || "wallet",
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

function getSelectedOwnItems() {
  const selected = new Set(safeArray(state.selectedOwnIds).map((id) => String(id).trim()).filter(Boolean));
  return state.data.inventory.filter((item) => selected.has(String(item?.id ?? "").trim()));
}

function getSelectedSourceAggregate() {
  const selectedItems = getSelectedOwnItems();
  if (selectedItems.length === 0) return null;

  const totalValue = selectedItems.reduce((sum, item) => {
    const value = toNumber(item?.value, 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
  const topTierItem = selectedItems.reduce((best, item) => {
    if (!best) return item;
    const currentWeight = toNumber(tierWeight[item?.tier], 1);
    const bestWeight = toNumber(tierWeight[best?.tier], 1);
    return currentWeight > bestWeight ? item : best;
  }, null);

  return {
    id: selectedItems[0]?.id ?? "",
    sourceIds: selectedItems.map((item) => item.id),
    name: selectedItems.length === 1 ? selectedItems[0].name : `${selectedItems.length} NFT`,
    value: totalValue,
    tier: topTierItem?.tier || selectedItems[0]?.tier || "Common",
    items: selectedItems,
  };
}

function ensureSelectedIds() {
  const inventoryIds = new Set(state.data.inventory.map((item) => String(item.id)));
  state.selectedOwnIds = safeArray(state.selectedOwnIds)
    .map((id) => String(id ?? "").trim())
    .filter((id) => inventoryIds.has(id))
    .slice(0, MAX_UPGRADE_SOURCE_NFTS);
  state.selectedOwnId = state.selectedOwnIds[0] ?? null;

  if (state.selectedOwnIds.length === 0) {
    state.selectedTargetId = null;
    if (state.upgradeStep === UPGRADE_STEP_TARGET) {
      state.upgradeStep = UPGRADE_STEP_SOURCE;
    }
    return;
  }

  const source = getSelectedSourceAggregate();
  const eligibleTargets = getEligibleTargetsForSource(source, state.data.targets);
  if (!byId(eligibleTargets, state.selectedTargetId)) {
    state.selectedTargetId = eligibleTargets[0]?.id ?? null;
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
    scheduleLayoutAnchors();
    scheduleNavGlowIndicator();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  state.setTab = setTab;
  const defaultTab = document.querySelector(".nav-btn.is-active")?.dataset.tab || "upgrades";
  setTab(defaultTab);
  scheduleNavGlowIndicator();
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

function resolveNftMediaSpec(nft) {
  const animationCandidates = normalizeMediaCandidateList(
    nft?.animationCandidates,
    nft?.animationUrl,
  ).filter((url) => !isUnsupportedAnimationUrl(url));

  const imageCandidates = normalizeMediaCandidateList(
    nft?.imageCandidates,
    nft?.imageUrl,
  );

  const animationUrl = animationCandidates[0] || "";
  const imageUrl = imageCandidates[0] || "";
  return {
    animationUrl,
    animationCandidates,
    imageUrl,
    imageCandidates,
  };
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

function createNftImageMediaNode(mediaUrls, nftName) {
  const candidates = normalizeMediaCandidateList(mediaUrls);
  if (candidates.length === 0) return null;

  const img = document.createElement("img");
  img.className = "nft-media";
  img.alt = nftName || "NFT";
  img.loading = "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";

  let index = 0;
  const applyCandidate = (nextIndex) => {
    index = nextIndex;
    img.src = candidates[index];
  };

  img.addEventListener("error", () => {
    if (index + 1 >= candidates.length) {
      img.dispatchEvent(new CustomEvent("nft:image-exhausted"));
      return;
    }
    applyCandidate(index + 1);
  });

  applyCandidate(0);
  return img;
}

function createNftVideoMediaNode(mediaUrls, posterUrls = []) {
  const videoCandidates = normalizeMediaCandidateList(mediaUrls)
    .filter((url) => !isLikelyImageAnimationUrl(url));
  if (videoCandidates.length === 0) return null;

  const posterCandidates = normalizeMediaCandidateList(posterUrls);
  const video = document.createElement("video");
  video.className = "nft-media is-video";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("aria-hidden", "true");
  video.preload = "auto";

  if (posterCandidates.length > 0) {
    video.poster = posterCandidates[0];
  }

  let index = 0;
  let exhausted = false;
  let stallTimerId = null;
  const clearStallTimer = () => {
    if (stallTimerId) {
      clearTimeout(stallTimerId);
      stallTimerId = null;
    }
  };
  const emitExhausted = () => {
    if (exhausted) return;
    exhausted = true;
    clearStallTimer();
    video.dispatchEvent(new CustomEvent("nft:video-exhausted"));
  };
  const applyCandidate = (nextIndex) => {
    clearStallTimer();
    if (nextIndex >= videoCandidates.length) {
      emitExhausted();
      return;
    }
    index = nextIndex;
    video.src = videoCandidates[index];
    video.load();
  };
  const switchToNext = () => {
    if (exhausted) return;
    applyCandidate(index + 1);
  };

  video.addEventListener("error", switchToNext);
  video.addEventListener("loadeddata", clearStallTimer);
  video.addEventListener("playing", clearStallTimer);
  video.addEventListener("stalled", () => {
    if (exhausted) return;
    clearStallTimer();
    stallTimerId = window.setTimeout(() => {
      switchToNext();
    }, 1500);
  });

  applyCandidate(0);
  return video;
}

function createNftMediaNode(nft) {
  const spec = resolveNftMediaSpec(nft);
  const imageCandidates = spec.imageCandidates;
  const animationCandidates = spec.animationCandidates;
  const videoAnimations = animationCandidates.filter((url) => !isLikelyImageAnimationUrl(url));
  const imageAnimations = animationCandidates.filter((url) => isLikelyImageAnimationUrl(url));
  const nftName = nft?.name || "NFT";

  const staticImageNode = () => createNftImageMediaNode(imageCandidates, nftName);
  const animatedImageNode = () => {
    const image = createNftImageMediaNode(imageAnimations, nftName);
    if (image) image.classList.add("is-animated-image");
    return image;
  };

  if (videoAnimations.length > 0) {
    const video = createNftVideoMediaNode(videoAnimations, imageCandidates);
    if (video) {
      const fallbackToImage = () => {
        if (video.dataset.fallbackApplied === "1") return;
        video.dataset.fallbackApplied = "1";
        const fallbackNode = animatedImageNode() || staticImageNode();
        if (fallbackNode && video.parentNode) {
          video.replaceWith(fallbackNode);
        }
      };

      video.addEventListener("nft:video-exhausted", fallbackToImage, { once: true });
      video.addEventListener("loadeddata", () => {
        video.classList.add("is-ready");
      }, { once: true });

      return { node: video, isAnimated: true };
    }
  }

  if (imageAnimations.length > 0) {
    const animatedImage = animatedImageNode();
    if (animatedImage) {
      animatedImage.addEventListener("nft:image-exhausted", () => {
        if (animatedImage.dataset.fallbackApplied === "1") return;
        animatedImage.dataset.fallbackApplied = "1";
        const fallbackNode = staticImageNode();
        if (fallbackNode && animatedImage.parentNode) {
          animatedImage.replaceWith(fallbackNode);
        }
      }, { once: true });
      return { node: animatedImage, isAnimated: true };
    }
  }

  const image = staticImageNode();
  if (image) {
    return { node: image, isAnimated: false };
  }

  return { node: null, isAnimated: false };
}

function createNftThumb(nft) {
  const thumb = document.createElement("div");
  thumb.className = "nft-thumb";
  if (nft?.source === "telegram") {
    thumb.classList.add("is-telegram");
    if (!nft?.backgroundColor && !nft?.backgroundGradient && !nft?.backgroundImageUrl) {
      thumb.classList.add("is-full-preview");
    }
  }

  if (nft.backgroundColor) {
    thumb.style.setProperty("--nft-bg-color", nft.backgroundColor);
  }
  if (nft.backgroundGradient) {
    thumb.style.setProperty("--nft-bg-gradient", nft.backgroundGradient);
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

  const media = createNftMediaNode(nft);
  if (media?.isAnimated) {
    thumb.classList.add("has-animation");
    const animationBadge = document.createElement("span");
    animationBadge.className = "nft-anim-badge";
    animationBadge.innerHTML = `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 3.2v9.6l8-4.8z" />
      </svg>
      <span>LIVE</span>
    `;
    thumb.append(animationBadge);
  }
  if (media?.node) {
    thumb.append(media.node);
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
  title.title = nft.name;

  const subtitle = document.createElement("p");
  subtitle.className = "nft-subtitle";
  if (nft.listed) {
    subtitle.textContent = t("nft_card_auction_soon");
  } else {
    subtitle.textContent = t("nft_card_owned");
  }

  const meta = document.createElement("div");
  meta.className = "nft-meta";

  const tier = document.createElement("small");
  tier.textContent = String(nft.tier || "NFT").trim() || "NFT";

  const status = document.createElement("span");
  const sourceType = nft.source === "telegram"
    ? "telegram"
    : (nft.source === "bank" ? "bank" : "wallet");
  status.className = `nft-status is-${sourceType}${nft.listed ? " is-listed" : ""}`;
  status.textContent = nft.listed
    ? t("nft_status_for_sale")
    : (nft.source === "telegram"
      ? t("nft_status_telegram")
      : (nft.source === "bank" ? t("nft_status_bank") : t("nft_status_wallet")));

  meta.append(tier, status);
  body.append(title, subtitle, meta);
  return body;
}

function createOwnNftCard(nft, isActive) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `nft-card${isActive ? " is-active" : ""}`;
  card.dataset.id = nft.id;
  card.append(createNftThumb(nft), createNftCardBody(nft));
  if (isActive) {
    const check = document.createElement("span");
    check.className = "nft-checkmark";
    check.innerHTML = `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m3.2 8.4 3 3.1 6.6-6.8" />
      </svg>
    `;
    card.append(check);
  }
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
  const source = getSelectedSourceAggregate();
  const eligibleTargets = getEligibleTargetsForSource(source, state.data.targets);
  list.innerHTML = "";

  const filteredTargets = getFilteredTargets(source);
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
    if (!source) {
      emptyNode.textContent = t("note_pick_source", { count: MAX_UPGRADE_SOURCE_NFTS });
    } else if (state.data.targets.length > 0 && eligibleTargets.length === 0) {
      emptyNode.textContent = formatTargetLimitNote(getMaxTargetValueForSource(source));
    } else if (state.data.targets.length > 0) {
      emptyNode.textContent = t("target_empty_filter");
    } else {
      emptyNode.textContent = t("target_empty_unavailable");
    }
  }
  hideElementById("target-empty", filteredTargets.length > 0);
}

function renderOwnNftCards() {
  ensureSelectedIds();
  const list = document.getElementById("own-nft-list");
  const emptyNode = document.getElementById("own-empty");
  list.innerHTML = "";

  const pricedList = getFilteredOwnNfts();
  const pricedIds = new Set(state.data.inventory.map((item) => item.id));
  let displayList = pricedList;
  let readonlyFallback = false;

  if (displayList.length === 0 && state.data.profileInventory.length > 0) {
    const filteredProfile = filterNfts(state.data.profileInventory, state.ui.ownSearch);
    displayList = sortNfts(filteredProfile, state.ui.ownSort);
    readonlyFallback = true;
  }

  if (readonlyFallback) {
    state.selectedOwnIds = [];
    state.selectedOwnId = null;
  }

  appendInBatches(list, displayList, (nft) => {
    const canUseForUpgrade = pricedIds.has(nft.id);
    const isSelected = canUseForUpgrade && state.selectedOwnIds.includes(nft.id);
    const card = createOwnNftCard(nft, isSelected);

    if (!canUseForUpgrade) {
      card.classList.add("is-readonly");
      return card;
    }

    card.addEventListener("click", () => {
      if (state.isSpinning) return;
      const changed = toggleSelectedSourceNft(nft.id);
      if (!changed) return;
      ensureSelectedIds();
      if (state.upgradeStep === UPGRADE_STEP_TARGET && state.selectedOwnIds.length === 0) {
        state.upgradeStep = UPGRADE_STEP_SOURCE;
      }
      renderOwnNftCards();
      renderTargetChips();
      updateUpgradeStepLayout();
      refreshUpgradeState();
    });
    return card;
  });

  if (emptyNode) {
    if (state.data.profileInventory.length > 0 && state.data.inventory.length === 0) {
      emptyNode.textContent = t("own_empty_no_price");
    } else if ((state.data.inventory.length > 0 || state.data.profileInventory.length > 0) && displayList.length === 0) {
      emptyNode.textContent = t("own_empty_filter");
    } else {
      emptyNode.textContent = t("own_empty_not_loaded");
    }
  }

  hideElementById("own-empty", displayList.length > 0);
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
  updateUpgradeStepLayout();
  clearUpgradeGuardExpired();
  syncUpgradeGuardTicker();

  const source = getSelectedSourceAggregate();
  const target = byId(state.data.targets, state.selectedTargetId);
  const chance = calculateChance(source, target);
  const secureBackendReady = Boolean(UPGRADE_API_BASE);
  const walletReady = Boolean(state.tonAddress);
  const penaltyLeftMs = getUpgradePenaltyRemainingMs();
  const cooldownLeftMs = getUpgradeCooldownRemainingMs();
  const hasGuardBlock = !state.isSpinning && (penaltyLeftMs > 0 || cooldownLeftMs > 0);

  const chanceRing = document.getElementById("chance-ring");
  const note = document.getElementById("math-note");
  const button = document.getElementById("upgrade-btn");
  if (!chanceRing || !note || !button) return;

  button.textContent = getUpgradeButtonLabel();

  if (SECURE_UPGRADE_REQUIRED && !secureBackendReady) {
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 360);
    note.textContent = t("note_secure_backend_required");
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  if (!walletReady) {
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 360);
    note.textContent = t("note_secure_wallet_required");
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  if (!source) {
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 460);
    note.textContent = t("note_pick_source", { count: MAX_UPGRADE_SOURCE_NFTS });
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  if (state.upgradeStep !== UPGRADE_STEP_TARGET) {
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 420);
    note.textContent = t("note_pick_source", { count: MAX_UPGRADE_SOURCE_NFTS });
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  if (!target) {
    const maxTargetValue = getMaxTargetValueForSource(source);
    const hasEligibleTargets = getEligibleTargetsForSource(source, state.data.targets).length > 0;
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 460);
    note.textContent = hasEligibleTargets
      ? t("note_pick_target")
      : formatTargetLimitNote(maxTargetValue);
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  if (!isTargetWithinUpgradeLimit(source, target)) {
    const maxTargetValue = getMaxTargetValueForSource(source);
    chanceRing.classList.add("is-empty");
    animateChanceTo(0, 380);
    note.textContent = formatTargetLimitNote(maxTargetValue);
    button.disabled = true;
    button.textContent = getUpgradeButtonLabel();
    applyChanceOutcomeVisual();
    return;
  }

  chanceRing.classList.remove("is-empty");
  animateChanceTo(chance, state.isSpinning ? 240 : 680);
  if (!state.isSpinning && penaltyLeftMs > 0) {
    note.textContent = t("note_upgrade_penalty", { seconds: Math.max(1, Math.ceil(penaltyLeftMs / 1000)) });
  } else if (!state.isSpinning && cooldownLeftMs > 0) {
    note.textContent = t("note_upgrade_cooldown", { seconds: Math.max(1, Math.ceil(cooldownLeftMs / 1000)) });
  } else {
    note.textContent = `${source.name} -> ${target.name}`;
  }

  button.disabled = state.isSpinning || state.upgradeFlow.waitingQueue || hasGuardBlock;
  button.textContent = getUpgradeButtonLabel();
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

function applyUpgradeResult(success, source, target, landedAngle, chance, resultNode, options = {}) {
  const rewardMode = String(options.rewardMode ?? "nft").trim().toLowerCase();
  const sourceIds = safeArray(source?.sourceIds).length > 0
    ? safeArray(source?.sourceIds)
    : [source?.id];
  const sourceIdSet = new Set(sourceIds.map((id) => String(id ?? "").trim()).filter(Boolean));

  state.data.inventory = state.data.inventory.filter((nft) => !sourceIdSet.has(String(nft?.id ?? "").trim()));
  state.data.profileInventory = state.data.profileInventory.filter((nft) => !sourceIdSet.has(String(nft?.id ?? "").trim()));
  state.data.stats.upgradesTotal += 1;

  if (success && rewardMode !== "ton" && target) {
    state.data.stats.upgradesWon += 1;
    const minted = {
      ...target,
      id: `mint-${Date.now()}`,
    };
    state.data.inventory.unshift(minted);
    state.data.profileInventory.unshift(minted);
    state.data.dropped.unshift(minted);
  } else if (success && rewardMode === "ton") {
    state.data.stats.upgradesWon += 1;
  }

  state.upgradeOutcome = success ? "win" : "lose";
  state.selectedOwnIds = [];
  state.selectedOwnId = null;
  state.selectedTargetId = null;
  state.upgradeStep = UPGRADE_STEP_SOURCE;
  applyChanceOutcomeVisual();
  resultNode.classList.remove("success", "fail", "queued");
  resultNode.textContent = "";
}

function setupUpgradeFlow() {
  const actionButton = document.getElementById("upgrade-btn");
  const result = document.getElementById("upgrade-result");
  if (!actionButton || !result) return;

  actionButton.addEventListener("click", async () => {
    if (state.isSpinning) return;

    const penaltyLeftMs = getUpgradePenaltyRemainingMs();
    if (penaltyLeftMs > 0) {
      result.classList.remove("success", "queued");
      result.classList.add("fail");
      result.textContent = t("result_penalty", { seconds: Math.max(1, Math.ceil(penaltyLeftMs / 1000)) });
      refreshUpgradeState();
      return;
    }

    const cooldownLeftMs = getUpgradeCooldownRemainingMs();
    if (cooldownLeftMs > 0) {
      result.classList.remove("success", "queued");
      result.classList.add("fail");
      result.textContent = t("result_cooldown", { seconds: Math.max(1, Math.ceil(cooldownLeftMs / 1000)) });
      refreshUpgradeState();
      return;
    }

    const source = getSelectedSourceAggregate();
    const target = byId(state.data.targets, state.selectedTargetId);
    if (state.upgradeStep !== UPGRADE_STEP_TARGET) return;
    if (!source || !target) return;
    if (!isTargetWithinUpgradeLimit(source, target)) {
      const maxTargetValue = getMaxTargetValueForSource(source);
      result.classList.remove("success", "queued");
      result.classList.add("fail");
      result.textContent = formatTargetLimitError(maxTargetValue);
      refreshUpgradeState();
      return;
    }

    const chance = calculateChance(source, target);
    armUpgradeCooldown(UPGRADE_COOLDOWN_MS);
    state.isSpinning = true;
    state.upgradeFlow.waitingQueue = false;
    state.upgradeOutcome = null;
    applyChanceOutcomeVisual();

    actionButton.disabled = true;
    actionButton.textContent = getUpgradeButtonLabel();
    result.classList.remove("success", "fail", "queued");
    result.textContent = "";

    try {
      let fairRoll = null;
      if (UPGRADE_API_BASE) {
        fairRoll = await resolveUpgradeViaBackend({
          source,
          target,
          chance,
          onQueueUpdate: (queueState) => {
            state.upgradeFlow.waitingQueue = Boolean(queueState?.queued);
            actionButton.textContent = getUpgradeButtonLabel();

            if (!state.upgradeFlow.waitingQueue) {
              result.classList.remove("queued");
              result.textContent = "";
              return;
            }

            const waitMs = Number.isFinite(toNumber(queueState?.etaMs, NaN))
              ? toNumber(queueState.etaMs, UPGRADE_QUEUE_POLL_MS)
              : toNumber(queueState?.waitMs, UPGRADE_QUEUE_POLL_MS);
            const seconds = Math.max(1, Math.ceil(Math.max(0, waitMs) / 1000));
            const position = toNumber(queueState?.position, NaN);

            result.classList.remove("success", "fail");
            result.classList.add("queued");
            result.textContent = Number.isFinite(position) && position > 0
              ? t("result_queue_wait_pos", { position: Math.floor(position), seconds })
              : t("result_queue_wait", { seconds });
          },
        });
        if (!fairRoll) {
          throw new Error("Upgrade backend rejected or unavailable");
        }
      } else if (!SECURE_UPGRADE_REQUIRED) {
        fairRoll = await getFairRoll(chance);
      } else {
        throw new Error("Security: secure backend required");
      }

      state.upgradeFlow.waitingQueue = false;
      actionButton.textContent = getUpgradeButtonLabel();
      result.classList.remove("queued");
      result.textContent = "";

      const spinResult = await spinArrowToResult(fairRoll.targetAngle);
      const rewardMode = String(fairRoll.rewardMode ?? "nft").trim().toLowerCase();
      const rewardTarget = rewardMode === "ton" ? null : (fairRoll.targetNft || target);
      applyUpgradeResult(
        fairRoll.success,
        source,
        rewardTarget,
        spinResult.landed,
        chance,
        result,
        { rewardMode },
      );
      recordAnalytics("upgradeAttempts");

      const payoutTon = toNumber(fairRoll.payoutTon, NaN);
      const targetName = rewardMode === "ton" && fairRoll.success
        ? `${t("payout_ton_label")} ${Number.isFinite(payoutTon) ? formatTon(payoutTon) : ""}`.trim()
        : (rewardTarget?.name || target.name);

      pushHistoryEntry({
        id: `h-${Date.now()}`,
        at: nowMs(),
        success: fairRoll.success,
        chance,
        landed: spinResult.landed,
        sourceName: source.name,
        targetName,
        commitment: fairRoll.commitment || state.fair.commitment,
        serverSeed: fairRoll.serverSeed || state.fair.serverSeed,
        digest: fairRoll.digest || "",
        nonce: toNumber(fairRoll.nonce, state.fair.nonce),
      });

      if (fairRoll.success) {
        recordAnalytics("upgradeWins");
      } else {
        recordAnalytics("upgradeLosses");
      }

      if (!UPGRADE_API_BASE && !SECURE_UPGRADE_REQUIRED) {
        await rotateFairState();
      }
    } catch (error) {
      console.error("Upgrade flow error:", error);
      const errorCode = normalizeUpgradeErrorCode(error);
      if (errorCode === "offer_timeout" || errorCode === "offer_rejected") {
        armUpgradePenalty(UPGRADE_DECLINE_PENALTY_MS);
      }

      state.upgradeOutcome = null;
      applyChanceOutcomeVisual();
      result.classList.remove("success", "fail", "queued");
      result.classList.add("fail");
      result.textContent = getUpgradeErrorMessage(error);
    } finally {
      state.upgradeFlow.waitingQueue = false;
      state.isSpinning = false;
      actionButton.textContent = getUpgradeButtonLabel();
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
  scheduleLayoutAnchors();
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
  const walletMenu = document.getElementById("wallet-menu");
  const walletDisconnect = document.getElementById("wallet-disconnect-btn");
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

  const closeWalletMenu = () => {
    if (!walletMenu) return;
    walletMenu.classList.add("hidden");
    walletBubble?.setAttribute("aria-expanded", "false");
  };

  const toggleWalletMenu = () => {
    if (!walletMenu || walletBubble?.classList.contains("hidden")) return;
    const open = walletMenu.classList.contains("hidden");
    walletMenu.classList.toggle("hidden", !open);
    walletBubble?.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) scheduleLayoutAnchors();
  };

  const setBubbleState = (connected) => {
    walletBubble.classList.toggle("hidden", !connected);
    appShell.classList.toggle("has-wallet", connected);
    if (!connected) closeWalletMenu();
    scheduleLayoutAnchors();
  };

  const refreshWalletLocale = () => {
    setWalletButtonText(t(state.walletUi.buttonKey || "wallet_connect"));
    walletShort.textContent = t(state.walletUi.shortKey || "wallet_not_connected", state.walletUi.shortParams || {});
    if (state.walletUi.balanceLoading) {
      walletBubbleBalance.textContent = t("wallet_balance_loading");
    }
    if (walletDisconnect) walletDisconnect.textContent = t("wallet_disconnect");
    if (walletMenu) walletMenu.setAttribute("aria-label", t("wallet_actions_aria"));
    if (walletBubble) walletBubble.setAttribute("aria-label", t("wallet_actions_aria"));
  };

  state.refreshWalletLocale = refreshWalletLocale;

  const loadWalletBalance = async (address, chain = state.tonChain) => {
    const token = ++balanceRequestToken;
    state.walletUi.balanceLoading = true;
    walletBubbleBalance.textContent = t("wallet_balance_loading");
    const balance = await fetchWalletTonBalance(address, chain);
    if (token !== balanceRequestToken) return;
    state.walletUi.balanceLoading = false;
    walletBubbleBalance.textContent = balance !== null ? `${balance} TON` : "-- TON";
  };

  const startBalancePolling = (address, chain = state.tonChain) => {
    stopBalancePolling();
    void loadWalletBalance(address, chain);
    balanceRefreshTimer = window.setInterval(() => {
      void loadWalletBalance(address, chain);
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

  const loadWalletNfts = async (address, chain = state.tonChain) => {
    const token = ++nftRequestToken;
    setWalletShort("wallet_syncing_nft");
    const normalizedChain = normalizeTonChainId(chain);
    const fallbackChain = normalizedChain === TON_CHAIN_TESTNET ? TON_CHAIN_MAINNET : TON_CHAIN_TESTNET;

    let effectiveChain = chain;
    let marketData = await fetchWalletMarketData(address, chain);
    if (token !== nftRequestToken) return null;

    const shouldTryFallback = !marketData
      || (
        safeArray(marketData?.profileInventory).length === 0
        && safeArray(marketData?.inventory).length === 0
      );
    if (shouldTryFallback && fallbackChain && fallbackChain !== normalizedChain) {
      const fallbackData = await fetchWalletMarketData(address, fallbackChain);
      if (token !== nftRequestToken) return null;
      if (fallbackData) {
        if (!marketData) {
          marketData = fallbackData;
          effectiveChain = fallbackChain;
        } else {
          const currentProfile = safeArray(marketData.profileInventory);
          const currentInventory = safeArray(marketData.inventory);
          const currentTargets = safeArray(marketData.targets);
          const nextProfile = safeArray(fallbackData.profileInventory);
          const nextInventory = safeArray(fallbackData.inventory);
          const nextTargets = safeArray(fallbackData.targets);

          marketData = {
            profileInventory: mergeUniqueNfts(currentProfile, nextProfile),
            inventory: mergeUniqueNfts(currentInventory, nextInventory),
            targets: mergeUniqueNfts(currentTargets, nextTargets)
              .filter((item) => Number.isFinite(toNumber(item?.value, NaN)) && toNumber(item?.value, NaN) > 0)
              .sort((left, right) => left.value - right.value)
              .slice(0, MAX_TARGETS),
          };

          if (nextProfile.length > currentProfile.length) {
            effectiveChain = fallbackChain;
          }
        }
      }
    }

    if (!marketData) {
      setWalletShort("wallet_nft_load_error");
      return null;
    }

    let preferredTargets = safeArray(marketData.targets);
    try {
      const bankTargets = await fetchBankWalletTargets(effectiveChain);
      if (token !== nftRequestToken) return null;
      if (bankTargets.length > 0) {
        preferredTargets = bankTargets;
      }
    } catch (error) {
      console.warn("Bank targets loading failed:", error);
    }

    marketData.targets = preferredTargets;
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

  const startNftPolling = (address, chain = state.tonChain) => {
    stopNftPolling();
    void loadWalletNfts(address, chain);
    nftRefreshTimer = window.setInterval(() => {
      void loadWalletNfts(address, chain);
    }, 90000);
  };

  const loadTelegramGiftsOnly = async () => {
    const marketData = await fetchTelegramOnlyMarketData();
    if (!marketData) return;

    let bankTargets = [];
    try {
      bankTargets = await fetchBankWalletTargets(state.tonChain);
    } catch (error) {
      console.warn("Bank targets loading failed:", error);
    }

    state.data.profileInventory = mergeUniqueNfts(state.data.profileInventory, marketData.profileInventory);
    state.data.inventory = mergeUniqueNfts(state.data.inventory, marketData.inventory);
    if (bankTargets.length > 0) {
      state.data.targets = bankTargets;
    }
    ensureSelectedIds();
    renderAll();
  };

  state.refreshTelegramGifts = async () => {
    await loadTelegramGiftsOnly();
  };

  if (!window.TON_CONNECT_UI?.TonConnectUI) {
    setWalletShort("wallet_tonconnect_missing");
    setWalletButtonKey("wallet_connect");
    connectButton.disabled = true;
    setBubbleState(false);
    void loadTelegramGiftsOnly();
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
    await loadWalletBalance(state.tonAddress, state.tonChain);
    await loadWalletNfts(state.tonAddress, state.tonChain);
  };

  const paintConnectionState = (wallet) => {
    const address = wallet?.account?.address || state.tonConnectUI?.account?.address || "";
    const chain = normalizeTonChainId(wallet?.account?.chain || state.tonConnectUI?.wallet?.account?.chain || "");
    const connected = Boolean(address);

    setWalletButtonKey("wallet_connect");
    connectButton.classList.toggle("hidden", connected);
    connectButton.disabled = false;
    setBubbleState(connected);

    if (connected) {
      const isNewConnection = state.tonAddress !== address;
      state.tonAddress = address;
      state.tonChain = chain;
      if (isNewConnection) {
        recordAnalytics("walletConnects");
      }

      setWalletShort("wallet_syncing_nft");
      startBalancePolling(address, chain);
      startNftPolling(address, chain);
    } else {
      state.tonAddress = "";
      state.tonChain = "";
      stopBalancePolling();
      stopNftPolling();
      state.walletUi.balanceLoading = false;
      walletBubbleBalance.textContent = "-- TON";
      setWalletShort("wallet_not_connected");
      void loadAppData().then(() => {
        renderAll();
        void loadTelegramGiftsOnly();
      });
    }
    scheduleLayoutAnchors();
  };

  paintConnectionState(state.tonConnectUI.wallet);

  state.tonConnectUI.onStatusChange(
    (wallet) => paintConnectionState(wallet),
    (error) => console.error("TonConnect status error:", error),
  );

  const refreshOnVisibility = () => {
    if (!state.tonAddress || document.hidden) return;
    void loadWalletBalance(state.tonAddress, state.tonChain);
    void loadWalletNfts(state.tonAddress, state.tonChain);
  };
  document.addEventListener("visibilitychange", refreshOnVisibility);
  window.addEventListener("focus", refreshOnVisibility);

  connectButton.addEventListener("click", async () => {
    try {
      await state.openWalletModal();
    } catch (error) {
      console.error("TonConnect action error:", error);
      setWalletShort("wallet_connect_failed");
    }
  });

  if (walletBubble) {
    walletBubble.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleWalletMenu();
    });

    walletBubble.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleWalletMenu();
    });
  }

  if (walletDisconnect) {
    walletDisconnect.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeWalletMenu();
      if (!state.tonConnectUI) return;
      try {
        await state.tonConnectUI.disconnect();
      } catch (error) {
        console.error("TonConnect disconnect error:", error);
      }
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!walletMenu || walletMenu.classList.contains("hidden")) return;
    if (walletMenu.contains(target) || walletBubble?.contains(target)) return;
    closeWalletMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWalletMenu();
    }
  });

  refreshWalletLocale();
  closeWalletMenu();
  scheduleLayoutAnchors();
}

async function bootstrap() {
  markBootSplashStart();
  try {
    fixMojibakeInDom(document);
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
    scheduleLayoutAnchors();
  } finally {
    await hideBootSplash();
  }
}

bootstrap().catch((error) => {
  console.error("Bootstrap error:", error);
});
