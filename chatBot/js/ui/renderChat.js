import { state } from "../core/state.js";

export function renderCurrentChat() {
  const wrap = document.getElementById("messages");
  if (!wrap) return;
  wrap.innerHTML = "";
  state.currentChat.forEach((message, index) =>
    appendMsg(message.role, message.content, index),
  );
}

export function appendMsg(role, text, index = null) {
  const wrap = document.getElementById("messages");
  if (!wrap) return null;

  const div = document.createElement("div");
  div.className = "msg " + role;
  let editBtn = "";
  if (role === "user" && index !== null) {
    editBtn = `<button onclick="editMessage(${index})" class="edit-msg-btn" title="Editar">✏️</button>`;
  }

  div.innerHTML = `
    <div class="msg-avatar">${
      role === "ai"
        ? '<img src="./assets/images/fenix.png" alt="Phynix" class="avatar-fenix">'
        : "👤"
    }</div>
    <div class="msg-bubble">${text.replace(/\n/g, "<br>")}${editBtn}</div>`;

  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return div;
}

export function appendTyping() {
  const wrap = document.getElementById("messages");
  if (!wrap) return null;

  const div = document.createElement("div");
  div.className = "msg ai";
  div.innerHTML = `
    <div class="msg-avatar"><img src="./assets/images/fenix.png" alt="Phynix" class="avatar-fenix"></div>
    <div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;

  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return div;
}
