/* ═══════════════════════════════════════════════════════════
   ACCESSIBILITY.JS — EstudaAI
   Painel ⚙️: tema claro/escuro, tamanho de fonte, alto contraste
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';


  /* ──────────────────────────────────────────────────────────
     CHAVES DO localStorage
  ────────────────────────────────────────────────────────── */
  const KEYS = {
    theme:    'ea_theme',
    fontSize: 'ea_fontsize',
    contrast: 'ea_contrast',
  };


  /* ──────────────────────────────────────────────────────────
     ESTADO (carregado do localStorage ou valores padrão)
  ────────────────────────────────────────────────────────── */
  const prefs = {
    theme:    localStorage.getItem(KEYS.theme)    || 'dark',
    fontSize: localStorage.getItem(KEYS.fontSize) || 'normal',
    contrast: localStorage.getItem(KEYS.contrast) === 'true',
  };


  /* ──────────────────────────────────────────────────────────
     APLICAR PREFERÊNCIAS AO <html>
  ────────────────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEYS.theme, theme);
    prefs.theme = theme;
    syncButtons();
  }

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-fontsize', size);
    localStorage.setItem(KEYS.fontSize, size);
    prefs.fontSize = size;
    syncButtons();
  }

  function applyContrast(enabled) {
    if (enabled) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
    localStorage.setItem(KEYS.contrast, enabled);
    prefs.contrast = enabled;
    syncButtons();
  }


  /* ──────────────────────────────────────────────────────────
     SINCRONIZAR ESTADO VISUAL DOS BOTÕES
  ────────────────────────────────────────────────────────── */
  function syncButtons() {
    // Tema
    document.querySelectorAll('[data-opt-theme]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.optTheme === prefs.theme);
    });

    // Fonte
    document.querySelectorAll('[data-opt-font]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.optFont === prefs.fontSize);
    });

    // Alto contraste
    const contrastBtn = document.getElementById('contrast-toggle-btn');
    if (!contrastBtn) return;

    contrastBtn.classList.toggle('active', prefs.contrast);
    contrastBtn.querySelector('.contrast-label').textContent =
      prefs.contrast ? 'Alto contraste ativado' : 'Ativar alto contraste';
    contrastBtn.setAttribute('aria-pressed', prefs.contrast);
  }


  /* ──────────────────────────────────────────────────────────
     CONSTRUIR O PAINEL NO DOM
  ────────────────────────────────────────────────────────── */
  function buildPanel() {
    // Overlay transparente (fecha ao clicar fora)
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', close);
    document.body.appendChild(overlay);

    // Botão de engrenagem ⚙️
    const btn = document.createElement('button');
    btn.id = 'settings-btn';
    btn.setAttribute('aria-label',    'Abrir configurações de acessibilidade');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'settings-panel');
    btn.textContent = '⚙️';
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);

    // Painel
    const panel = document.createElement('div');
    panel.id = 'settings-panel';
    panel.setAttribute('role',       'dialog');
    panel.setAttribute('aria-label', 'Configurações de acessibilidade');

    panel.innerHTML = `
      <div class="settings-title">
        <span aria-hidden="true">♿</span> Acessibilidade
      </div>
      <div class="settings-sub">Personalize sua experiência</div>

      <div class="settings-divider"></div>

      <!-- TEMA -->
      <div class="settings-section-label">
        <span aria-hidden="true">☀️</span> Tema
      </div>
      <div class="option-group" role="group" aria-label="Selecionar tema">
        <button class="opt-btn" data-opt-theme="light"
                aria-label="Ativar tema claro"
                onclick="window._a11y.setTheme('light')">
          <span class="opt-icon" aria-hidden="true">☀️</span>
          Claro
        </button>
        <button class="opt-btn" data-opt-theme="dark"
                aria-label="Ativar tema escuro"
                onclick="window._a11y.setTheme('dark')">
          <span class="opt-icon" aria-hidden="true">🌙</span>
          Escuro
        </button>
      </div>

      <div class="settings-divider"></div>

      <!-- TAMANHO DA FONTE -->
      <div class="settings-section-label">
        <span aria-hidden="true">🔤</span> Tamanho da Fonte
      </div>
      <div class="option-group" role="group" aria-label="Tamanho da fonte">
        <button class="opt-btn font-btn" data-opt-font="normal"
                aria-label="Fonte normal"
                onclick="window._a11y.setFont('normal')">
          <span class="opt-icon" aria-hidden="true">A</span>
          Normal
        </button>
        <button class="opt-btn font-btn" data-opt-font="large"
                aria-label="Fonte grande"
                onclick="window._a11y.setFont('large')">
          <span class="opt-icon" aria-hidden="true">A</span>
          Grande
        </button>
        <button class="opt-btn font-btn" data-opt-font="xlarge"
                aria-label="Fonte extra grande"
                onclick="window._a11y.setFont('xlarge')">
          <span class="opt-icon" aria-hidden="true">A</span>
          Extra
        </button>
      </div>

      <div class="settings-divider"></div>

      <!-- ALTO CONTRASTE -->
      <div class="settings-section-label">
        <span aria-hidden="true">👁️</span> Alto Contraste
      </div>
      <button class="contrast-toggle" id="contrast-toggle-btn"
              role="switch"
              aria-pressed="false"
              aria-label="Alternar alto contraste"
              onclick="window._a11y.toggleContrast()">
        <span class="contrast-label">Ativar alto contraste</span>
        <span class="toggle-pill" aria-hidden="true"></span>
      </button>
    `;

    document.body.appendChild(panel);
  }


  /* ──────────────────────────────────────────────────────────
     ABRIR / FECHAR PAINEL
  ────────────────────────────────────────────────────────── */
  function toggle() {
    const panel = document.getElementById('settings-panel');
    panel.classList.contains('open') ? close() : open();
  }

  function open() {
    document.getElementById('settings-panel').classList.add('open');
    document.getElementById('settings-btn').classList.add('open');
    document.getElementById('settings-overlay').classList.add('open');
    document.getElementById('settings-btn').setAttribute('aria-expanded', 'true');
    // Move o foco para o primeiro botão do painel
    setTimeout(() => {
      document.getElementById('settings-panel').querySelector('button')?.focus();
    }, 80);
  }

  function close() {
    document.getElementById('settings-panel')?.classList.remove('open');
    document.getElementById('settings-btn')?.classList.remove('open');
    document.getElementById('settings-overlay')?.classList.remove('open');
    document.getElementById('settings-btn')?.setAttribute('aria-expanded', 'false');
  }

  // Fechar com a tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });


  /* ──────────────────────────────────────────────────────────
     API PÚBLICA  →  window._a11y
     (usada pelos onclick do HTML gerado)
  ────────────────────────────────────────────────────────── */
  window._a11y = {
    setTheme(theme)    { applyTheme(theme); },
    setFont(size)      { applyFontSize(size); },
    toggleContrast()   { applyContrast(!prefs.contrast); },
  };


  /* ──────────────────────────────────────────────────────────
     INICIALIZAÇÃO
  ────────────────────────────────────────────────────────── */
  function init() {
    buildPanel();
    applyTheme(prefs.theme);
    applyFontSize(prefs.fontSize);
    applyContrast(prefs.contrast);
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();