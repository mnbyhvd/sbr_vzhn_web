FROM node:18-alpine

# Устанавливаем netcat для проверки доступности MySQL
RUN apk add --no-cache netcat-openbsd

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем все зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем TypeScript
RUN npm run build

# Удаляем devDependencies для уменьшения размера образа
RUN npm prune --production

# Создаем папку для загрузок
RUN mkdir -p uploads

# Делаем скрипт запуска исполняемым
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

# Запускаем через скрипт, который применит миграции
CMD ["./start.sh"] 