<?php
/* ═══════════════════════════════════════════════════════════
   /api/subjects.php
   GET    → lista matérias com horas/progresso calculados
   POST   → cria matéria            { name, targetHours, days, color }
   PUT    → registra horas do mês   { id, monthHours }
   DELETE ?id=123 → remove matéria
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/stats.php';
require_once __DIR__ . '/../includes/achievements.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $stmt = $pdo->prepare('SELECT * FROM subjects WHERE user_id=? ORDER BY created_at ASC');
        $stmt->execute([$userId]);
        $subjects = $stmt->fetchAll();

        $ym       = currentYM();
        $today    = date('Y-m-d');
        $todayIds = getTodayCompletionIds($pdo, $userId, $today);

        $result = array_map(function ($s) use ($pdo, $userId, $ym, $todayIds) {
            $id      = (int) $s['id'];
            $monthH  = getSubjectMonthHours($pdo, $userId, $id, $ym);
            $totalH  = getSubjectTotalHours($pdo, $userId, $id);
            $target  = (float) $s['target_hours'];
            $pct     = $target > 0 ? min(100, round(($totalH / $target) * 100)) : 0;

            return [
                'id'          => $id,
                'name'        => $s['name'],
                'targetHours' => $target,
                'days'        => $s['days_per_week'],
                'color'       => $s['color'],
                'monthHours'  => $monthH,
                'doneHours'   => $totalH,
                'progressPct' => $pct,
                'doneToday'   => in_array($id, $todayIds, true),
                'totalFires'  => getSubjectFireCount($pdo, $userId, $id),
            ];
        }, $subjects);

        jsonResponse(['subjects' => $result]);
        break;

    case 'POST':
        $body   = readJsonBody();
        $name   = trim($body['name'] ?? '');
        $target = (float) ($body['targetHours'] ?? 0);
        $days   = trim($body['days'] ?? '5');
        $color  = trim($body['color'] ?? '#4f8aff');

        if ($name === '' || $target <= 0) {
            jsonError('Informe o nome da matéria e a meta de horas.');
        }

        $stmt = $pdo->prepare('INSERT INTO subjects (user_id, name, target_hours, days_per_week, color) VALUES (?,?,?,?,?)');
        $stmt->execute([$userId, $name, $target, $days, $color]);
        $newId = (int) $pdo->lastInsertId();

        $unlocked = checkPlannerAchievements($pdo, $userId);

        jsonResponse(['id' => $newId, 'unlocked' => $unlocked], 201);
        break;

    case 'PUT':
        $body      = readJsonBody();
        $id        = (int) ($body['id'] ?? 0);
        $newMonthH = max(0, (float) ($body['monthHours'] ?? 0));

        $stmt = $pdo->prepare('SELECT id FROM subjects WHERE id=? AND user_id=?');
        $stmt->execute([$id, $userId]);
        if (!$stmt->fetch()) jsonError('Matéria não encontrada.', 404);

        $ym        = currentYM();
        $prevMonth = getSubjectMonthHours($pdo, $userId, $id, $ym);
        $delta     = $newMonthH - $prevMonth;

        if ($delta != 0) {
            $stmt = $pdo->prepare('
                INSERT INTO hours_log (user_id, subject_id, ym, hours) VALUES (?,?,?,?)
                ON DUPLICATE KEY UPDATE hours = VALUES(hours)
            ');
            $stmt->execute([$userId, $id, $ym, $newMonthH]);

            $today = date('Y-m-d');
            touchStudyLog($pdo, $userId, $today, $delta);

            $dayStats = getDayStats($pdo, $userId, $today);
            if ($dayStats['hours'] > 0) {
                $pdo->prepare('INSERT IGNORE INTO studied_days (user_id, day) VALUES (?,?)')->execute([$userId, $today]);
            } elseif ($dayStats['hours'] == 0 && count(getTodayCompletionIds($pdo, $userId, $today)) === 0) {
                $pdo->prepare('DELETE FROM studied_days WHERE user_id=? AND day=?')->execute([$userId, $today]);
            }
        }

        $unlocked = array_merge(
            checkCalendarAchievements($pdo, $userId),
            checkHoursAchievements($pdo, $userId)
        );

        jsonResponse([
            'ok'          => true,
            'monthHours'  => $newMonthH,
            'totalHours'  => getSubjectTotalHours($pdo, $userId, $id),
            'unlocked'    => $unlocked,
        ]);
        break;

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id) jsonError('Informe o id da matéria.');

        $stmt = $pdo->prepare('DELETE FROM subjects WHERE id=? AND user_id=?');
        $stmt->execute([$id, $userId]);

        jsonResponse(['ok' => true]);
        break;

    default:
        jsonError('Método não permitido', 405);
}
