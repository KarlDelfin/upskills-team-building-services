import './assets/main.css'
import { createApp } from 'vue'
import ChatWidget from './components/ChatWidget.vue'

function mountWidget() {
  const targetId = 'chatbot'
  let el = document.getElementById(targetId)

  if (!el) {
    el = document.createElement('div')
    el.id = targetId
    document.body.appendChild(el)
  }

  createApp(ChatWidget).mount(el)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget)
} else {
  mountWidget()
}