export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function currentYM() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function makeYM(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function ensureLogEntry(state, dateKey) {
  if (!state.studyLog[dateKey]) {
    state.studyLog[dateKey] = { hours: 0, completions: 0, subjects: [] };
  }
  return state.studyLog[dateKey];
}

export function ensureHoursEntry(state, ym, subjectId) {
  if (!state.hoursLog[ym]) state.hoursLog[ym] = {};
  if (!state.hoursLog[ym][String(subjectId)])
    state.hoursLog[ym][String(subjectId)] = 0;
  return state.hoursLog[ym];
}
