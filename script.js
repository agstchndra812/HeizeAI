const workerUrl = "https://ai-chat-proxy.mrchandra310806.workers.dev/"; // Ganti sesuai workermu

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

// Chat hanya di memory, hilang saat refresh
let conversationHistory = [
  { role: "system", content: "Kamu adalah HeizeAI, asisten AI yang ramah dan membantu." }
];

// Event click & enter
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Tambahkan pesan user
  addMessage("user", text);
  conversationHistory.push({ role: "user", content: text });
  userInput.value = "";

  // Tampilkan animasi typing
  typing.classList.remove("hidden");
  scrollChatToBottom();

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationHistory
      }),
    });

    const data = await response.json();
    typing.classList.add("hidden");

    let aiReply =
      data?.choices?.[0]?.message?.content ||
      data?.response?.choices?.[0]?.message?.content ||
      data?.result?.choices?.[0]?.message?.content ||
      data?.message ||
      "AI lagi sibuk, mohon ditunggu, maklum gratisan wok.";

    addMessage("ai", aiReply);
    conversationHistory.push({ role: "assistant", content: aiReply });

  } catch (error) {
    typing.classList.add("hidden");
    addMessage("ai", "Gagal menghubungi server.");
  }
}
