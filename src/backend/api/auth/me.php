<?php
require_once __DIR__ . '/../../includes/bootstrap.php';

if (empty($_SESSION['user_id'])) {
    jsonResponse(['user' => null]);
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id=?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    unset($_SESSION['user_id']);
    jsonResponse(['user' => null]);
}

jsonResponse(['user' => $user]);
