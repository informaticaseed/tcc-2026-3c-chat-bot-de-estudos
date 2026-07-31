import { state } from "../core/state.js";
import { ALL_ACHIEVEMENTS } from "../modules/achievements.js";

export function renderAchievements() {
  const grid = document.getElementById("ach-grid");
  if (!grid) return;

  grid.innerHTML = ALL_ACHIEVEMENTS.map((achievement) => {
    const unlocked = state.achievements.includes(achievement.id);
    return `<div class="ach-card ${unlocked ? "unlocked" : "locked"}">
      <div class="ach-icon">${unlocked ? achievement.icon : achievement.secret ? "🔒" : achievement.icon}</div>
      <div class="ach-name">${unlocked || !achievement.secret ? achievement.name : "???"}</div>
      <div class="ach-desc">${unlocked || !achievement.secret ? achievement.desc : "Conquista secreta — continue estudando!"}</div>
      ${
        unlocked
          ? '<div class="ach-badge">✅ Desbloqueada</div>'
          : '<div class="ach-badge locked-badge">🔒 Bloqueada</div>'
      }
    </div>`;
  }).join("");
}
