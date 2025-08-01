# 🐬 Миграция с PostgreSQL на MySQL

## ✅ Выполненные изменения

### 1. Обновлена схема Prisma
- Изменен провайдер с `postgresql` на `mysql`
- Удален `directUrl` (не нужен для MySQL)

### 2. Обновлены зависимости
- Заменен `pg` на `mysql2` в `package.json`

### 3. Обновлен docker-compose.yml
- Заменен PostgreSQL на MySQL 8.0
- Обновлены переменные окружения
- Изменен порт с 5432 на 3306

### 4. Обновлены nginx конфигурации
- Добавлены таймауты для стабильности

## 🚀 Пошаговая миграция

### Шаг 1: Остановите текущие контейнеры
```bash
docker-compose down -v
```

### Шаг 2: Создайте .env файл для backend
```bash
# Создайте файл backend/.env
echo 'DATABASE_URL="mysql://sbr_vzhn_user:sbr_vzhn_password@mysql:3306/sbr_vzhn_db"' > backend/.env
echo 'NODE_ENV=production' >> backend/.env
echo 'PORT=3000' >> backend/.env
```

### Шаг 3: Удалите старые миграции
```bash
rm -rf backend/prisma/migrations
```

### Шаг 4: Соберите и запустите MySQL
```bash
# Сборка
docker-compose build

# Запуск только MySQL
docker-compose up -d mysql

# Ждем запуска MySQL (15 секунд)
sleep 15
```

### Шаг 5: Создайте новую миграцию
```bash
# Временно измените DATABASE_URL для локальной разработки
echo 'DATABASE_URL="mysql://sbr_vzhn_user:sbr_vzhn_password@localhost:3306/sbr_vzhn_db"' > backend/.env

# Создайте миграцию
cd backend
npx prisma migrate dev --name init_mysql

# Верните обратно для Docker
echo 'DATABASE_URL="mysql://sbr_vzhn_user:sbr_vzhn_password@mysql:3306/sbr_vzhn_db"' > .env
```

### Шаг 6: Запустите все сервисы
```bash
cd ..
docker-compose up -d
```

### Шаг 7: Примените миграции
```bash
docker-compose exec backend npx prisma migrate deploy
```

## 🔧 Альтернативный способ (автоматический)

Используйте созданный скрипт:
```bash
chmod +x setup-mysql.sh
./setup-mysql.sh
```

## 📊 Проверка работы

### Проверьте статус контейнеров:
```bash
docker-compose ps
```

### Проверьте логи:
```bash
docker-compose logs -f mysql
docker-compose logs -f backend
```

### Проверьте подключение к БД:
```bash
docker-compose exec mysql mysql -u sbr_vzhn_user -p sbr_vzhn_db
# Пароль: sbr_vzhn_password
```

## 🌐 Доступные адреса

- **Frontend**: http://localhost
- **Admin панель**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

## 🆘 Решение проблем

### Проблема: "Access denied for user"
```bash
# Проверьте переменные окружения
docker-compose exec mysql mysql -u root -p
# Пароль: root_password

# Создайте пользователя вручную
CREATE USER 'sbr_vzhn_user'@'%' IDENTIFIED BY 'sbr_vzhn_password';
GRANT ALL PRIVILEGES ON sbr_vzhn_db.* TO 'sbr_vzhn_user'@'%';
FLUSH PRIVILEGES;
```

### Проблема: "Connection refused"
```bash
# Проверьте, что MySQL запущен
docker-compose logs mysql

# Перезапустите MySQL
docker-compose restart mysql
```

### Проблема: "Migration failed"
```bash
# Сбросьте базу данных
docker-compose down -v
docker-compose up -d mysql
sleep 15
docker-compose exec backend npx prisma migrate reset --force
```

## 📝 Основные отличия MySQL от PostgreSQL

1. **Синтаксис**: MySQL использует `mysql://` вместо `postgresql://`
2. **Порт**: 3306 вместо 5432
3. **Аутентификация**: `mysql_native_password` для совместимости
4. **Переменные окружения**: `MYSQL_*` вместо `POSTGRES_*`

## ✅ Проверочный список

- [ ] Контейнеры остановлены
- [ ] .env файл создан с MySQL URL
- [ ] Старые миграции удалены
- [ ] MySQL контейнер запущен
- [ ] Новая миграция создана
- [ ] Все сервисы запущены
- [ ] Миграции применены
- [ ] Сайт работает по адресу http://localhost
- [ ] Admin панель работает по адресу http://localhost:8080

Если все пункты отмечены ✅, миграция на MySQL завершена успешно! 🎉 