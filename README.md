Практика по веб-разработке: HTML/CSS, JavaScript (React/TS), PHP/SQL и Docker.

📁 Структура проекта

- `practice_maximaster/`
  - `shop-site/` — вёрстка сайта на Tailwind CSS
  - `DockerFile`, `nginx.conf` — Docker-настройки фронтенда
- `react-ts-practice/` — задания на JavaScript с использованием React + TypeScript
- `practise_php_sql/` — задания на PHP и SQL:
  - `counter` — счётчик посещений
  - `delivery-calculator` — расчёт стоимости доставки
  - `guestbook` — гостевая книга
  - `rest-api-products` — REST API с документацией через Swagger UI
- `docker-projects/` — сборки и конфигурации для запуска всего через Docker

🚀 Как запускать:

 Вёрстка (Tailwind + Live Server)
В терминале ввести:
```bash
cd practice_maximaster/shop-site
npm install
npm run start
```

JavaScript (с использованием React + TypeScript)
В терминале:
```bash
cd react-ts-practice/react-ts-practice
npm install
npm run dev
```

PHP-приложения (например, REST API)
В терминале:
```bash
cd practise_php_sql/rest-api-products
php -S localhost:8000
```

Docker
В терминале:
```bash
cd docker-projects
docker-compose up –build
```

📌 Примечания
В .gitignore исключены временные файлы и зависимости.
Все проекты можно запустить как локально, так и через Docker.
