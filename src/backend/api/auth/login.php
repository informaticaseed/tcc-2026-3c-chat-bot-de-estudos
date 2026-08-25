<?php
require_once __DIR__ . '/../../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Método não permitido', 405);

$body     = readJsonBody();
$email    = trim(strtolower($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
    jsonError('Informe e-mail e senha.');
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, name, email, password_hash FROM users WHERE email=?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('E-mail ou senha incorretos.', 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];

jsonResponse(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]);
