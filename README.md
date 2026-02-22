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

## Кэш Telegram Mini App

Если Telegram показывает старую версию:

1. Подними версию в query у `styles.css` и `app.js` в `index.html`.
2. Обнови ссылку Mini App в BotFather с параметром `?v=...`.
3. Полностью закрой и снова открой Mini App.
