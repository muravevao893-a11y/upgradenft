# UPGRADE NFT Mini App

Мини-апп для Telegram-бота без демо-данных в интерфейсе.

## Что важно

- В проекте нет захардкоженных демо NFT, демо счетов и демо наград.
- UI показывает только реальные данные.
- Если данных нет, отображаются пустые состояния.

## Источник данных

Приложение берет данные так:

1. `window.__UPNFT_DATA__` (если объект внедрен сервером в страницу)
2. `./app-data.json` (если файл существует рядом с `index.html`)
3. иначе пустые состояния

## Формат данных

```json
{
  "tasks": [
    { "id": "t1", "title": "Сделать апгрейд", "reward": "+20 XP", "status": "Активно" }
  ],
  "cases": [
    { "id": "c1", "title": "Black", "risk": "Высокий риск" }
  ],
  "bonuses": [
    { "id": "b1", "title": "Буст к шансу", "value": "+5%" }
  ],
  "inventory": [
    { "id": "n1", "name": "My NFT #1", "tier": "Rare", "value": 3.2 }
  ],
  "targets": [
    { "id": "n2", "name": "Target NFT #7", "tier": "Epic", "value": 7.9 }
  ],
  "dropped": [
    { "id": "n3", "name": "Won NFT #3", "tier": "Epic", "value": 6.5 }
  ],
  "stats": {
    "rank": 12,
    "upgradesTotal": 48,
    "upgradesWon": 29
  }
}
```

## TON Connect

Манифест лежит в `tonconnect-manifest.json`.
Проверь, что URL в нем совпадает с GitHub Pages репозитория.

## Реальные NFT и цены

- После подключения кошелька приложение получает реальные NFT владельца через TON API.
- Для апгрейдов используются только NFT, у которых есть рыночная TON-оценка (листинг или floor коллекции).
- Список обновляется автоматически (баланс и NFT-пуллинг), без демо-объектов в UI.

## Provably Fair

- Для каждого запуска хранится `commitment = SHA-256(serverSeed)`.
- На крутке считается хеш от `serverSeed + clientSeed + nonce`.
- В историю пишутся шанс, nonce и хеши; после крутки seed ротируется.
- Хранилище: `localStorage` ключ `upnft_fair_v1`.

## Локальные ключи состояния

- `upnft_history_v1` — история апгрейдов.
- `upnft_analytics_v1` — счетчики запусков/круток/конверсии.
- `upnft_fair_v1` — состояние честного рандома.

## Прокси/бекенд-роуты (опционально)

Если нужен свой API-шлюз вместо прямых вызовов:

- `window.__UPNFT_TONAPI_BASE__` — базовый URL для TON API (`/v2`).
- `window.__UPNFT_TONCENTER_BASE__` — базовый URL для toncenter (`/api/v2`).

Оба параметра можно задать до загрузки `app.js`.

## Кэш Telegram Mini App

Если Telegram показывает старую версию:

1. Подними версию в query у `styles.css` и `app.js` в `index.html`.
2. Обнови ссылку Mini App в BotFather с параметром `?v=...`.
3. Полностью закрой и снова открой Mini App.
