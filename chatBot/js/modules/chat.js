import { state, persistState } from "../core/state.js";
import { requestGroqReply } from "../api/groq.js";
import {
  appendMsg,
  appendTyping,
  renderCurrentChat,
} from "../ui/renderChat.js";
import { switchTab } from "../ui/appShell.js";
import { checkChatAchievements } from "./achievements.js";

let chatMsgCount = 0;

function archiveCurrentChat() {
  if (state.currentChat.length === 0) return;

  const existingIdx = state.chatHistory.findIndex(
    (h) => h.id === state.currentChatId,
  );
  const sessionData = {
    id: state.currentChatId || Date.now(),
    date: new Date().toLocaleString("pt-BR"),
    preview: (state.currentChat[0]?.content || "").substring(0, 40) + "...",
    messages: [...state.currentChat],
  };

  if (existingIdx > -1) state.chatHistory[existingIdx] = sessionData;
  else state.chatHistory.unshift(sessionData);
  persistState();
}

export function startNewChat() {
  if (state.currentChat.length > 0) archiveCurrentChat();
  state.currentChat = [];
  state.currentChatId = Date.now();
  renderCurrentChat();
}

export function sendQuick(text) {
  const inp = document.getElementById("user-input");
  if (!inp) return;
  inp.value = text;
  sendMessage();
}

export async function sendMessage() {
  const inp = document.getElementById("user-input");
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;

  inp.value = "";
  inp.style.height = "";

  const msgIndex = state.currentChat.length;
  appendMsg("user", text, msgIndex);
  state.currentChat.push({ role: "user", content: text });

  const typingEl = appendTyping();

  try {
    const reply = await requestGroqReply(state.currentChat);
    if (typingEl) typingEl.remove();

    appendMsg("ai", reply);
    state.currentChat.push({ role: "assistant", content: reply });
    archiveCurrentChat();
    const messageCount = incrementChatMessageCount();
    checkChatAchievements(messageCount);
  } catch (err) {
    if (typingEl) typingEl.remove();
    appendMsg("ai", "⚠️ Falha na conexão. Verifique sua internet.");
    console.error(err);
  }
}

export function editMessage(index) {
  const msg = state.currentChat[index];
  if (!msg || msg.role !== "user") return;

  const inp = document.getElementById("user-input");
  if (!inp) return;

  inp.value = msg.content;
  inp.focus();
  state.currentChat = state.currentChat.slice(0, index);
  renderCurrentChat();
}

export function handleKey(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

export function loadChat(id) {
  const session = state.chatHistory.find((h) => h.id === id);
  if (!session) return;
  state.currentChat = [...session.messages];
  state.currentChatId = session.id;
  switchTab("chat");
  renderCurrentChat();
}

export function getChatMessageCount() {
  return chatMsgCount;
}

export function incrementChatMessageCount() {
  chatMsgCount += 1;
  return chatMsgCount;
}
