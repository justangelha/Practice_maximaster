<?php
if (strpos($_SERVER['REQUEST_URI'], 'favicon.ico') !== false) {
    http_response_code(204);
    exit;
}

$file = "counter.txt";

$count = 0;
if (file_exists($file)) {
    $raw = file_get_contents($file);
    if (is_numeric($raw)) {
        $count = (int)$raw;
    }
}

$count++;
file_put_contents($file, $count);

date_default_timezone_set('Europe/Moscow');
$time = date("H:i");

echo "Страница была загружена $count раз. Текущее время $time.";
?>
