<?php
/* ═══════════════════════════════════════════════════════════
   CONFIG.PHP — Configurações centrais do backend
   Edite os valores abaixo com os dados do seu ambiente.
   ═══════════════════════════════════════════════════════════ */

// ── Banco de dados ──────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'phynix');
define('DB_USER', 'root');
define('DB_PASS', '');

// ── Groq API (a chave fica só aqui, nunca no front-end) ─────
define('GROQ_API_KEY', '');
define('GROQ_MODEL', 'llama-3.3-70b-versatile');

// ── CORS ─────────────────────────────────────────────────────
// Se o front-end (index.html) for aberto em outro domínio/porta
// que não seja o mesmo do backend, coloque a origem exata aqui.
// Ex.: 'http://localhost:5500'. Deixe null se front e back
// estiverem servidos pelo mesmo domínio.
define('ALLOWED_ORIGIN', null);

// ── Sessão ───────────────────────────────────────────────────
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
// Se estiver em produção com HTTPS, descomente a linha abaixo:
// ini_set('session.cookie_secure', 1);
