<?php
require_once __DIR__ . '/../../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Método não permitido', 405);

$body     = readJsonBody();
$name     = trim($body['name'] ?? '');
$email    = trim(strtolower($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($name === '' || $email === '' || $password === '') {
    jsonError('Preencha nome, e-mail e senha.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('E-mail inválido.');
}
if (strlen($password) < 6) {
    jsonError('A senha deve ter pelo menos 6 caracteres.');
}

$pdo = getDB();

$stmt = $pdo->prepare('SELECT id FROM users WHERE email=?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonError('Este e-mail já está cadastrado.', 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)');
$stmt->execute([$name, $email, $hash]);
$userId = (int) $pdo->lastInsertId();

// Cria configurações padrão
$pdo->prepare('INSERT INTO settings (user_id, daily_goal_hours) VALUES (?, 4)')->execute([$userId]);

$_SESSION['user_id'] = $userId;

jsonResponse(['id' => $userId, 'name' => $name, 'email' => $email], 201);
