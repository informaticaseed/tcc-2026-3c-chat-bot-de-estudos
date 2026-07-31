import { renderPlanner } from "./renderPlanner.js";
import { renderCalendar } from "./renderCalendar.js";
import { renderAchievements } from "./renderAchievements.js";
import { renderHistory } from "./renderHistory.js";

export function switchTab(tab) {
  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => panel.classList.remove("active"));

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((item) => item.classList.remove("active"));

  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`${tab}-panel`)?.classList.add("active");

  const idx = [
    "chat",
    "planner",
    "calendar",
    "achievements",
    "history",
  ].indexOf(tab);
  if (tabs[idx]) tabs[idx].classList.add("active");
  if (navBtns[idx]) navBtns[idx].classList.add("active");

  if (tab === "planner") renderPlanner();
  if (tab === "calendar") renderCalendar();
  if (tab === "achievements") renderAchievements();
  if (tab === "history") renderHistory();
}
