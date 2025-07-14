<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (str_starts_with($uri, '/rest-api-products/api')) {
    $_SERVER['REQUEST_URI'] = preg_replace('#^/rest-api-products#', '', $uri);
    require __DIR__ . '/rest-api-products/index.php';
    exit;
}

$file = __DIR__ . $uri;
if ($uri !== '/' && is_file($file)) {
    return false;
}

require __DIR__ . '/index.php';
