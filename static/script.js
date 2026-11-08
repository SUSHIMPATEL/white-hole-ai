const form = document.getElementById("chatForm");
const promptBox = document.getElementById("prompt");
const messagesEl = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");
const history = [];

function addMessage(role, content, extraClass = "") {
  welcome.style.display = "none";
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`.trim();
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "S" : "W";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  row.append(avatar, bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

async function sendMessage(text) {
  const message = text.trim();
  if (!message || sendBtn.disabled) return;
  promptBox.value = "";
  promptBox.style.height = "auto";
  history.push({ role: "user", content: message });
  addMessage("user", message);
  const waiting = addMessage("assistant", "WHITE HOLE is thinking...", "typing");
  sendBtn.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    waiting.textContent = data.reply;
    waiting.parentElement.classList.remove("typing");
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    waiting.textContent = "⚠ " + error.message;
    waiting.parentElement.classList.remove("typing");
  } finally {
    sendBtn.disabled = false;
    promptBox.focus();
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(promptBox.value);
});
promptBox.addEventListener("input", () => {
  promptBox.style.height = "auto";
  promptBox.style.height = Math.min(promptBox.scrollHeight, 150) + "px";
});
promptBox.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.textContent));
});
document.getElementById("newChat").addEventListener("click", () => {
  history.length = 0;
  messagesEl.replaceChildren();
  welcome.style.display = "";
  promptBox.value = "";
  document.getElementById("sidebar").classList.remove("open");
  promptBox.focus();
});
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});
