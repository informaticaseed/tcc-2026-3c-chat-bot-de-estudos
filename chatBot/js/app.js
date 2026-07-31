import { initializeApp } from "./core/init.js";
import { state } from "./core/state.js";
import { renderPlanner } from "./ui/renderPlanner.js";
import { renderCalendar } from "./ui/renderCalendar.js";
import { renderAchievements } from "./ui/renderAchievements.js";
import { renderHistory } from "./ui/renderHistory.js";
import { renderCurrentChat } from "./ui/renderChat.js";
import { updateFireDisplay } from "./ui/sidebar.js";
import { switchTab } from "./ui/appShell.js";
import {
  startNewChat,
  sendQuick,
  sendMessage,
  editMessage,
  handleKey,
  loadChat,
} from "./modules/chat.js";
import {
  addSubject,
  removeSubject,
  recordHours,
  toggleDailyCompletion,
  getTodayFireCount,
} from "./modules/planner.js";
import {
  changeMonth as changeCalendarMonth,
  toggleDate as toggleCalendarDate,
  markToday as markTodayStudy,
} from "./modules/calendar.js";
import {
  checkPlannerAchievements,
  checkCompletionAchievements,
  checkCalendarAchievements,
  checkHoursAchievements,
} from "./modules/achievements.js";
import { openGoalModal, closeModal, saveGoal } from "./modules/modal.js";
import { showToast } from "./modules/toast.js";

function handleAddSubject() {
  const nameEl = document.getElementById("inp-subject");
  const hoursEl = document.getElementById("inp-hours");
  const daysEl = document.getElementById("inp-days");
  const colorEl = document.getElementById("inp-color");

  const name = nameEl?.value.trim();
  const hours = parseFloat(hoursEl?.value);
  const days = daysEl?.value.trim() || "5";
  const color = colorEl?.value || "#4f8aff";

  if (!name || !hours) {
    showToast(
      "⚠️",
      "Campos obrigatórios",
      "Preencha a matéria e a meta de horas.",
    );
    return;
  }

  addSubject(name, hours, days, color);
  if (nameEl) nameEl.value = "";
  if (hoursEl) hoursEl.value = "";

  renderPlanner();
  checkPlannerAchievements();
  showToast(
    "📚",
    "Matéria adicionada!",
    `${name} foi adicionada ao seu planner.`,
  );
}

function handleRemoveSubject(id) {
  removeSubject(id);
  renderPlanner();
  renderCalendar();
  updateFireDisplay(getTodayFireCount());
  checkPlannerAchievements();
  checkCalendarAchievements();
}

function handleUpdateDone(id, value) {
  const newValue = Math.max(0, parseFloat(value) || 0);
  recordHours(id, newValue);
  renderPlanner();
  renderCalendar();
  updateFireDisplay(getTodayFireCount());
  checkHoursAchievements();
  checkPlannerAchievements();
  checkCalendarAchievements();
}

function handleToggleDailyCompletion(subjectId) {
  const removed = toggleDailyCompletion(subjectId);
  const subject = state.subjects.find((item) => item.id === subjectId);

  if (subject) {
    if (!removed) {
      showToast(
        "🔥",
        "Matéria concluída!",
        `${subject.name} marcada como feita hoje.`,
      );
    } else {
      showToast(
        "↩️",
        "Desmarcada",
        `${subject.name} removida das conclusões de hoje.`,
      );
    }
  }

  renderPlanner();
  renderCalendar();
  updateFireDisplay(getTodayFireCount());
  checkCompletionAchievements();
  checkCalendarAchievements();
}

function handleChangeMonth(direction) {
  changeCalendarMonth(direction);
  renderCalendar();
}

function handleToggleDate(dateStr) {
  toggleCalendarDate(dateStr);
  renderCalendar();
  checkCalendarAchievements();
}

function handleMarkToday() {
  const marked = markTodayStudy();
  if (marked) {
    showToast("✅", "Dia marcado!", "Hoje foi registrado no seu histórico.");
  } else {
    showToast("💡", "Já marcado", "Você já marcou os estudos de hoje!");
  }
  renderCalendar();
  checkCalendarAchievements();
}

function attachGlobals() {
  window.switchTab = switchTab;
  window.startNewChat = startNewChat;
  window.sendQuick = sendQuick;
  window.sendMessage = sendMessage;
  window.editMessage = editMessage;
  window.handleKey = handleKey;
  window.loadChat = loadChat;
  window.addSubject = handleAddSubject;
  window.removeSubject = handleRemoveSubject;
  window.updateDone = handleUpdateDone;
  window.toggleDailyCompletion = handleToggleDailyCompletion;
  window.changeMonth = handleChangeMonth;
  window.toggleDate = handleToggleDate;
  window.markToday = handleMarkToday;
  window.openGoalModal = openGoalModal;
  window.closeModal = closeModal;
  window.saveGoal = saveGoal;
}

function initialize() {
  initializeApp();
  attachGlobals();
  renderCurrentChat();
  renderPlanner();
  renderCalendar();
  renderAchievements();
  renderHistory();
  updateFireDisplay(getTodayFireCount());
}

initialize();
