import { state, persistState } from "../core/state.js";
import { showToast } from "./toast.js";

export function openGoalModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  const input = document.getElementById("goal-inp");
  if (input) input.value = state.dailyGoalHours;
  modal.classList.add("open");
}

export function closeModal() {
  document.getElementById("modal")?.classList.remove("open");
}

export function saveGoal() {
  const input = document.getElementById("goal-inp");
  if (!input) return;
  const value = parseInt(input.value, 10);
  if (!value || value < 1 || value > 24) {
    showToast("⚠️", "Valor inválido", "Informe entre 1 e 24 horas.");
    return;
  }
  state.dailyGoalHours = value;
  persistState();
  closeModal();
  showToast("🎯", "Meta salva!", `Sua meta diária é ${value}h de estudo.`);
}
