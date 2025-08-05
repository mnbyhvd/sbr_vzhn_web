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
RUN npm prune --production --ignore-scripts

# Создаем папку для загрузок
RUN mkdir -p uploads

# Создаем скрипт для запуска с миграциями
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "🚀 Starting backend with migrations..."' >> /app/entrypoint.sh && \
    echo 'echo "⏳ Waiting for MySQL to be ready..."' >> /app/entrypoint.sh && \
    echo 'while ! nc -z mysql 3306; do sleep 1; done' >> /app/entrypoint.sh && \
    echo 'echo "✅ MySQL is ready!"' >> /app/entrypoint.sh && \
    echo 'echo "📦 Applying Prisma migrations..."' >> /app/entrypoint.sh && \
    echo 'npx prisma migrate deploy' >> /app/entrypoint.sh && \
    echo 'if [ $? -eq 0 ]; then' >> /app/entrypoint.sh && \
    echo '  echo "✅ Migrations applied successfully!"' >> /app/entrypoint.sh && \
    echo '  echo "🌱 Running seed data..."' >> /app/entrypoint.sh && \
    echo '  npx prisma db seed || echo "⚠️ Seed data already exists or failed"' >> /app/entrypoint.sh && \
    echo '  echo "🚀 Starting application..."' >> /app/entrypoint.sh && \
    echo '  npm start' >> /app/entrypoint.sh && \
    echo 'else' >> /app/entrypoint.sh && \
    echo '  echo "❌ Failed to apply migrations!"' >> /app/entrypoint.sh && \
    echo '  echo "🔄 Trying to reset database..."' >> /app/entrypoint.sh && \
    echo '  npx prisma migrate reset --force' >> /app/entrypoint.sh && \
    echo '  if [ $? -eq 0 ]; then' >> /app/entrypoint.sh && \
    echo '    echo "✅ Database reset successful!"' >> /app/entrypoint.sh && \
    echo '    echo "🌱 Running seed data..."' >> /app/entrypoint.sh && \
    echo '    npx prisma db seed || echo "⚠️ Seed data failed"' >> /app/entrypoint.sh && \
    echo '    echo "🚀 Starting application..."' >> /app/entrypoint.sh && \
    echo '    npm start' >> /app/entrypoint.sh && \
    echo '  else' >> /app/entrypoint.sh && \
    echo '    echo "❌ Failed to reset database!"' >> /app/entrypoint.sh && \
    echo '    exit 1' >> /app/entrypoint.sh && \
    echo '  fi' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 3000

# Запускаем через entrypoint скрипт
CMD ["/app/entrypoint.sh"] 