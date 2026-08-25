<?php
/* ═══════════════════════════════════════════════════════════
   ACHIEVEMENTS.PHP — Mesma lista/lógica do ALL_ACHIEVEMENTS
   do app.js original, agora calculada no servidor.
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/stats.php';

const ALL_ACHIEVEMENTS = [
    ['id' => 'first_msg',        'icon' => '💬', 'name' => 'Primeira Conversa',   'desc' => 'Enviou sua primeira mensagem para o EstudaAI',        'secret' => false],
    ['id' => 'msg_10',           'icon' => '🗣️', 'name' => 'Estudante Ativo',     'desc' => 'Enviou 10 mensagens no chat',                         'secret' => false],
    ['id' => 'msg_50',           'icon' => '📚', 'name' => 'Maratonista',         'desc' => 'Enviou 50 mensagens no chat',                         'secret' => false],
    ['id' => 'first_sub',        'icon' => '📋', 'name' => 'Organizador',         'desc' => 'Adicionou sua primeira matéria no Planner',           'secret' => false],
    ['id' => 'sub_5',            'icon' => '🗂️', 'name' => 'Multi-matéria',       'desc' => 'Adicionou 5 matérias no Planner',                     'secret' => false],
    ['id' => 'goal_100',         'icon' => '🎯', 'name' => 'Meta Alcançada!',     'desc' => 'Completou 100% de uma matéria',                       'secret' => false],
    ['id' => 'streak_3',         'icon' => '🔥', 'name' => 'Sequência de Fogo',   'desc' => '3 dias seguidos de estudo',                           'secret' => false],
    ['id' => 'streak_7',         'icon' => '⚡', 'name' => 'Uma Semana Completa', 'desc' => '7 dias seguidos de estudo',                           'secret' => false],
    ['id' => 'streak_30',        'icon' => '🏅', 'name' => 'Mês de Ouro',         'desc' => '30 dias seguidos de estudo',                          'secret' => true],
    ['id' => 'days_10',          'icon' => '📅', 'name' => 'Dez Dias',            'desc' => '10 dias de estudo registrados',                       'secret' => false],
    ['id' => 'days_50',          'icon' => '🌟', 'name' => 'Cinquenta Dias',      'desc' => '50 dias de estudo registrados',                       'secret' => false],
    ['id' => 'days_100',         'icon' => '💎', 'name' => 'Centenário',          'desc' => '100 dias de estudo registrados',                      'secret' => true],
    ['id' => 'first_completion', 'icon' => '🔥', 'name' => 'Primeira Chama',      'desc' => 'Concluiu uma matéria pela primeira vez no dia',       'secret' => false],
    ['id' => 'completions_10',   'icon' => '🌋', 'name' => 'Em Chamas',           'desc' => 'Concluiu matérias em 10 ocasiões diferentes',         'secret' => false],
    ['id' => 'completions_50',   'icon' => '☀️', 'name' => 'Fênix em Pleno Voo',  'desc' => 'Concluiu matérias em 50 ocasiões — você é imparável!','secret' => true],
    ['id' => 'all_subjects_day', 'icon' => '👑', 'name' => 'Dia Perfeito',        'desc' => 'Concluiu todas as matérias no mesmo dia',             'secret' => false],
    ['id' => 'hours_10',         'icon' => '⏱️', 'name' => 'Dez Horas',           'desc' => 'Acumulou 10 horas de estudo registradas',             'secret' => false],
    ['id' => 'hours_50',         'icon' => '🕐', 'name' => 'Cinquenta Horas',     'desc' => 'Acumulou 50 horas de estudo registradas',             'secret' => false],
    ['id' => 'hours_100',        'icon' => '🏆', 'name' => 'Centenário de Horas', 'desc' => 'Acumulou 100 horas de estudo — você é incrível!',     'secret' => true],
];

/** Desbloqueia (idempotente) e devolve os dados da conquista se for nova, ou null. */
function unlockAchievement(PDO $pdo, int $userId, string $id): ?array
{
    $ach = null;
    foreach (ALL_ACHIEVEMENTS as $a) {
        if ($a['id'] === $id) { $ach = $a; break; }
    }
    if (!$ach) return null;

    $stmt = $pdo->prepare('INSERT IGNORE INTO achievements (user_id, achievement_id) VALUES (?,?)');
    $stmt->execute([$userId, $id]);

    return $stmt->rowCount() > 0 ? $ach : null;
}

/** Testa uma condição e, se verdadeira, tenta desbloquear; acumula em $unlocked se for novo. */
function maybeUnlock(array &$unlocked, bool $condition, PDO $pdo, int $userId, string $achievementId): void
{
    if (!$condition) return;
    $ach = unlockAchievement($pdo, $userId, $achievementId);
    if ($ach) $unlocked[] = $ach;
}

/** @return array Lista de conquistas recém-desbloqueadas (para exibir toast no front-end). */
function checkPlannerAchievements(PDO $pdo, int $userId): array
{
    $unlocked = [];

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM subjects WHERE user_id=?');
    $stmt->execute([$userId]);
    $count = (int) $stmt->fetchColumn();

    maybeUnlock($unlocked, $count >= 1, $pdo, $userId, 'first_sub');
    maybeUnlock($unlocked, $count >= 5, $pdo, $userId, 'sub_5');

    $stmt = $pdo->prepare('SELECT id, target_hours FROM subjects WHERE user_id=?');
    $stmt->execute([$userId]);
    foreach ($stmt->fetchAll() as $s) {
        $target = (float) $s['target_hours'];
        if ($target > 0 && getSubjectTotalHours($pdo, $userId, (int) $s['id']) >= $target) {
            maybeUnlock($unlocked, true, $pdo, $userId, 'goal_100');
            break;
        }
    }

    return $unlocked;
}

function checkCalendarAchievements(PDO $pdo, int $userId): array
{
    $unlocked = [];
    $streak = getStreak($pdo, $userId);
    $total  = getTotalStudiedDays($pdo, $userId);

    maybeUnlock($unlocked, $streak >= 3,   $pdo, $userId, 'streak_3');
    maybeUnlock($unlocked, $streak >= 7,   $pdo, $userId, 'streak_7');
    maybeUnlock($unlocked, $streak >= 30,  $pdo, $userId, 'streak_30');
    maybeUnlock($unlocked, $total  >= 10,  $pdo, $userId, 'days_10');
    maybeUnlock($unlocked, $total  >= 50,  $pdo, $userId, 'days_50');
    maybeUnlock($unlocked, $total  >= 100, $pdo, $userId, 'days_100');

    return $unlocked;
}

function checkCompletionAchievements(PDO $pdo, int $userId, string $today): array
{
    $unlocked = [];
    $total    = getTotalCompletions($pdo, $userId);

    maybeUnlock($unlocked, $total >= 1,  $pdo, $userId, 'first_completion');
    maybeUnlock($unlocked, $total >= 10, $pdo, $userId, 'completions_10');
    maybeUnlock($unlocked, $total >= 50, $pdo, $userId, 'completions_50');

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM subjects WHERE user_id=?');
    $stmt->execute([$userId]);
    $subjectCount = (int) $stmt->fetchColumn();
    $todayIds = getTodayCompletionIds($pdo, $userId, $today);

    if ($subjectCount >= 2) {
        $stmt = $pdo->prepare('SELECT id FROM subjects WHERE user_id=?');
        $stmt->execute([$userId]);
        $allIds = array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
        $allDoneToday = count(array_diff($allIds, $todayIds)) === 0;
        maybeUnlock($unlocked, $allDoneToday, $pdo, $userId, 'all_subjects_day');
    }

    return $unlocked;
}

function checkHoursAchievements(PDO $pdo, int $userId): array
{
    $unlocked = [];
    $total = getTotalHours($pdo, $userId);

    maybeUnlock($unlocked, $total >= 10,  $pdo, $userId, 'hours_10');
    maybeUnlock($unlocked, $total >= 50,  $pdo, $userId, 'hours_50');
    maybeUnlock($unlocked, $total >= 100, $pdo, $userId, 'hours_100');

    return $unlocked;
}

function checkChatAchievements(PDO $pdo, int $userId): array
{
    $unlocked = [];
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM chat_messages cm
        JOIN chat_sessions cs ON cs.id = cm.session_id
        WHERE cs.user_id=? AND cm.role='user'
    ");
    $stmt->execute([$userId]);
    $count = (int) $stmt->fetchColumn();

    maybeUnlock($unlocked, $count >= 1,  $pdo, $userId, 'first_msg');
    maybeUnlock($unlocked, $count >= 10, $pdo, $userId, 'msg_10');
    maybeUnlock($unlocked, $count >= 50, $pdo, $userId, 'msg_50');

    return $unlocked;
}
