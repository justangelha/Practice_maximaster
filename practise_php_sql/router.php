<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Если путь начинается с /rest-api-products/api — проксируем в index.php внутри rest-api-products
if (str_starts_with($uri, '/rest-api-products/api')) {
    // Обрезаем префикс, чтобы FastRoute видел /api/products
    $_SERVER['REQUEST_URI'] = preg_replace('#^/rest-api-products#', '', $uri);
    require __DIR__ . '/rest-api-products/index.php';
    exit;
}

// 2. Если запрашивается существующий файл — отдать как есть
$file = __DIR__ . $uri;
if ($uri !== '/' && is_file($file)) {
    return false;
}

// 3. Иначе — подключаем корневой index.php
require __DIR__ . '/index.php';
