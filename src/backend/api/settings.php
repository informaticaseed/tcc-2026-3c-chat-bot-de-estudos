<?php
/* ═══════════════════════════════════════════════════════════
   /api/settings.php
   GET  → devolve a meta diária de horas
   POST { goal } → salva nova meta (1-24)
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/../includes/bootstrap.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT daily_goal_hours FROM settings WHERE user_id=?');
    $stmt->execute([$userId]);
    $goal = $stmt->fetchColumn();
    jsonResponse(['goal' => $goal !== false ? (int) $goal : 4]);

} elseif ($method === 'POST') {
    $body = readJsonBody();
    $goal = (int) ($body['goal'] ?? 0);
    if ($goal < 1 || $goal > 24) jsonError('Informe entre 1 e 24 horas.');

    $stmt = $pdo->prepare('
        INSERT INTO settings (user_id, daily_goal_hours) VALUES (?,?)
        ON DUPLICATE KEY UPDATE daily_goal_hours = VALUES(daily_goal_hours)
    ');
    $stmt->execute([$userId, $goal]);

    jsonResponse(['ok' => true, 'goal' => $goal]);

} else {
    jsonError('Método não permitido', 405);
}
