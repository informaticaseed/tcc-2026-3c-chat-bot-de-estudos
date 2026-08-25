<?php
/* ═══════════════════════════════════════════════════════════
   /api/complete.php
   POST { subjectId } → alterna (toggle) a conclusão da matéria
   no dia de hoje. Equivalente a toggleDailyCompletion() do app.js
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/stats.php';
require_once __DIR__ . '/../includes/achievements.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Método não permitido', 405);

$userId    = requireAuth();
$pdo       = getDB();
$body      = readJsonBody();
$subjectId = (int) ($body['subjectId'] ?? 0);

$stmt = $pdo->prepare('SELECT id, name FROM subjects WHERE id=? AND user_id=?');
$stmt->execute([$subjectId, $userId]);
$subject = $stmt->fetch();
if (!$subject) jsonError('Matéria não encontrada.', 404);

$today = date('Y-m-d');

$stmt = $pdo->prepare('SELECT id FROM daily_completions WHERE user_id=? AND day=? AND subject_id=?');
$stmt->execute([$userId, $today, $subjectId]);
$existing = $stmt->fetch();

if ($existing) {
    $pdo->prepare('DELETE FROM daily_completions WHERE id=?')->execute([$existing['id']]);
    $removing = true;
} else {
    $pdo->prepare('INSERT INTO daily_completions (user_id, day, subject_id) VALUES (?,?,?)')
        ->execute([$userId, $today, $subjectId]);
    $removing = false;
}

$countToday = count(getTodayCompletionIds($pdo, $userId, $today));
touchStudyLog($pdo, $userId, $today, 0, $countToday);

if (!$removing) {
    $pdo->prepare('INSERT IGNORE INTO studied_days (user_id, day) VALUES (?,?)')->execute([$userId, $today]);
} else {
    // Se essa era a última conclusão do dia e não há horas registradas,
    // desfaz também a marcação automática do dia como "estudado"
    // (mesma regra já usada em subjects.php ao editar horas).
    $dayStats = getDayStats($pdo, $userId, $today);
    if ($dayStats['hours'] == 0 && $countToday === 0) {
        $pdo->prepare('DELETE FROM studied_days WHERE user_id=? AND day=?')->execute([$userId, $today]);
    }
}

$unlocked = [];
if (!$removing) {
    $unlocked = array_merge(
        checkCalendarAchievements($pdo, $userId),
        checkCompletionAchievements($pdo, $userId, $today)
    );
}

jsonResponse([
    'ok'          => true,
    'removed'     => $removing,
    'todayCount'  => $countToday,
    'subjectName' => $subject['name'],
    'unlocked'    => $unlocked,
]);
