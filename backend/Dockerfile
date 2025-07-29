# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем TypeScript
RUN npm run build

# Создаем папку для загрузок
RUN mkdir -p uploads

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"] 