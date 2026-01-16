const chatMessages = document.getElementById("chatMessages")
const chatInput = document.getElementById("chatInput")
const sendBtn = document.getElementById("sendBtn")

let isComposing = false

chatInput.addEventListener("compositionstart", () => {
  isComposing = true
})

chatInput.addEventListener("compositionend", () => {
  isComposing = false
})

function addMessage(text, who) {
  const div = document.createElement("div")
  div.className = `message ${who}`
  div.textContent = text
  chatMessages.appendChild(div)

  // 방금 올린 채팅이 바로 보이게 자동스크롤
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return

  addMessage(text, "user")
  chatInput.value = ""
  chatInput.focus()

  // 테스트용 응답
  setTimeout(() => {
    addMessage("오케이, 지금 말투/속도/억양 분석 시작할게", "ai")
  }, 400)
}

// 버튼 클릭
sendBtn.addEventListener("click", sendMessage)

// 엔터키 전송
chatInput.addEventListener("keydown", (e) => {
  // Korean IME 입력 중 Enter를 누르면 keydown이 먼저 잡혀서 글자가 꼬이거나 중복 전송되는 경우가 있음
  if (e.key !== "Enter") return
  if (isComposing || e.isComposing) return

  e.preventDefault()
  sendMessage()
})
chatMessages.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" })