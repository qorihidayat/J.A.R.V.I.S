# 🧠 J.A.R.V.I.S.

> **Just A Reliable Virtual Intelligence System**

A modular local AI Agent built with Node.js.

J.A.R.V.I.S. is designed to be more than just a chatbot.
It can understand your workspace, remember long-term information, automate tasks, edit files, work with Excel, interact with external tools, and eventually support voice, vision, and desktop automation.

---

## ✨ Features

- 💬 Friendly AI Assistant
- 🧠 Long-term Memory
- 📖 Conversation History
- 📂 Workspace Understanding
- 📄 File Read / Write
- 📊 Excel Agent
- 🧪 Playwright Agent
- 🔍 Search Agent
- 🤖 Tool Calling
- ⚙️ Multi-Agent Architecture
- 🏠 Local LLM Support (LM Studio, Ollama, etc.)

---

## 🚀 Upcoming Features

- 🎤 Voice Assistant (STT + TTS)
- 👀 Vision Agent
- 🌐 Internet Search
- 📑 PDF Agent
- 📄 Word Agent
- 📊 PowerPoint Agent
- 🖥 Desktop Automation
- 🌍 Browser Automation
- 🎮 Game Agent
- 💡 Smart Home Integration
- 📧 Email Agent
- 📅 Calendar Agent
- 🔌 Plugin System

---

## 🏗 Architecture

```
User
   │
   ▼
Router
   │
   ├── Friendly Agent
   ├── Memory Agent
   ├── Workspace Agent
   ├── Excel Agent
   ├── Tool Agent
   └── ...
        │
        ▼
      Local LLM
        │
        ▼
      JSON Action
        │
        ▼
        Tool
```

---

## 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `@tools` | Create, edit, delete files & folders |
| `@workspace` | Read project files |
| `@excel` | Read & modify Excel |
| `@memory` | Read long-term memory |

---

## 🤖 Supported Models

- Qwen
- Gemma
- DeepSeek
- Llama
- GPT
- Claude
- Gemini

Any OpenAI-compatible endpoint is supported.

---

## 🧩 Tech Stack

- Node.js
- OpenAI SDK
- LM Studio
- JSON
- ExcelJS
- Playwright

---

## 📌 Vision

J.A.R.V.I.S. aims to become a complete local AI assistant capable of:

- Thinking
- Remembering
- Reading projects
- Automating workflows
- Writing code
- Editing documents
- Controlling applications
- Understanding images
- Speaking naturally
- Interacting with smart devices

---

## 📜 License

MIT License