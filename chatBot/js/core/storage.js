import { STORAGE_KEYS } from "./constants.js";

export function loadState() {
  return {
    subjects: JSON.parse(localStorage.getItem(STORAGE_KEYS.subjects) || "[]"),
    hoursLog: JSON.parse(localStorage.getItem(STORAGE_KEYS.hoursLog) || "{}"),
    studiedDays: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.studiedDays) || "[]",
    ),
    achievements: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.achievements) || "[]",
    ),
    chatHistory: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.chatHistory) || "[]",
    ),
    dailyCompletions: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.dailyCompletions) || "{}",
    ),
    studyLog: JSON.parse(localStorage.getItem(STORAGE_KEYS.studyLog) || "{}"),
    dailyGoalHours: parseInt(
      localStorage.getItem(STORAGE_KEYS.dailyGoalHours) || "4",
      10,
    ),
  };
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(state.subjects));
  localStorage.setItem(STORAGE_KEYS.hoursLog, JSON.stringify(state.hoursLog));
  localStorage.setItem(
    STORAGE_KEYS.studiedDays,
    JSON.stringify(state.studiedDays),
  );
  localStorage.setItem(
    STORAGE_KEYS.achievements,
    JSON.stringify(state.achievements),
  );
  localStorage.setItem(
    STORAGE_KEYS.chatHistory,
    JSON.stringify(state.chatHistory),
  );
  localStorage.setItem(
    STORAGE_KEYS.dailyCompletions,
    JSON.stringify(state.dailyCompletions),
  );
  localStorage.setItem(STORAGE_KEYS.studyLog, JSON.stringify(state.studyLog));
  localStorage.setItem(STORAGE_KEYS.dailyGoalHours, state.dailyGoalHours);
}
