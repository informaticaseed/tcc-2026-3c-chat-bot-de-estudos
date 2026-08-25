<?php
/* ═══════════════════════════════════════════════════════════
   /api/achievements.php
   GET → lista TODAS as conquistas (ALL_ACHIEVEMENTS) com o
   status unlocked/locked de cada uma para o usuário logado.
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/achievements.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Método não permitido', 405);

$userId = requireAuth();
$pdo    = getDB();

$stmt = $pdo->prepare('SELECT achievement_id FROM achievements WHERE user_id=?');
$stmt->execute([$userId]);
$unlockedIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

$result = array_map(function (array $a) use ($unlockedIds) {
    $a['unlocked'] = in_array($a['id'], $unlockedIds, true);
    return $a;
}, ALL_ACHIEVEMENTS);

jsonResponse(['achievements' => $result]);
