<?php
/* ═══════════════════════════════════════════════════════════
   /api/chat.php
   GET    ?list=1                → lista histórico de conversas (preview)
   GET    ?id=123                → devolve todas as mensagens de uma conversa
   POST   { message, sessionId? }              → envia mensagem nova
   PUT    { sessionId, messageId, content }    → edita uma mensagem do
                                                  usuário, apaga tudo que
                                                  veio depois dela na
                                                  conversa e gera uma nova
                                                  resposta da IA a partir daí
   DELETE ?id=123                → apaga uma conversa inteira (e as
                                    mensagens dela, via ON DELETE CASCADE)

   Em todos os casos a chave da Groq fica só aqui no servidor,
   nunca é enviada ao navegador.
   ═══════════════════════════════════════════════════════════ */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/achievements.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

const SYSTEM_PROMPT = "Você é o EstudaAI, um assistente direto, objetivo e extremamente eficiente para estudantes brasileiros de concursos públicos e vestibulares.\n\n" .
    "Regras obrigatórias:\n" .
    "- Responda de forma clara, direta e concisa. Vá direto ao ponto.\n" .
    "- Evite introduções longas, emojis excessivos, frases motivacionais repetitivas e enrolação.\n" .
    "- Use linguagem natural mas profissional.\n" .
    "- Quando for explicar conceitos, priorize: definição → exemplos → dica de prova (quando aplicável).\n" .
    "- Se o usuário pedir resumo, faça resumo de verdade (curto e útil).\n" .
    "- Sempre que possível, use listas, negrito ou tópicos para facilitar a leitura.\n" .
    "- Seja didático sem ser prolixo.";

/** Chama a Groq com o histórico dado e devolve o texto da resposta (ou lança erro JSON). */
function callGroq(array $history): string
{
    $messages = [['role' => 'system', 'content' => SYSTEM_PROMPT]];
    foreach ($history as $m) {
        $messages[] = ['role' => $m['role'], 'content' => $m['content']];
    }

    $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . GROQ_API_KEY,
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'model'      => GROQ_MODEL,
            'max_tokens' => 1000,
            'messages'   => $messages,
        ]),
        CURLOPT_TIMEOUT => 30,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        jsonError('Falha na conexão com a IA: ' . $curlErr, 502);
    }

    $data = json_decode($response, true);

    if ($httpCode !== 200) {
        jsonError('Erro na API da Groq: ' . ($data['error']['message'] ?? 'tente novamente.'), 502);
    }

    return $data['choices'][0]['message']['content'] ?? 'Não consegui gerar uma resposta.';
}

/** Confirma que a sessão pertence ao usuário logado; encerra com 404 se não. */
function ownSessionOrFail(PDO $pdo, int $sessionId, int $userId): void
{
    $stmt = $pdo->prepare('SELECT id FROM chat_sessions WHERE id=? AND user_id=?');
    $stmt->execute([$sessionId, $userId]);
    if (!$stmt->fetch()) jsonError('Conversa não encontrada.', 404);
}

if ($method === 'GET' && isset($_GET['list'])) {

    $stmt = $pdo->prepare('
        SELECT id, preview, created_at, updated_at FROM chat_sessions
        WHERE user_id=? ORDER BY updated_at DESC
    ');
    $stmt->execute([$userId]);
    jsonResponse(['sessions' => $stmt->fetchAll()]);

} elseif ($method === 'GET' && isset($_GET['id'])) {

    $sessionId = (int) $_GET['id'];
    ownSessionOrFail($pdo, $sessionId, $userId);

    $stmt = $pdo->prepare('SELECT id, role, content, created_at FROM chat_messages WHERE session_id=? ORDER BY id ASC');
    $stmt->execute([$sessionId]);
    jsonResponse(['messages' => $stmt->fetchAll()]);

} elseif ($method === 'POST') {

    $body      = readJsonBody();
    $message   = trim($body['message'] ?? '');
    $sessionId = isset($body['sessionId']) ? (int) $body['sessionId'] : 0;

    if ($message === '') jsonError('Mensagem vazia.');

    // Garante que a sessão existe e pertence ao usuário; senão cria uma nova
    if ($sessionId) {
        $stmt = $pdo->prepare('SELECT id FROM chat_sessions WHERE id=? AND user_id=?');
        $stmt->execute([$sessionId, $userId]);
        if (!$stmt->fetch()) $sessionId = 0;
    }
    if (!$sessionId) {
        $stmt = $pdo->prepare('INSERT INTO chat_sessions (user_id, preview) VALUES (?, ?)');
        $stmt->execute([$userId, mb_substr($message, 0, 40) . '...']);
        $sessionId = (int) $pdo->lastInsertId();
    }

    // Salva a mensagem do usuário
    $pdo->prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?,?,?)')
        ->execute([$sessionId, 'user', $message]);
    $userMessageId = (int) $pdo->lastInsertId();

    // Monta o histórico da conversa para dar contexto à IA
    $stmt = $pdo->prepare('SELECT role, content FROM chat_messages WHERE session_id=? ORDER BY id ASC');
    $stmt->execute([$sessionId]);
    $reply = callGroq($stmt->fetchAll());

    $pdo->prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?,?,?)')
        ->execute([$sessionId, 'assistant', $reply]);
    $assistantMessageId = (int) $pdo->lastInsertId();
    $pdo->prepare('UPDATE chat_sessions SET updated_at = NOW() WHERE id=?')->execute([$sessionId]);

    $unlocked = checkChatAchievements($pdo, $userId);

    jsonResponse([
        'sessionId'           => $sessionId,
        'userMessageId'       => $userMessageId,
        'assistantMessageId'  => $assistantMessageId,
        'reply'               => $reply,
        'unlocked'            => $unlocked,
    ]);

} elseif ($method === 'PUT') {

    $body      = readJsonBody();
    $sessionId = (int) ($body['sessionId'] ?? 0);
    $messageId = (int) ($body['messageId'] ?? 0);
    $content   = trim($body['content'] ?? '');

    if (!$sessionId || !$messageId) jsonError('Informe sessionId e messageId.');
    if ($content === '') jsonError('Mensagem vazia.');

    ownSessionOrFail($pdo, $sessionId, $userId);

    // A mensagem editada precisa ser do usuário e pertencer a essa sessão
    $stmt = $pdo->prepare("SELECT id FROM chat_messages WHERE id=? AND session_id=? AND role='user'");
    $stmt->execute([$messageId, $sessionId]);
    if (!$stmt->fetch()) jsonError('Mensagem não encontrada.', 404);

    // Atualiza o texto da mensagem
    $pdo->prepare('UPDATE chat_messages SET content=? WHERE id=?')->execute([$content, $messageId]);

    // Apaga tudo que veio depois dela (respostas antigas ficam obsoletas)
    $pdo->prepare('DELETE FROM chat_messages WHERE session_id=? AND id > ?')->execute([$sessionId, $messageId]);

    // Recalcula a resposta da IA com o histórico já truncado/editado
    $stmt = $pdo->prepare('SELECT role, content FROM chat_messages WHERE session_id=? ORDER BY id ASC');
    $stmt->execute([$sessionId]);
    $reply = callGroq($stmt->fetchAll());

    $pdo->prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?,?,?)')
        ->execute([$sessionId, 'assistant', $reply]);
    $assistantMessageId = (int) $pdo->lastInsertId();
    $pdo->prepare('UPDATE chat_sessions SET updated_at = NOW() WHERE id=?')->execute([$sessionId]);

    jsonResponse([
        'sessionId'          => $sessionId,
        'assistantMessageId' => $assistantMessageId,
        'reply'              => $reply,
    ]);

} elseif ($method === 'DELETE') {

    $sessionId = (int) ($_GET['id'] ?? 0);
    if (!$sessionId) jsonError('Informe o id da conversa.');

    $stmt = $pdo->prepare('DELETE FROM chat_sessions WHERE id=? AND user_id=?');
    $stmt->execute([$sessionId, $userId]);

    jsonResponse(['ok' => true]);

} else {
    jsonError('Método não permitido', 405);
}
