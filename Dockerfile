# Step 1: Используем Node.js как базовый образ для сборки
FROM node:18 AS build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Создаем production билд
RUN npm run build

# Step 2: Используем Nginx как веб-сервер для запуска приложения
FROM nginx:alpine

# Копируем билд React-приложения из предыдущего этапа в папку, которую использует Nginx для статических файлов
COPY --from=build /app/build /usr/share/nginx/html

# Копируем файл конфигурации Nginx, если нужно (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт, на котором будет доступен Nginx
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
