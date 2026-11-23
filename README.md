# AlkoHouse (Next.js)

Полная пересборка сайта alkohouse.online: Next.js 15, каталог из `data/catalog.json`, корзина, админка, SEO.

## Локальный запуск

```bash
npm install
npm run migrate:catalog   # при необходимости из data/catalog.seed.json
cp .env.example .env.local
npm run dev
```

## Переменные окружения

См. `.env.example`: `SESSION_SECRET`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`, `TELEGRAM_*`.

## Скрипты

- `npm run build` — продакшен-сборка (147+ SSG-карточек товаров)
- `npm run migrate:catalog` — миграция каталога с категориями и slug
- `npm run build:redirects` — карта 301 из `_legacy_backup`
- `npm run build:seo` — пересборка JSON SEO-блоков главной

## Резервная копия

Старая версия: `_legacy_backup/`, экспорт каталога: `_legacy_backup/catalog-export-*.json`.

## Деплой Vercel

1. Импорт репозитория, Framework Preset: Next.js
2. Env из `.env.example`
3. Подключить Blob store
4. Домен `alkohouse.online`