import { state } from "../core/state.js";
import {
  getSubjectMonthHours,
  getSubjectTotalHours,
  getTodayCompletions,
} from "../modules/planner.js";

export function renderPlanner() {
  const tbody = document.getElementById("planner-body");
  if (!tbody) return;

  if (state.subjects.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px">
        Adicione sua primeira matéria para começar! 📚</td></tr>`;
    return;
  }

  const todayCompletions = getTodayCompletions();
  const ym = new Date().toISOString().slice(0, 7);

  tbody.innerHTML = state.subjects
    .map((subject) => {
      const monthH = getSubjectMonthHours(subject.id, ym);
      const totalH = getSubjectTotalHours(subject.id);
      const pct = Math.min(
        100,
        Math.round((totalH / subject.targetHours) * 100),
      );
      const isDone = pct >= 100;
      const doneToday = todayCompletions.includes(subject.id);
      const totalFires = Object.values(state.dailyCompletions).filter((list) =>
        list.includes(subject.id),
      ).length;

      return `
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
                       background:${subject.color};margin-right:8px"></span>${subject.name}
        </td>
        <td>${subject.targetHours}h</td>
        <td>
          <input type="number" value="${monthH}" step="0.5" min="0"
                 class="inp-inline" onchange="updateDone(${subject.id}, this.value)"
                 title="Horas neste mês. Total geral: ${totalH.toFixed(1)}h">
          <span style="font-size:10px;color:var(--text-muted);display:block;line-height:1.4;margin-top:2px">
            mês · ${totalH.toFixed(1)}h total
          </span>
        </td>
        <td>
          <div class="prog-bar">
            <div class="prog-fill"
                 style="width:${pct}%;background:${isDone ? "var(--accent3)" : subject.color}"></div>
          </div>
          <span style="font-size:11px">${pct}%</span>
        </td>
        <td>${subject.days}x/sem</td>
        <td>
          <button onclick="toggleDailyCompletion(${subject.id})"
                  class="btn-complete ${doneToday ? "done" : ""}"
                  title="${doneToday ? "Desmarcar conclusão de hoje" : "Marcar como concluída hoje"}">
            ${doneToday ? "🔥 Feita!" : "⬜ Concluir hoje"}
          </button>
          <span class="fire-count" title="Total de dias concluídos">🔥×${totalFires}</span>
        </td>
        <td>
          <button onclick="removeSubject(${subject.id})" class="btn-danger" title="Remover matéria">🗑️</button>
        </td>
      </tr>`;
    })
    .join("");
}
