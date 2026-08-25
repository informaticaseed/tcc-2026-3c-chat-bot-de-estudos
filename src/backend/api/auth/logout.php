<?php
require_once __DIR__ . '/../../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Método não permitido', 405);

$_SESSION = [];
if (session_status() === PHP_SESSION_ACTIVE) session_destroy();

jsonResponse(['ok' => true]);
