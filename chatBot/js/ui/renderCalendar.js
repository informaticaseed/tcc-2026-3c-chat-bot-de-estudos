import { state } from "../core/state.js";
import {
  getDayStats,
  getMonthHours,
  getYearHours,
  getTotalStudiedDays,
} from "../modules/planner.js";
import { getStreak } from "../modules/calendar.js";
import { makeYM } from "../core/utils.js";

export function renderCalendar() {
  const grid = document.getElementById("cal-grid");
  const monthLabel = document.getElementById("cal-month-label");
  if (!grid || !monthLabel) return;

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  monthLabel.textContent = `${months[state.calendarMonth]} ${state.calendarYear}`;

  const ym = makeYM(state.calendarYear, state.calendarMonth);
  const monthHours = getMonthHours(ym);
  const yearHours = getYearHours(state.calendarYear);

  document.getElementById("stat-streak").textContent = getStreak();
  document.getElementById("stat-total").textContent = getTotalStudiedDays();
  document.getElementById("stat-hours").textContent =
    `${monthHours.toFixed(1)}h`;
  const yearEl = document.getElementById("stat-year-hours");
  if (yearEl) yearEl.textContent = `${yearHours.toFixed(1)}h`;

  const todayStr = new Date().toISOString().slice(0, 10);
  const firstDay = new Date(
    state.calendarYear,
    state.calendarMonth,
    1,
  ).getDay();
  const daysInMonth = new Date(
    state.calendarYear,
    state.calendarMonth + 1,
    0,
  ).getDate();

  let html = "";
  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
    html += `<div class="cal-day-header">${day}</div>`;
  });

  for (let i = 0; i < firstDay; i += 1) {
    html += '<div class="cal-day empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const mm = String(state.calendarMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${state.calendarYear}-${mm}-${dd}`;
    const dayLog = getDayStats(dateStr);
    const isStudied = state.studiedDays.includes(dateStr);
    const isToday = dateStr === todayStr;
    const fireCount = (state.dailyCompletions[dateStr] || []).length;

    const hoursStr =
      dayLog.hours > 0
        ? `<span class="cal-hours">${dayLog.hours.toFixed(1)}h</span>`
        : "";
    const firesStr =
      fireCount > 0
        ? `<span class="cal-fires">${"🔥".repeat(Math.min(fireCount, 5))}</span>`
        : "";
    const tip = [
      dateStr,
      fireCount > 0 ? `${fireCount} matéria(s) concluída(s)` : "",
      dayLog.hours > 0 ? `${dayLog.hours.toFixed(1)}h estudadas` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    html += `
      <div class="cal-day ${isStudied ? "studied" : ""} ${isToday ? "today" : ""}"
           onclick="toggleDate('${dateStr}')" title="${tip}">
        <span class="cal-day-num">${day}</span>
        ${hoursStr}${firesStr}
      </div>`;
  }

  grid.innerHTML = html;
}
