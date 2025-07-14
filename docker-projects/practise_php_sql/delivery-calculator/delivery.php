<?php

$cacheFile = 'cities_cache.json';
$debugFile = 'debug.txt';
$username = 'cli';
$password = '12344321';

// ======== ФУНКЦИЯ: CURL С АВТОРИЗАЦИЕЙ И ЛОГОМ ========
function fetchWithAuth($url, $username, $password, $debugFile, $label = 'REQUEST') {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => "$username:$password",
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_FAILONERROR => false,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        file_put_contents($debugFile, "$label — CURL ERROR: $error\n", FILE_APPEND);
    } else {
        file_put_contents($debugFile, "$label — HTTP $http_code\nResponse:\n$response\n\n", FILE_APPEND);
    }

    curl_close($ch);
    return $response;
}

// ======== РЕЖИМ ОТЛАДКИ (ПОСМОТРЕТЬ debug.txt) ========
if (isset($_GET['debug'])) {
    header('Content-Type: text/plain; charset=utf-8');
    echo file_exists($debugFile) ? file_get_contents($debugFile) : "Файл debug.txt не найден";
    exit;
}

// ======== ЗАПРОС СПИСКА ГОРОДОВ ========
if (isset($_GET['action']) && $_GET['action'] === 'get_cities') {
    file_put_contents($debugFile, "ГОРОДА: старт\n", FILE_APPEND);

    if (!file_exists($cacheFile) || date('Y-m-d', filemtime($cacheFile)) !== date('Y-m-d')) {
        file_put_contents($debugFile, "ГОРОДА: обновление кэша...\n", FILE_APPEND);
        $citiesJson = fetchWithAuth(
            'http://exercise.develop.maximaster.ru/service/city/',
            $username,
            $password,
            $debugFile,
            'ГОРОДА: ЗАПРОС'
        );
        file_put_contents($debugFile, "ГОРОДА: получено: $citiesJson\n", FILE_APPEND);

        // Проверка: пришёл ли корректный JSON (а не HTML)
        if ($citiesJson && json_decode($citiesJson)) {
            file_put_contents($cacheFile, $citiesJson);
        } else {
            file_put_contents($debugFile, "ГОРОДА: НЕВАЛИДНЫЙ JSON!\n", FILE_APPEND);
        }
    }

    header('Content-Type: application/json');
    echo file_exists($cacheFile) ? file_get_contents($cacheFile) : '[]';
    exit;
    
}

// ======== РАСЧЁТ СТОИМОСТИ ДОСТАВКИ ========
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $city = $_POST['city'] ?? '';
    $weight = (int) ($_POST['weight'] ?? 0);

    if (!$city || $weight <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Некорректные входные данные."
        ]);
        exit;
    }

    $url = "http://exercise.develop.maximaster.ru/service/delivery/?city=" . urlencode($city) . "&weight=" . $weight;
    $response = fetchWithAuth($url, $username, $password, $debugFile, 'ДОСТАВКА');

    header('Content-Type: application/json');
    echo $response;
    exit;
}
?>
