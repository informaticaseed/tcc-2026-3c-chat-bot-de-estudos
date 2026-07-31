import { state, persistState } from "../core/state.js";
import { todayKey } from "../core/utils.js";

export function changeMonth(direction) {
  state.calendarMonth += direction;
  if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear += 1;
  } else if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear -= 1;
  }
}

export function getStreak() {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    if (state.studiedDays.includes(key)) {
      streak += 1;
    } else {
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}

export function toggleDate(dateStr) {
  const index = state.studiedDays.indexOf(dateStr);
  if (index > -1) {
    state.studiedDays.splice(index, 1);
  } else {
    state.studiedDays.push(dateStr);
  }
  persistState();
  return state.studiedDays.includes(dateStr);
}

export function markToday() {
  const today = todayKey();
  if (!state.studiedDays.includes(today)) {
    state.studiedDays.push(today);
    persistState();
    return true;
  }
  return false;
}
