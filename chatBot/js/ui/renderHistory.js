import { state } from "../core/state.js";

export function renderHistory() {
  const grid = document.getElementById("history-list");
  if (!grid) return;

  if (state.chatHistory.length === 0) {
    grid.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">Nenhuma conversa salva ainda.</p>';
    return;
  }

  grid.innerHTML = state.chatHistory
    .map(
      (session) => `
    <div class="ach-card unlocked" onclick="loadChat(${session.id})" style="cursor:pointer;text-align:left;">
      <div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:8px">${session.date}</div>
      <div class="ach-desc" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;
           overflow:hidden;font-size:14px;color:var(--text)">${session.preview}</div>
    </div>`,
    )
    .join("");
}
