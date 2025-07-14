<?php
try {
    $pdo = new PDO("sqlite:guestbook.sqlite");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Создаём таблицу, если её ещё нет
    $pdo->exec("CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT 'Анонимно',
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    die("Ошибка подключения к SQLite: " . $e->getMessage());
}
?>
