import { loadState, saveState } from "./storage.js";

export const state = {
  subjects: [],
  hoursLog: {},
  studiedDays: [],
  achievements: [],
  chatHistory: [],
  dailyCompletions: {},
  studyLog: {},
  dailyGoalHours: 4,
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  currentChat: [],
  currentChatId: null,
};

export function initState() {
  const persisted = loadState();
  Object.assign(state, persisted);
  if (!state.currentChatId) state.currentChatId = Date.now();
}

export function persistState() {
  saveState(state);
}
