# Dockerfile

# 1. Базовый образ
FROM node:18-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем package-манифест и ставим зависимости
COPY package*.json ./
RUN npm install --production

# 4. Копируем весь код и генерируем Prisma Client
COPY . .
RUN npx prisma generate

# 5. Прогон миграций и запуск приложения
CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]

