<?php
// Если запрашивается реальный файл — отдаём его напрямую
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $file = __DIR__ . $path;
    if (is_file($file)) {
        return false;
    }
}

// Иначе — подключаем index.php как роутер
require 'index.php';
