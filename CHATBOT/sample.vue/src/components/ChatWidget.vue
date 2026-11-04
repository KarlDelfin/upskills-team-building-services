<template>
  <div data-lenis-prevent class="fixed bottom-6 right-6 z-[999999] font-sans antialiased text-slate-800">
    
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100dvh-6.5rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
      >
        <!-- Header -->
        <header class="bg-gradient-to-r from-orange-600 to-orange-700 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <img 
                src="data:image/png;base64,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" 
                alt="Upskills Team Building Services" 
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 class="font-bold text-sm tracking-wide text-white m-0 leading-tight">Upskills Team Building Services</h4>
              <p class="text-xs text-orange-100 m-0 leading-tight flex items-center gap-1 mt-0.5">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-1">
            <button
              type="button"
              @click="clearChat"
              class="text-white/80 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
              title="Clear Conversation"
              aria-label="Clear chat"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <button 
              type="button"
              @click="closeChat"
              class="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer focus:outline-none"
              aria-label="Close chat"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Message Body -->
        <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col space-y-3">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm',
              msg.role === 'user'
                ? 'bg-orange-600 text-white self-end rounded-br-xs'
                : 'bg-white text-slate-800 self-start border border-slate-200/70 rounded-bl-xs chat-content'
            ]"
          >
            <!-- User message rendered safely as text -->
            <span v-if="msg.role === 'user'">{{ msg.content }}</span>
            <!-- Bot message rendered with HTML support -->
            <span v-else v-html="msg.content"></span>
          </div>

          <!-- Typing Indicator -->
          <div 
            v-if="isLoading" 
            class="bg-white border border-slate-200/70 self-start px-4 py-3 rounded-2xl rounded-bl-xs text-xs text-slate-500 flex items-center space-x-1.5 shadow-sm"
          >
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
          </div>
        </div>

        <!-- Quick Reply Chips -->
        <div v-if="messages.length <= 2 && !isLoading" class="flex flex-wrap gap-1.5 px-3 py-2 bg-slate-100/70 border-t border-slate-200 shrink-0">
          <button
            v-for="chip in quickChips"
            :key="chip"
            type="button"
            @click="sendQuickPrompt(chip)"
            class="text-xs bg-white text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 px-2.5 py-1 rounded-full shadow-2xs transition-colors cursor-pointer"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Input Box -->
        <form @submit.prevent="sendMessage" class="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
          <input
            ref="inputField"
            v-model="inputMessage"
            type="text"
            placeholder="Ask about packages, quotes, venues..."
            class="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-800"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
            aria-label="Send message"
          >
            <svg class="w-4 h-4 transform rotate-90 translate-x-px" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </transition>

    <!-- Floating Bubble Launcher -->
    <button
      type="button"
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg hover:shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
      aria-label="Toggle chat"
    >
      <svg v-if="!isOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

const STORAGE_KEY = 'upskills_chat_messages'
const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Mabuhay! Welcome to <strong>Upskills Team Building Services</strong>. How many participants are you planning for?'
}

export default defineComponent({
  name: 'ChatWidget',

  data() {
    return {
      isOpen: false as boolean,
      isLoading: false as boolean,
      inputMessage: '' as string,
      functionUrl: 'https://ahvgybyokatmvyzedamy.supabase.co/functions/v1/chat' as string,
      messages: [] as ChatMessage[],
      quickChips: [
        'Packages Overview',
        'Quote for 50+ Pax',
        'Contact & Venues'
      ]
    }
  },

  mounted() {
    this.loadMessages()
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('storage', this.handleStorageEvent)
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('storage', this.handleStorageEvent)
  },

  methods: {
    handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat()
      }
    },

    handleStorageEvent(e: StorageEvent) {
      if (e.key === STORAGE_KEY && !e.newValue) {
        this.resetToDefault()
      }
    },

    loadMessages() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.messages = parsed
            return
          }
        }
      } catch (err) {
        console.warn('Could not read from localStorage:', err)
      }
      this.resetToDefault()
    },

    saveMessages() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages))
      } catch (err) {
        console.warn('Could not save to localStorage:', err)
      }
    },

    resetToDefault() {
      this.messages = [{ ...DEFAULT_WELCOME_MESSAGE }]
    },

    clearChat() {
      localStorage.removeItem(STORAGE_KEY)
      this.resetToDefault()
    },

    async toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        await this.scrollToBottom()
        this.focusInput()
      }
    },

    closeChat() {
      this.isOpen = false
    },

    sendQuickPrompt(chipText: string) {
      this.inputMessage = chipText
      this.sendMessage()
    },

    async sendMessage() {
      const text = this.inputMessage.trim()
      if (!text || this.isLoading) return

      this.messages.push({ role: 'user', content: text })
      this.saveMessages()
      this.inputMessage = ''
      this.isLoading = true
      await this.scrollToBottom()

      try {
        const response = await fetch(this.functionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: this.messages })
        })

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`)
        }

        const data = await response.json()
        const botReply = data.reply || data.message || 'Thanks for reaching out! You can call us directly at 0961-011-5585.'

        this.messages.push({
          role: 'assistant',
          content: botReply
        })
        this.saveMessages()
      } catch (err) {
        console.error('Chat error:', err)
        this.messages.push({
          role: 'assistant',
          content: 'I had trouble connecting. Feel free to call us at <strong>0961-011-5585</strong>!'
        })
        this.saveMessages()
      } finally {
        this.isLoading = false
        await this.scrollToBottom()
        this.focusInput()
      }
    },

    async scrollToBottom() {
      await this.$nextTick()
      const container = this.$refs.messagesContainer as HTMLDivElement | undefined
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    focusInput() {
      this.$nextTick(() => {
        const input = this.$refs.inputField as HTMLInputElement | undefined
        if (input) {
          input.focus()
        }
      })
    }
  }
})
</script>

<style scoped>
.chat-content :deep(strong),
.chat-content :deep(b) {
  font-weight: 700;
  color: #0f172a;
}

.chat-content :deep(ul) {
  list-style-type: disc;
  margin-left: 1.25rem;
  margin-top: 0.35rem;
  margin-bottom: 0.35rem;
}

.chat-content :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.25rem;
  margin-top: 0.35rem;
  margin-bottom: 0.35rem;
}

.chat-content :deep(li) {
  margin-bottom: 0.2rem;
}

.chat-content :deep(p) {
  margin-bottom: 0.5rem;
}

.chat-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>