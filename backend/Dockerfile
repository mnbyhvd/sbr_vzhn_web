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

# Удаляем devDependencies, но оставляем ts-node для seed
RUN npm prune --production

# Устанавливаем ts-node для seed данных
RUN npm install ts-node

# Создаем папку для загрузок
RUN mkdir -p uploads

# Копируем entrypoint скрипт
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

# Запускаем через entrypoint скрипт
CMD ["/app/entrypoint.sh"] 