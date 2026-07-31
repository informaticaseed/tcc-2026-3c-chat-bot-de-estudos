import { state } from "../core/state.js";

export function getChatHistory() {
  return state.chatHistory;
}

export function loadChat(id) {
  const session = state.chatHistory.find((item) => item.id === id);
  if (!session) return null;
  state.currentChat = [...session.messages];
  state.currentChatId = session.id;
  return session;
}
