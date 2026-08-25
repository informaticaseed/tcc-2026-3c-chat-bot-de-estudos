<?php
/* ═══════════════════════════════════════════════════════════
   RESPONSE.PHP — Helpers para respostas JSON padronizadas
   ═══════════════════════════════════════════════════════════ */

function jsonResponse($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400): void
{
    jsonResponse(['error' => $message], $code);
}

/** Lê o corpo JSON da requisição e devolve como array associativo. */
function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
