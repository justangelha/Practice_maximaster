<?php
require 'db.php';
date_default_timezone_set('Europe/Moscow');

// Обработка формы
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $message = trim($_POST['message']);

    if (!empty($message)) {
        if (empty($name)) $name = 'Анонимно';
        $stmt = $pdo->prepare("INSERT INTO guestbook (name, message) VALUES (?, ?)");
        $stmt->execute([$name, $message]);
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }
}

$messages = $pdo->query("SELECT * FROM guestbook ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Гостевая книга</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Гостевая книга</h1>
  <p>Напишите что-нибудь!</p>

  <div class="messages">
    <?php foreach ($messages as $msg): ?>
      <div class="message">
        <div class="meta">
          <?= date('d.m.Y H:i', strtotime($msg['created_at'])) ?>
          <span class="name"><?= htmlspecialchars($msg['name']) ?></span>
        </div>
        <div class="text"><?= nl2br(htmlspecialchars($msg['message'])) ?></div>
      </div>
    <?php endforeach; ?>
  </div>

  <form method="post" class="form">
    <input type="text" name="name" placeholder="Имя">
    <textarea name="message" placeholder="Ваше сообщение" required></textarea>
    <button type="submit">Отправить</button>
  </form>
</body>
</html>
