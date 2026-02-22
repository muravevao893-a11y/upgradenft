# UPGRADE NFT Mini App

Легкий Telegram Mini App для апгрейда NFT: выбираешь свой NFT, выбираешь цель и запускаешь апгрейд.

## Что это

- Мини-апп под Telegram WebApp
- Подключение TON Wallet через TonConnect
- Экран апгрейда, профиль, задания, кейсы и бонусы
- Работа с реальными данными кошелька и backend API

## Быстрый старт

1. Установи зависимости проекта (если нужны для твоего окружения).
2. Запусти любой локальный статический сервер в корне проекта.
3. Открой `index.html` в браузере или в Telegram Mini App через публичный URL.

## Деплой на GitHub Pages

1. Пуш в `main`.
2. В `Settings -> Pages` выбери `Deploy from a branch`, ветку `main`, папку `/ (root)`.
3. Подожди публикацию и открой сайт по ссылке GitHub Pages.

## Минимальная настройка перед продом

- Проверь `tonconnect-manifest.json` (URL должен быть твоего домена).
- Задай backend переменные до загрузки `app.js`:
  - `window.__UPNFT_UPGRADE_API_BASE__`
  - `window.__UPNFT_BANK_WALLET__`
  - `window.__UPNFT_GIFTS_ENDPOINT__`

## Файлы проекта

- `index.html` — структура интерфейса
- `styles.css` — стили
- `app.js` — логика приложения
- `tonconnect-manifest.json` — манифест TonConnect

---

Если после обновления Telegram показывает старую версию, просто увеличь версию в query-параметрах подключаемых файлов (`?v=...`).
