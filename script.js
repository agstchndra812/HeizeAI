// GANTI URL INI DENGAN URL WORKER CLOUDFLARE KAMU
const workerUrl = "https://ai-chat-proxy.mrchandra310806.workers.dev/"; // <= WAJIB DIGANTI

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";
  typing.classList.remove("hidden");

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Kamu adalah HeizeAI, asisten AI yang ramah dan membantu." },
          { role: "user", content: text }
        ]
      }),
    });

    const data = await response.json();
    typing.classList.add("hidden");

    let aiReply =
      data?.choices?.[0]?.message?.content ||
      data?.response?.choices?.[0]?.message?.content ||
      data?.result?.choices?.[0]?.message?.content ||
      data?.message ||
      "Terjadi kesalahan membaca response dari server.";

    addMessage("ai", aiReply);

  } catch (error) {
    typing.classList.add("hidden");
    addMessage("ai", "Gagal menghubungi server.");
  }
}
