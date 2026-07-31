import { state, persistState } from "../core/state.js";
import { getStreak } from "./calendar.js";
import {
  getTotalHours,
  getTotalCompletions,
  getTodayCompletions,
} from "./planner.js";
import { showToast } from "./toast.js";

export const ALL_ACHIEVEMENTS = [
  {
    id: "first_msg",
    icon: "💬",
    name: "Primeira Conversa",
    desc: "Enviou sua primeira mensagem para o EstudaAI",
    secret: false,
  },
  {
    id: "msg_10",
    icon: "🗣️",
    name: "Estudante Ativo",
    desc: "Enviou 10 mensagens no chat",
    secret: false,
  },
  {
    id: "msg_50",
    icon: "📚",
    name: "Maratonista",
    desc: "Enviou 50 mensagens no chat",
    secret: false,
  },
  {
    id: "first_sub",
    icon: "📋",
    name: "Organizador",
    desc: "Adicionou sua primeira matéria no Planner",
    secret: false,
  },
  {
    id: "sub_5",
    icon: "🗂️",
    name: "Multi-matéria",
    desc: "Adicionou 5 matérias no Planner",
    secret: false,
  },
  {
    id: "goal_100",
    icon: "🎯",
    name: "Meta Alcançada!",
    desc: "Completou 100% de uma matéria",
    secret: false,
  },
  {
    id: "streak_3",
    icon: "🔥",
    name: "Sequência de Fogo",
    desc: "3 dias seguidos de estudo",
    secret: false,
  },
  {
    id: "streak_7",
    icon: "⚡",
    name: "Uma Semana Completa",
    desc: "7 dias seguidos de estudo",
    secret: false,
  },
  {
    id: "streak_30",
    icon: "🏅",
    name: "Mês de Ouro",
    desc: "30 dias seguidos de estudo",
    secret: true,
  },
  {
    id: "days_10",
    icon: "📅",
    name: "Dez Dias",
    desc: "10 dias de estudo registrados",
    secret: false,
  },
  {
    id: "days_50",
    icon: "🌟",
    name: "Cinquenta Dias",
    desc: "50 dias de estudo registrados",
    secret: false,
  },
  {
    id: "days_100",
    icon: "💎",
    name: "Centenário",
    desc: "100 dias de estudo registrados",
    secret: true,
  },
  {
    id: "first_completion",
    icon: "🔥",
    name: "Primeira Chama",
    desc: "Concluiu uma matéria pela primeira vez no dia",
    secret: false,
  },
  {
    id: "completions_10",
    icon: "🌋",
    name: "Em Chamas",
    desc: "Concluiu matérias em 10 ocasiões diferentes",
    secret: false,
  },
  {
    id: "completions_50",
    icon: "☀️",
    name: "Fênix em Pleno Voo",
    desc: "Concluiu matérias em 50 ocasiões — você é imparável!",
    secret: true,
  },
  {
    id: "all_subjects_day",
    icon: "👑",
    name: "Dia Perfeito",
    desc: "Concluiu todas as matérias no mesmo dia",
    secret: false,
  },
  {
    id: "hours_10",
    icon: "⏱️",
    name: "Dez Horas",
    desc: "Acumulou 10 horas de estudo registradas",
    secret: false,
  },
  {
    id: "hours_50",
    icon: "🕐",
    name: "Cinquenta Horas",
    desc: "Acumulou 50 horas de estudo registradas",
    secret: false,
  },
  {
    id: "hours_100",
    icon: "🏆",
    name: "Centenário de Horas",
    desc: "Acumulou 100 horas de estudo — você é incrível!",
    secret: true,
  },
];

function unlock(id) {
  if (state.achievements.includes(id)) return null;
  const achievement = ALL_ACHIEVEMENTS.find((item) => item.id === id);
  if (!achievement) return null;
  state.achievements.push(id);
  persistState();
  showToast(achievement.icon, "Conquista desbloqueada!", achievement.name);
  return achievement;
}

export function checkChatAchievements(messageCount) {
  if (messageCount >= 1) unlock("first_msg");
  if (messageCount >= 10) unlock("msg_10");
  if (messageCount >= 50) unlock("msg_50");
}

export function checkPlannerAchievements() {
  if (state.subjects.length >= 1) unlock("first_sub");
  if (state.subjects.length >= 5) unlock("sub_5");
  if (
    state.subjects.some(
      (subject) =>
        subject.doneHours >= subject.targetHours && subject.targetHours > 0,
    )
  ) {
    unlock("goal_100");
  }
}

export function checkCalendarAchievements() {
  const streak = getStreak();
  const total = state.studiedDays.length;
  if (streak >= 3) unlock("streak_3");
  if (streak >= 7) unlock("streak_7");
  if (streak >= 30) unlock("streak_30");
  if (total >= 10) unlock("days_10");
  if (total >= 50) unlock("days_50");
  if (total >= 100) unlock("days_100");
}

export function checkCompletionAchievements() {
  const total = getTotalCompletions();
  const todayIds = getTodayCompletions();
  if (total >= 1) unlock("first_completion");
  if (total >= 10) unlock("completions_10");
  if (total >= 50) unlock("completions_50");
  if (
    state.subjects.length >= 2 &&
    state.subjects.every((subject) => todayIds.includes(subject.id))
  ) {
    unlock("all_subjects_day");
  }
}

export function checkHoursAchievements() {
  const total = getTotalHours();
  if (total >= 10) unlock("hours_10");
  if (total >= 50) unlock("hours_50");
  if (total >= 100) unlock("hours_100");
}
