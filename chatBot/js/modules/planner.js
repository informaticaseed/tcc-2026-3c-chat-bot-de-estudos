import { state, persistState } from "../core/state.js";
import {
  todayKey,
  currentYM,
  ensureHoursEntry,
  ensureLogEntry,
} from "../core/utils.js";

export function getSubjectMonthHours(subjectId, ym) {
  return (state.hoursLog[ym] || {})[String(subjectId)] || 0;
}

export function getSubjectTotalHours(subjectId) {
  return Object.values(state.hoursLog).reduce(
    (acc, monthMap) => acc + (monthMap[String(subjectId)] || 0),
    0,
  );
}

export function getMonthHours(ym) {
  const monthMap = state.hoursLog[ym] || {};
  return Object.values(monthMap).reduce((acc, value) => acc + value, 0);
}

export function getYearHours(year) {
  return Object.entries(state.hoursLog)
    .filter(([ym]) => ym.startsWith(String(year) + "-"))
    .reduce(
      (acc, [, monthMap]) =>
        acc + Object.values(monthMap).reduce((a, v) => a + v, 0),
      0,
    );
}

export function getTotalHours() {
  return Object.values(state.hoursLog).reduce(
    (acc, monthMap) => acc + Object.values(monthMap).reduce((a, v) => a + v, 0),
    0,
  );
}

export function getTotalStudiedDays() {
  return state.studiedDays.length;
}

export function getTotalCompletions() {
  return Object.values(state.dailyCompletions).reduce(
    (acc, list) => acc + list.length,
    0,
  );
}

export function getTodayHours() {
  return (state.studyLog[todayKey()] || {}).hours || 0;
}

export function getTodayCompletions() {
  return state.dailyCompletions[todayKey()] || [];
}

export function getTodayFireCount() {
  return getTodayCompletions().length;
}

export function getDayStats(dateKey) {
  return state.studyLog[dateKey] || { hours: 0, completions: 0, subjects: [] };
}

export function getStudySummary() {
  const now = new Date();
  return {
    totalHours: getTotalHours(),
    totalDays: getTotalStudiedDays(),
    totalCompletions: getTotalCompletions(),
    monthHours: getMonthHours(currentYM()),
    yearHours: getYearHours(now.getFullYear()),
    hoursLog: { ...state.hoursLog },
    completionsByDay: { ...state.dailyCompletions },
    studyLog: { ...state.studyLog },
  };
}

export function addSubject(name, hours, days, color) {
  state.subjects.push({
    id: Date.now(),
    name,
    targetHours: hours,
    doneHours: 0,
    days,
    color,
  });
  persistState();
}

export function removeSubject(id) {
  state.subjects = state.subjects.filter((subject) => subject.id !== id);

  Object.keys(state.hoursLog).forEach((ym) => {
    delete state.hoursLog[ym][String(id)];
  });

  Object.keys(state.dailyCompletions).forEach((dateKey) => {
    const before = state.dailyCompletions[dateKey];
    const after = before.filter((subjectId) => subjectId !== id);
    if (after.length !== before.length) {
      state.dailyCompletions[dateKey] = after;
      const entry = state.studyLog[dateKey];
      if (entry) {
        entry.completions = after.length;
        entry.subjects = (entry.subjects || []).filter(
          (subjectId) => subjectId !== id,
        );
      }
    }
  });

  persistState();
}

export function recordHours(subjectId, newMonthH) {
  const subject = state.subjects.find((s) => s.id === subjectId);
  if (!subject) return;

  const ym = currentYM();
  const monthMap = ensureHoursEntry(state, ym, subjectId);
  const prevMonth = monthMap[String(subjectId)] || 0;
  const delta = newMonthH - prevMonth;
  if (delta === 0) return;

  monthMap[String(subjectId)] = Math.max(0, newMonthH);
  subject.doneHours = Object.values(state.hoursLog).reduce(
    (acc, mm) => acc + (mm[String(subjectId)] || 0),
    0,
  );

  const today = todayKey();
  const entry = ensureLogEntry(state, today);
  entry.hours = Math.max(0, (entry.hours || 0) + delta);

  if (entry.hours > 0 && !state.studiedDays.includes(today)) {
    state.studiedDays.push(today);
  }

  if (entry.hours === 0) {
    const idx = state.studiedDays.indexOf(today);
    if (idx > -1 && getTodayFireCount() === 0) {
      state.studiedDays.splice(idx, 1);
    }
  }

  persistState();
}

export function updateDone(id, value) {
  recordHours(id, Math.max(0, parseFloat(value) || 0));
}

export function toggleDailyCompletion(subjectId) {
  const key = todayKey();
  const list = state.dailyCompletions[key]
    ? [...state.dailyCompletions[key]]
    : [];
  const index = list.indexOf(subjectId);
  const removing = index > -1;
  const entry = ensureLogEntry(state, key);

  if (removing) {
    list.splice(index, 1);
    entry.completions = Math.max(0, (entry.completions || 0) - 1);
    entry.subjects = (entry.subjects || []).filter((id) => id !== subjectId);
  } else {
    list.push(subjectId);
    entry.completions = (entry.completions || 0) + 1;
    entry.subjects = entry.subjects || [];
    if (!entry.subjects.includes(subjectId)) entry.subjects.push(subjectId);
    if (!state.studiedDays.includes(key)) state.studiedDays.push(key);
  }

  state.dailyCompletions[key] = list;
  entry.completions = list.length;
  persistState();
  return removing;
}
