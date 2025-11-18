# Shopify Ecommerce Template

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/shared-8867s-projects/v0-shopify-ecommerce-template)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/PRfRz1Lck6u)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## 🚀 Deployment на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Предварительные требования

1. Репозиторий на GitHub
2. Node.js 20+ (для локальной разработки)
3. Shopify Store Domain (опционально, по умолчанию используется `v0-template.myshopify.com`)

### Настройка GitHub Pages

1. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в `Settings` → `Pages`
   - В разделе `Source` выберите `GitHub Actions`

2. **Настройте секреты (опционально):**
   - Перейдите в `Settings` → `Secrets and variables` → `Actions`
   - Добавьте секрет `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` с вашим доменом Shopify (например: `your-store.myshopify.com`)
   - Если секрет не указан, будет использован домен по умолчанию

3. **Запустите деплой:**
   - Workflow автоматически запустится при push в ветку `main` или `master`
   - Или запустите вручную через `Actions` → `Deploy to GitHub Pages` → `Run workflow`

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Просмотр production сборки
npm start
```

### Переменные окружения

Создайте файл `.env.local` для локальной разработки:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

**⚠️ Важно:** Файлы `.env*` уже добавлены в `.gitignore` и не будут закоммичены в репозиторий.

### Структура проекта

- `/app` - Next.js App Router страницы и layouts
- `/components` - React компоненты
- `/lib` - Утилиты и конфигурация Shopify API
- `/public` - Статические файлы
- `/.github/workflows` - GitHub Actions workflows

### Важные замечания

1. **Статический экспорт:** Проект настроен на статический экспорт (`output: 'export'`), что необходимо для GitHub Pages
2. **Base Path:** Если вы деплоите в проектную страницу (не `username.github.io`), basePath будет автоматически настроен
3. **Изображения:** Изображения настроены как `unoptimized: true` для совместимости со статическим экспортом
4. **ISR отключен:** Для статического экспорта ISR (Incremental Static Regeneration) не поддерживается, все страницы генерируются на этапе сборки

### Troubleshooting

**Проблема:** Сайт не загружается после деплоя
- Проверьте, что GitHub Pages включен в настройках репозитория
- Убедитесь, что workflow успешно завершился в разделе `Actions`
- Проверьте правильность basePath в `next.config.mjs`

**Проблема:** Изображения не загружаются
- Убедитесь, что домены Shopify добавлены в `remotePatterns` в `next.config.mjs`
- Проверьте CORS настройки на стороне Shopify

**Проблема:** Ошибки сборки
- Проверьте логи в GitHub Actions
- Убедитесь, что все зависимости установлены (`npm ci`)
- Проверьте переменные окружения

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/PRfRz1Lck6u](https://v0.app/chat/projects/PRfRz1Lck6u)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. GitHub Actions автоматически деплоит на GitHub Pages

## License

MIT
