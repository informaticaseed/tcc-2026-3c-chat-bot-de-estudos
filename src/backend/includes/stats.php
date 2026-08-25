<?php
/* ═══════════════════════════════════════════════════════════
   STATS.PHP — Consultas agregadas do banco
   (equivalentes às funções getX() do app.js original)
   ═══════════════════════════════════════════════════════════ */

function currentYM(): string
{
    return date('Y-m');
}

function makeYM(int $year, int $monthIndexZeroBased): string
{
    return sprintf('%04d-%02d', $year, $monthIndexZeroBased + 1);
}

function getSubjectMonthHours(PDO $pdo, int $userId, int $subjectId, string $ym): float
{
    $stmt = $pdo->prepare('SELECT hours FROM hours_log WHERE user_id=? AND subject_id=? AND ym=?');
    $stmt->execute([$userId, $subjectId, $ym]);
    return (float) ($stmt->fetchColumn() ?: 0);
}

function getSubjectTotalHours(PDO $pdo, int $userId, int $subjectId): float
{
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(hours),0) FROM hours_log WHERE user_id=? AND subject_id=?');
    $stmt->execute([$userId, $subjectId]);
    return (float) $stmt->fetchColumn();
}

function getMonthHours(PDO $pdo, int $userId, string $ym): float
{
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(hours),0) FROM hours_log WHERE user_id=? AND ym=?');
    $stmt->execute([$userId, $ym]);
    return (float) $stmt->fetchColumn();
}

function getYearHours(PDO $pdo, int $userId, int $year): float
{
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(hours),0) FROM hours_log WHERE user_id=? AND ym LIKE ?");
    $stmt->execute([$userId, $year . '-%']);
    return (float) $stmt->fetchColumn();
}

function getTotalHours(PDO $pdo, int $userId): float
{
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(hours),0) FROM hours_log WHERE user_id=?');
    $stmt->execute([$userId]);
    return (float) $stmt->fetchColumn();
}

function getTotalStudiedDays(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM studied_days WHERE user_id=?');
    $stmt->execute([$userId]);
    return (int) $stmt->fetchColumn();
}

function getTotalCompletions(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM daily_completions WHERE user_id=?');
    $stmt->execute([$userId]);
    return (int) $stmt->fetchColumn();
}

function getTodayCompletionIds(PDO $pdo, int $userId, string $day): array
{
    $stmt = $pdo->prepare('SELECT subject_id FROM daily_completions WHERE user_id=? AND day=?');
    $stmt->execute([$userId, $day]);
    return array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
}

function getSubjectFireCount(PDO $pdo, int $userId, int $subjectId): int
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM daily_completions WHERE user_id=? AND subject_id=?');
    $stmt->execute([$userId, $subjectId]);
    return (int) $stmt->fetchColumn();
}

function getDayStats(PDO $pdo, int $userId, string $day): array
{
    $stmt = $pdo->prepare('SELECT hours, completions FROM study_log WHERE user_id=? AND day=?');
    $stmt->execute([$userId, $day]);
    $row = $stmt->fetch();
    return $row ? ['hours' => (float) $row['hours'], 'completions' => (int) $row['completions']]
                : ['hours' => 0.0, 'completions' => 0];
}

/** Marca/atualiza a linha agregada do dia (study_log). */
function touchStudyLog(PDO $pdo, int $userId, string $day, float $hoursDelta = 0, ?int $completionsAbs = null): void
{
    $stmt = $pdo->prepare('SELECT hours, completions FROM study_log WHERE user_id=? AND day=?');
    $stmt->execute([$userId, $day]);
    $row = $stmt->fetch();

    $hours       = $row ? (float) $row['hours'] : 0.0;
    $completions = $row ? (int) $row['completions'] : 0;

    $hours = max(0, $hours + $hoursDelta);
    if ($completionsAbs !== null) $completions = $completionsAbs;

    $stmt = $pdo->prepare('
        INSERT INTO study_log (user_id, day, hours, completions) VALUES (?,?,?,?)
        ON DUPLICATE KEY UPDATE hours=VALUES(hours), completions=VALUES(completions)
    ');
    $stmt->execute([$userId, $day, $hours, $completions]);
}

/** Sequência (streak) de dias seguidos estudados, terminando hoje ou ontem. */
function getStreak(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT day FROM studied_days WHERE user_id=? ORDER BY day DESC');
    $stmt->execute([$userId]);
    $days = array_flip($stmt->fetchAll(PDO::FETCH_COLUMN));

    $streak = 0;
    $today  = new DateTime('today');

    for ($i = 0; $i < 365; $i++) {
        $d   = (clone $today)->modify("-{$i} days");
        $key = $d->format('Y-m-d');
        if (isset($days[$key])) {
            $streak++;
        } else {
            if ($i === 0) continue; // hoje ainda não marcado — não quebra a sequência
            break;
        }
    }

    return $streak;
}
