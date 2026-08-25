/* ═══════════════════════════════════════════════════════════
   APP.JS — EstudaAI
   Lógica principal: autenticação, chat, planner, calendário,
   conquistas. Tudo fala com o back-end PHP em /backend/api/.
   ═══════════════════════════════════════════════════════════ */

'use strict';


/* ════════════════════════════════════════════════════════════
   CONFIGURAÇÃO DA API
   Caminho relativo: frontend/index.html → ../backend/api
   (funciona em qualquer domínio/porta, contanto que front e
   back estejam na mesma pasta "phynix", como no XAMPP/Laragon)
════════════════════════════════════════════════════════════ */
const API_BASE = '../backend/api';

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let data = {};
  try { data = await res.json(); } catch (e) { /* corpo vazio, ok */ }

  if (!res.ok) {
    throw new Error(data.error || `Erro na requisição (${res.status})`);
  }
  return data;
}


/* ════════════════════════════════════════════════════════════
   ESTADO GLOBAL (agora um cache do que vem do servidor)
════════════════════════════════════════════════════════════ */
const state = {
  user:           null,
  subjects:       [],
  studyLog:       {},   // { 'YYYY-MM-DD': { hours, completions } }
  studiedDays:    [],   // ['YYYY-MM-DD', ...]
  firesByDay:     {},   // { 'YYYY-MM-DD': count }
  achievements:   [],   // lista completa vinda do servidor, com .unlocked
  dailyGoalHours: 4,
  streak:         0,
  chatSessionId:  null,
  calendarMonth:  new Date().getMonth(),
  calendarYear:   new Date().getFullYear(),
};


/* ════════════════════════════════════════════════════════════
   AUTENTICAÇÃO
════════════════════════════════════════════════════════════ */
function switchAuthTab(tab) {
  document.getElementById('tab-login-btn').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register-btn').classList.toggle('active', tab === 'register');
  document.getElementById('login-form').classList.toggle('active', tab === 'login');
  document.getElementById('register-form').classList.toggle('active', tab === 'register');
  hideAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.add('show');
}

function hideAuthError() {
  document.getElementById('auth-error').classList.remove('show');
}

async function handleLogin(e) {
  e.preventDefault();
  hideAuthError();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const user = await api('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await onLoginSuccess(user);
  } catch (err) {
    showAuthError(err.message);
  }
  return false;
}

async function handleRegister(e) {
  e.preventDefault();
  hideAuthError();
  const name     = document.getElementById('register-name').value.trim();
  const email    = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  try {
    const user = await api('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    await onLoginSuccess(user);
  } catch (err) {
    showAuthError(err.message);
  }
  return false;
}

async function handleLogout() {
  try { await api('/auth/logout.php', { method: 'POST' }); } catch (e) { /* ignora */ }
  state.user = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
}

async function onLoginSuccess(user) {
  state.user = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = '';
  document.getElementById('sidebar-user-name').textContent = user.name || user.email;
  await loadEverything();
}

/** Verifica se já existe sessão ativa (cookie) ao carregar a página. */
async function checkSession() {
  try {
    const { user } = await api('/auth/me.php');
    if (user) {
      await onLoginSuccess(user);
    } else {
      document.getElementById('auth-screen').style.display = 'flex';
    }
  } catch (err) {
    // back-end fora do ar, banco não configurado, etc.
    document.getElementById('auth-screen').style.display = 'flex';
    showAuthError('Não foi possível falar com o servidor. Verifique se o back-end (XAMPP/Laragon) está rodando.');
  }
}


/* ════════════════════════════════════════════════════════════
   CARREGAMENTO GERAL (depois do login)
════════════════════════════════════════════════════════════ */
async function loadEverything() {
  await Promise.all([
    loadSubjects(),
    loadCalendar(),
    loadAchievements(),
    loadSettings(),
  ]);
  renderPlanner();
  renderCalendar();
  renderAchievements();
  document.getElementById('sidebar-streak').textContent = state.streak;
}

async function loadSubjects() {
  const { subjects } = await api('/subjects.php');
  state.subjects = subjects;
}

async function loadCalendar() {
  const y = state.calendarYear, m = state.calendarMonth + 1;
  const data = await api(`/calendar.php?year=${y}&month=${m}`);
  state.studiedDays = data.studiedDays;
  state.studyLog    = data.studyLog;
  state.firesByDay  = data.firesByDay;
  state.streak      = data.stats.streak;
}

async function loadAchievements() {
  const { achievements } = await api('/achievements.php');
  state.achievements = achievements;
}

async function loadSettings() {
  const { goal } = await api('/settings.php');
  state.dailyGoalHours = goal;
}


/* ════════════════════════════════════════════════════════════
   NAVEGAÇÃO POR ABAS
════════════════════════════════════════════════════════════ */
const TAB_ORDER = ['chat', 'planner', 'calendar', 'achievements'];

function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(p  => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t    => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(tab + '-panel').classList.add('active');

  const idx = TAB_ORDER.indexOf(tab);
  document.querySelectorAll('.tab')[idx].classList.add('active');
  document.querySelectorAll('.nav-btn')[idx].classList.add('active');

  if (tab === 'planner')      renderPlanner();
  if (tab === 'calendar')     renderCalendar();
  if (tab === 'achievements') renderAchievements();
}


/* ════════════════════════════════════════════════════════════
   CHAT
   Fala com /api/chat.php no servidor, que por sua vez chama a
   Groq — a chave de API nunca fica exposta no navegador.
   Suporta: histórico persistente de conversas (listar, abrir,
   excluir) e edição de mensagens já enviadas (que regenera a
   resposta da IA a partir do ponto editado).
════════════════════════════════════════════════════════════ */
const WELCOME_HTML = `
  <div class="msg ai">
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      Olá! 👋 Sou o seu assistente de estudos para <strong>concursos e vestibulares</strong>. Posso te ajudar com:<br><br>
      • Explicações de matérias (Matemática, Português, História...)<br>
      • Questões e exercícios<br>
      • Técnicas de memorização<br>
      • Estratégias para provas<br>
      • Montagem de cronograma<br><br>
      Por qual matéria quer começar hoje? 🎯
    </div>
  </div>`;

async function sendMessage() {
  const inp  = document.getElementById('user-input');
  const text = inp.value.trim();
  if (!text) return;

  inp.value = '';
  inp.style.height = '';
  document.getElementById('send-btn').disabled = true;

  const userMsgEl = appendMsg('user', text);
  const typingEl  = appendTyping();

  try {
    const data = await api('/chat.php', {
      method: 'POST',
      body: JSON.stringify({ message: text, sessionId: state.chatSessionId }),
    });

    typingEl.remove();
    state.chatSessionId = data.sessionId;
    userMsgEl.dataset.msgId = data.userMessageId;
    appendMsg('ai', data.reply, data.assistantMessageId);
    handleUnlocked(data.unlocked);
  } catch (err) {
    typingEl.remove();
    appendMsg('ai', '⚠️ ' + (err.message || 'Não foi possível conectar à IA agora. Tente novamente em instantes.'));
  } finally {
    document.getElementById('send-btn').disabled = false;
  }
}

function appendMsg(role, text, msgId = null) {
  const normRole = role === 'assistant' ? 'ai' : role;
  const wrap = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = 'msg ' + normRole;
  if (msgId) div.dataset.msgId = msgId;

  const editBtn = normRole === 'user'
    ? `<button class="msg-edit-btn" onclick="startEditMessage(this)" aria-label="Editar mensagem" title="Editar mensagem">✏️</button>`
    : '';

  div.innerHTML = `
    <div class="msg-avatar">${normRole === 'ai' ? '🤖' : '👤'}</div>
    <div class="msg-bubble">
      ${editBtn}
      <div class="msg-bubble-content">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
    </div>
  `;
  div.querySelector('.msg-bubble').dataset.raw = text;

  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return div;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function appendTyping() {
  const wrap = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = 'msg ai';
  div.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>
  `;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return div;
}

function sendQuick(text) {
  document.getElementById('user-input').value = text;
  sendMessage();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// Auto-resize do textarea
document.getElementById('user-input').addEventListener('input', function () {
  this.style.height = '';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});


/* ── Edição de mensagens já enviadas ─────────────────────── */
function startEditMessage(btnEl) {
  const msgEl = btnEl.closest('.msg');
  const msgId = msgEl.dataset.msgId;
  if (!msgId) return; // ainda sem confirmação do servidor, espera terminar de enviar

  const bubble   = msgEl.querySelector('.msg-bubble');
  const original = bubble.dataset.raw;

  bubble.innerHTML = `
    <div class="msg-edit-area">
      <textarea class="msg-edit-textarea">${escapeHtml(original)}</textarea>
      <div class="msg-edit-hint">Isso vai apagar as respostas depois dessa mensagem e gerar uma nova resposta.</div>
      <div class="msg-edit-actions">
        <button type="button" onclick="cancelEditMessage(this)">Cancelar</button>
        <button type="button" class="msg-edit-save" onclick="saveEditedMessage(this)">Salvar e reenviar</button>
      </div>
    </div>
  `;

  const ta = bubble.querySelector('textarea');
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
}

function cancelEditMessage(btnEl) {
  const bubble = btnEl.closest('.msg-bubble');
  restoreBubble(bubble, bubble.dataset.raw);
}

function restoreBubble(bubble, text) {
  const msgEl  = bubble.closest('.msg');
  const isUser = msgEl.classList.contains('user');
  bubble.innerHTML = `
    ${isUser ? '<button class="msg-edit-btn" onclick="startEditMessage(this)" aria-label="Editar mensagem" title="Editar mensagem">✏️</button>' : ''}
    <div class="msg-bubble-content">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
  `;
  bubble.dataset.raw = text;
}

async function saveEditedMessage(btnEl) {
  const bubble  = btnEl.closest('.msg-bubble');
  const msgEl   = bubble.closest('.msg');
  const msgId   = msgEl.dataset.msgId;
  const ta      = bubble.querySelector('textarea');
  const newText = ta.value.trim();
  if (!newText) return;

  btnEl.disabled = true;
  btnEl.textContent = 'Enviando…';

  try {
    const data = await api('/chat.php', {
      method: 'PUT',
      body: JSON.stringify({ sessionId: state.chatSessionId, messageId: msgId, content: newText }),
    });

    restoreBubble(bubble, newText);

    // Remove do DOM tudo que veio depois dessa mensagem
    // (respostas antigas ficaram obsoletas — o servidor já apagou do banco)
    let next = msgEl.nextElementSibling;
    while (next) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }

    appendMsg('ai', data.reply, data.assistantMessageId);
  } catch (err) {
    showToast('⚠️', 'Erro ao editar', err.message);
    btnEl.disabled = false;
    btnEl.textContent = 'Salvar e reenviar';
  }
}


/* ── Histórico de conversas ───────────────────────────────── */
function toggleHistory() {
  document.getElementById('history-panel').classList.contains('open') ? closeHistory() : openHistory();
}

async function openHistory() {
  document.getElementById('history-panel').classList.add('open');
  document.getElementById('history-overlay').classList.add('open');
  await loadHistoryList();
}

function closeHistory() {
  document.getElementById('history-panel').classList.remove('open');
  document.getElementById('history-overlay').classList.remove('open');
}

async function loadHistoryList() {
  const list = document.getElementById('history-list');
  list.innerHTML = '<div class="history-empty">Carregando…</div>';
  try {
    const { sessions } = await api('/chat.php?list=1');
    renderHistoryList(sessions);
  } catch (err) {
    list.innerHTML = '<div class="history-empty">Erro ao carregar histórico.</div>';
  }
}

function renderHistoryList(sessions) {
  const list = document.getElementById('history-list');

  if (!sessions.length) {
    list.innerHTML = '<div class="history-empty">Nenhuma conversa ainda.<br>Envie uma mensagem pra começar!</div>';
    return;
  }

  list.innerHTML = sessions.map(s => {
    const active = String(s.id) === String(state.chatSessionId);
    const dt = new Date((s.updated_at || s.created_at).replace(' ', 'T'));
    const date = isNaN(dt) ? '' : dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    return `
      <div class="history-item ${active ? 'active' : ''}" onclick="openSession(${s.id})">
        <div class="history-item-text">
          <div class="history-item-preview">${escapeHtml(s.preview || 'Conversa')}</div>
          <div class="history-item-date">${date}</div>
        </div>
        <button class="history-item-delete" onclick="deleteSession(event, ${s.id})" aria-label="Excluir conversa">🗑️</button>
      </div>`;
  }).join('');
}

async function openSession(id) {
  try {
    const { messages } = await api(`/chat.php?id=${id}`);
    state.chatSessionId = id;

    const wrap = document.getElementById('messages');
    wrap.innerHTML = '';
    if (!messages.length) {
      wrap.innerHTML = WELCOME_HTML;
    } else {
      messages.forEach(m => appendMsg(m.role, m.content, m.id));
    }
    closeHistory();
  } catch (err) {
    showToast('⚠️', 'Erro', err.message);
  }
}

async function deleteSession(evt, id) {
  evt.stopPropagation();
  if (!confirm('Excluir essa conversa? Essa ação não pode ser desfeita.')) return;

  try {
    await api(`/chat.php?id=${id}`, { method: 'DELETE' });
    if (String(state.chatSessionId) === String(id)) startNewChat();
    await loadHistoryList();
  } catch (err) {
    showToast('⚠️', 'Erro ao excluir', err.message);
  }
}

function startNewChat() {
  state.chatSessionId = null;
  document.getElementById('messages').innerHTML = WELCOME_HTML;
  closeHistory();
}




/* ════════════════════════════════════════════════════════════
   PLANNER
════════════════════════════════════════════════════════════ */
async function addSubject() {
  const name  = document.getElementById('inp-subject').value.trim();
  const hours = parseFloat(document.getElementById('inp-hours').value);
  const days  = document.getElementById('inp-days').value.trim() || '5';
  const color = document.getElementById('inp-color').value;

  if (!name || !hours) {
    showToast('⚠️', 'Campos obrigatórios', 'Preencha a matéria e a meta de horas.');
    return;
  }

  try {
    const data = await api('/subjects.php', {
      method: 'POST',
      body: JSON.stringify({ name, targetHours: hours, days, color }),
    });

    document.getElementById('inp-subject').value = '';
    document.getElementById('inp-hours').value   = '';
    document.getElementById('inp-days').value    = '';

    await loadSubjects();
    renderPlanner();
    handleUnlocked(data.unlocked);
  } catch (err) {
    showToast('⚠️', 'Erro ao adicionar', err.message);
  }
}

async function removeSubject(id) {
  try {
    await api(`/subjects.php?id=${id}`, { method: 'DELETE' });
    await loadSubjects();
    renderPlanner();
  } catch (err) {
    showToast('⚠️', 'Erro ao remover', err.message);
  }
}

async function updateDone(id, val) {
  const monthHours = Math.max(0, parseFloat(val) || 0);
  try {
    const data = await api('/subjects.php', {
      method: 'PUT',
      body: JSON.stringify({ id, monthHours }),
    });
    await loadSubjects();
    renderPlanner();
    handleUnlocked(data.unlocked);
  } catch (err) {
    showToast('⚠️', 'Erro ao atualizar horas', err.message);
    renderPlanner();
  }
}

async function completeSubject(id) {
  try {
    const data = await api('/complete.php', {
      method: 'POST',
      body: JSON.stringify({ subjectId: id }),
    });
    await loadSubjects();
    await loadCalendar();
    renderPlanner();
    renderCalendar();
    document.getElementById('sidebar-streak').textContent = state.streak;
    showToast(data.removed ? '↩️' : '🔥',
      data.removed ? 'Desmarcado' : 'Concluído!',
      data.removed ? `${data.subjectName} desmarcada de hoje.` : `${data.subjectName} concluída hoje!`);
    handleUnlocked(data.unlocked);
  } catch (err) {
    showToast('⚠️', 'Erro', err.message);
  }
}

function renderPlanner() {
  const tbody = document.getElementById('planner-body');

  if (!state.subjects.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px">
          Adicione sua primeira matéria acima 👆
        </td>
      </tr>`;
    return;
  }

  const todayIds = new Set(state.subjects.filter(s => s.doneToday).map(s => s.id));

  tbody.innerHTML = state.subjects.map(s => {
    const pct   = s.progressPct;
    const badge = pct >= 100
      ? '<span class="badge badge-green">✅ Meta atingida</span>'
      : pct >= 50
        ? '<span class="badge badge-yellow">⏳ Em andamento</span>'
        : '<span class="badge badge-blue">🎯 Iniciando</span>';

    return `
      <tr>
        <td>
          <span style="display:inline-flex;align-items:center;gap:8px">
            <span style="width:10px;height:10px;border-radius:50%;background:${s.color};
                         flex-shrink:0;display:inline-block"></span>
            <strong>${escapeHtml(s.name)}</strong>
          </span>
        </td>
        <td>${s.targetHours}h</td>
        <td>
          <input type="number" class="prog-inp"
            value="${s.monthHours}" min="0" max="${s.targetHours * 4}"
            onchange="updateDone(${s.id}, this.value)"
            aria-label="Horas feitas de ${escapeHtml(s.name)} este mês">h
        </td>
        <td style="min-width:140px">
          ${badge}
          <div class="prog-bar">
            <div class="prog-fill" style="width:${pct}%;background:${s.color}"></div>
          </div>
          <small style="color:var(--text-muted);font-size:11px">${pct}% (${s.doneHours}h no total)</small>
        </td>
        <td>${escapeHtml(String(s.days))}x/semana</td>
        <td style="white-space:nowrap">
          <button class="btn btn-fire ${todayIds.has(s.id) ? 'done' : ''}" onclick="completeSubject(${s.id})"
            aria-label="Marcar ${escapeHtml(s.name)} como concluída hoje">
            ${todayIds.has(s.id) ? '🔥 Feito hoje' : '🔥 Concluir hoje'}
          </button>
          <button class="btn btn-danger" onclick="removeSubject(${s.id})"
            aria-label="Remover ${escapeHtml(s.name)}">🗑️</button>
        </td>
      </tr>`;
  }).join('');
}


/* ════════════════════════════════════════════════════════════
   CALENDÁRIO
════════════════════════════════════════════════════════════ */
function fmtDate(d) {
  return d.getFullYear()
    + '-' + String(d.getMonth() + 1).padStart(2, '0')
    + '-' + String(d.getDate()).padStart(2, '0');
}

async function markToday() {
  const key = fmtDate(new Date());
  try {
    const data = await api('/calendar.php', {
      method: 'POST',
      body: JSON.stringify({ date: key }),
    });
    await loadCalendar();
    renderCalendar();
    document.getElementById('sidebar-streak').textContent = state.streak;

    showToast(data.marked ? '✅' : '↩️',
      data.marked ? 'Dia marcado!' : 'Desmarcado',
      data.marked ? 'Continue assim, você está indo muito bem!' : 'Dia de hoje desmarcado.');

    handleUnlocked(data.unlocked);
  } catch (err) {
    showToast('⚠️', 'Erro', err.message);
  }
}

async function changeMonth(dir) {
  state.calendarMonth += dir;
  if (state.calendarMonth > 11) { state.calendarMonth = 0;  state.calendarYear++; }
  if (state.calendarMonth < 0)  { state.calendarMonth = 11; state.calendarYear--; }
  await loadCalendar();
  renderCalendar();
}

async function toggleDay(key) {
  try {
    const data = await api('/calendar.php', {
      method: 'POST',
      body: JSON.stringify({ date: key }),
    });
    await loadCalendar();
    renderCalendar();
    document.getElementById('sidebar-streak').textContent = state.streak;
    handleUnlocked(data.unlocked);
  } catch (err) {
    showToast('⚠️', 'Erro', err.message);
  }
}

function renderCalendar() {
  const MONTHS = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ];
  const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  document.getElementById('cal-month-label').textContent = `${MONTHS[state.calendarMonth]} ${state.calendarYear}`;
  document.getElementById('stat-streak').textContent     = state.streak;
  document.getElementById('sidebar-streak').textContent  = state.streak;
  document.getElementById('stat-total').textContent      = state.studiedDays.length;

  const ym = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}`;
  const monthHours = Object.entries(state.studyLog)
    .filter(([day]) => day.startsWith(ym))
    .reduce((acc, [, v]) => acc + v.hours, 0);
  document.getElementById('stat-hours').textContent = monthHours + 'h';

  const grid     = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAY_NAMES.forEach(name => {
    const el = document.createElement('div');
    el.className   = 'cal-day-name';
    el.textContent = name;
    grid.appendChild(el);
  });

  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1);
  const lastDay  = new Date(state.calendarYear, state.calendarMonth + 1, 0);

  for (let i = 0; i < firstDay.getDay(); i++) {
    const prev = new Date(state.calendarYear, state.calendarMonth, -firstDay.getDay() + i + 1);
    const el   = document.createElement('div');
    el.className   = 'cal-day other-month';
    el.textContent = prev.getDate();
    grid.appendChild(el);
  }

  const streakDays = new Set();
  const d = new Date(today);
  for (let i = 0; i < state.streak; i++) {
    streakDays.add(fmtDate(d));
    d.setDate(d.getDate() - 1);
  }

  const studiedSet = new Set(state.studiedDays);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date      = new Date(state.calendarYear, state.calendarMonth, day);
    const key       = fmtDate(date);
    const isToday   = date.getTime() === today.getTime();
    const isStudied = studiedSet.has(key);
    const isStreak  = streakDays.has(key);

    const el = document.createElement('div');
    el.className = 'cal-day';
    if (isToday)               el.classList.add('today');
    if (isStreak && isStudied) el.classList.add('streak-day');
    else if (isStudied)        el.classList.add('studied');

    el.innerHTML = `${day}<span class="dot"></span>`;
    el.setAttribute('aria-label', `${day} de ${MONTHS[state.calendarMonth]}${isStudied ? ' — estudado' : ''}`);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.onclick   = () => toggleDay(key);
    el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') toggleDay(key); };

    grid.appendChild(el);
  }
}


/* ════════════════════════════════════════════════════════════
   CONQUISTAS
   A lista completa (ícones, nomes, descrições) vem do servidor
   em GET /api/achievements.php — é a mesma fonte de verdade
   usada para desbloquear, então front e back nunca ficam
   dessincronizados.
════════════════════════════════════════════════════════════ */
function mergeUnlocked(list, unlockedAchievements) {
  const ids = new Set(unlockedAchievements.map(a => a.id));
  return list.map(a => ids.has(a.id) ? { ...a, unlocked: true } : a);
}

function handleUnlocked(unlocked) {
  if (!unlocked || !unlocked.length) return;
  state.achievements = mergeUnlocked(state.achievements, unlocked);
  renderAchievements();
  unlocked.forEach(a => showAchievementToast(a));
}

function showAchievementToast(ach) {
  showToast(ach.icon, 'Conquista desbloqueada! ' + ach.name, ach.desc);
  fireConfetti();
}

function renderAchievements() {
  const grid = document.getElementById('ach-grid');
  if (!state.achievements.length) {
    grid.innerHTML = '<div style="color:var(--text-muted);padding:20px">Carregando conquistas…</div>';
    return;
  }

  grid.innerHTML = state.achievements.map(a => {
    // Conquistas secretas ficam com nome/descrição ocultos até desbloquear
    const hidden = a.secret && !a.unlocked;
    const name = hidden ? '???' : a.name;
    const desc = hidden ? 'Conquista secreta — continue estudando para descobrir!' : a.desc;
    const icon = hidden ? '🔒' : a.icon;

    return `
      <div class="ach-card ${a.unlocked ? 'unlocked' : 'locked'}"
        aria-label="${escapeHtml(name)} — ${a.unlocked ? 'Desbloqueada' : 'Bloqueada'}">
        <span class="ach-badge">${a.unlocked ? '✓ Obtida' : 'Bloqueada'}</span>
        <div class="ach-icon">${icon}</div>
        <div class="ach-name">${escapeHtml(name)}</div>
        <div class="ach-desc">${escapeHtml(desc)}</div>
      </div>`;
  }).join('');
}


/* ════════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════════ */
let toastTimeout;

function showToast(icon, title, sub) {
  clearTimeout(toastTimeout);
  document.getElementById('toast-icon').textContent  = icon;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent   = sub;
  document.getElementById('toast').classList.add('show');
  toastTimeout = setTimeout(() => document.getElementById('toast').classList.remove('show'), 4000);
}


/* ════════════════════════════════════════════════════════════
   CONFETE
════════════════════════════════════════════════════════════ */
function fireConfetti() {
  const COLORS = ['#4f8aff','#a78bfa','#34d399','#f59e0b','#f87171','#60a5fa','#fbbf24'];

  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className  = 'confetti-piece';
    el.style.cssText = `
      left:${Math.random() * 100}vw;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      animation-duration:${1.5 + Math.random() * 1.5}s;
      animation-delay:${Math.random() * 0.6}s;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}


/* ════════════════════════════════════════════════════════════
   MODAL DE META DIÁRIA
════════════════════════════════════════════════════════════ */
function openModal()  {
  document.getElementById('goal-inp').value = state.dailyGoalHours || '';
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

async function saveGoal() {
  const v = parseInt(document.getElementById('goal-inp').value);
  if (!v || v < 1 || v > 24) {
    showToast('⚠️', 'Valor inválido', 'Informe um número entre 1 e 24 horas.');
    return;
  }
  try {
    await api('/settings.php', { method: 'POST', body: JSON.stringify({ goal: v }) });
    state.dailyGoalHours = v;
    closeModal();
    showToast('🎯', 'Meta atualizada!', `${v}h por dia definidas.`);
  } catch (err) {
    showToast('⚠️', 'Erro ao salvar meta', err.message);
  }
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});


/* ════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════════════════════ */
checkSession();
