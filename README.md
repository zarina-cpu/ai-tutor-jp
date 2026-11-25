# Ироха

SaaS-репетитор японского на Next.js. Интерфейс на русском, путь JLPT N5–N1.

## Тарифы

- **Free:** 10 минут и 5 новых уроков за учебный день (сброс в полдень, `Asia/Yekaterinburg`), начальный этап N5–N4, кана, квизы, грамматика.
- **Pro:** без лимита, кандзи, speaking, listening, произношение, разбор ошибок, N3–N1. Stripe месяц 12 USD или год 96 USD.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

База — Neon Postgres (`DATABASE_URL` с pooler). Записи произношения — бакет `recordings`. Вход — Neon Auth (`NEON_AUTH_BASE_URL` + `NEON_AUTH_COOKIE_SECRET`). Без cookie-секрета остаётся локальная тетрадь. Репетитор требует `GEMINI_API_KEY`. Оплата — Stripe.

Схема: `node scripts/apply-schema.mjs` (файл `drizzle/0000_init.sql`). Проверка: `GET /api/health/neon`.
