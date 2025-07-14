<?php
require 'vendor/autoload.php';

use FastRoute\RouteCollector;

header('Content-Type: application/json');

// Создание базы, если её нет
if (!file_exists('db.sqlite')) {
    $db = new PDO('sqlite:db.sqlite');
    $db->exec("
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL
        );
    ");
    echo json_encode(['message' => 'База данных создана'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Роутинг
$dispatcher = FastRoute\simpleDispatcher(function (RouteCollector $r) {
    $r->addRoute('GET', '/api/products', 'getAllProducts');
    $r->addRoute('GET', '/api/products/{id:\d+}', 'getProduct');
    $r->addRoute('POST', '/api/products', 'createProduct');
    $r->addRoute('PUT', '/api/products/{id:\d+}', 'updateProduct');
    $r->addRoute('DELETE', '/api/products/{id:\d+}', 'deleteProduct');
});

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
$db = new PDO('sqlite:db.sqlite');

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Не найдено'], JSON_UNESCAPED_UNICODE);
        break;

    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Метод не разрешён'], JSON_UNESCAPED_UNICODE);
        break;

    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        call_user_func($handler, $db, $vars);
        break;
}

// Обработчики API

function getAllProducts($db) {
    $stmt = $db->query('SELECT * FROM products');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
}

function getProduct($db, $vars) {
    $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$vars['id']]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        echo json_encode($product, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Товар не найден'], JSON_UNESCAPED_UNICODE);
    }
}

function createProduct($db) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Отсутствует имя или цена'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $stmt = $db->prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)');
    $stmt->execute([
        $data['name'],
        $data['description'] ?? '',
        $data['price']
    ]);

    http_response_code(201);
    echo json_encode(['id' => $db->lastInsertId()], JSON_UNESCAPED_UNICODE);
}

function updateProduct($db, $vars) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Отсутствует имя или цена'], JSON_UNESCAPED_UNICODE);
        return;
    }

    $stmt = $db->prepare('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?');
    $stmt->execute([
        $data['name'],
        $data['description'] ?? '',
        $data['price'],
        $vars['id']
    ]);

    echo json_encode(['message' => 'Товар обновлён'], JSON_UNESCAPED_UNICODE);
}

function deleteProduct($db, $vars) {
    $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$vars['id']]);
    echo json_encode(['message' => 'Товар удалён'], JSON_UNESCAPED_UNICODE);
}
