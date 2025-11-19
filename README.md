# Task Management API

Backend для додатку управління завданнями.

## Технології

- Node.js + Express
- TypeScript
- MongoDB
- nanoid

## Запуск локально

1. Встановіть залежності:
```bash
npm install
```

2. Створіть файл `.env`:
```
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=3000
```

3. Запустіть сервер:
```bash
npm run dev
```

## API Endpoints

### Дошки
- `POST /api/boards` - Створити дошку
- `GET /api/boards/:boardId` - Отримати дошку
- `PUT /api/boards/:boardId` - Оновити дошку
- `DELETE /api/boards/:boardId` - Видалити дошку

### Картки
- `GET /api/cards/board/:boardId` - Отримати всі картки
- `POST /api/cards/board/:boardId` - Створити картку
- `PUT /api/cards/:cardId` - Оновити картку
- `DELETE /api/cards/:cardId` - Видалити картку
- `PATCH /api/cards/:cardId/move` - Перемістити картку
