#!/bin/sh

echo "🚀 Starting backend with migrations..."
echo "⏳ Waiting for MySQL to be ready..."

while ! nc -z mysql 3306; do 
  sleep 1
done

echo "✅ MySQL is ready!"
echo "📦 Applying Prisma migrations..."

npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations applied successfully!"
  # Seed отключен - запускается только вручную при необходимости
  # echo "🌱 Running seed data..."
  # npx prisma db seed || echo "⚠️ Seed data already exists or failed"
  echo "🚀 Starting application..."
  npm start
else
  echo "❌ Failed to apply migrations!"
  echo "🔄 Trying to reset database..."
  npx prisma migrate reset --force
  if [ $? -eq 0 ]; then
    echo "✅ Database reset successful!"
    # Seed отключен - запускается только вручную при необходимости
    # echo "🌱 Running seed data..."
    # npx prisma db seed || echo "⚠️ Seed data failed"
    echo "🚀 Starting application..."
    npm start
  else
    echo "❌ Failed to reset database!"
    exit 1
  fi
fi 