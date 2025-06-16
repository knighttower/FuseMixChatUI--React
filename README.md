# ChatUI React

A modular, WebSocket-based chat interface built with **React**, designed for deployment both on the **web** and within an **Electron** desktop environment.

---

## 🚀 Features

* 🧠 AI-style chat interface with real-time WebSocket support
* 🧹 Modular design using Nanostores and EventBus
* 💬 Chat history saved with persistent local storage
* ⚙️ Dynamic WebSocket URL configuration via settings
* ♻️ Support for session resets and new chats
* 📝 Markdown rendering and HTML-to-Markdown conversion
* 💻 Deployable as a web app or desktop Electron app

---

## 💠 Technologies Used

* React (Functional Components + Hooks)
* PrimeReact (UI Components)
* Nanostores (State Management)
* Electron (Desktop runtime)
* Markdown-it + TurndownService (Markdown conversion)
* Custom event bus and utility modules from `knighttower`

---

## 📆 Project Structure

```
src/
├── components/
│   ├── ChatHistory.jsx
│   ├── InputBar.jsx
│   ├── Message.jsx
│   ├── Settings.jsx
│   └── Sidebar.jsx
├── modules/
│   └── chat.jsx
├── plugins/
│   └── HtmlToMarkdownPlugin.js
├── services/
│   └── busService.js
├── stores/
│   ├── AppSettings.js
│   └── ChatStore.js
├── app.jsx
├── main.cjs         # Electron main process
└── preload.cjs      # Electron preload script
```

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/knighttower/FuseMixChatUI
cd chatui-react

# Install dependencies
npm install
```

---

## 🚀 Running (Web)

```bash
# Run development server
npm run dev

# Build production assets
npm run build
```

---

## 💻 Running (Electron)

1. **Ensure Web build exists**

   ```bash
   npm run build
   ```

2. **Launch Electron**

   ```bash
   npm run electron
   ```

   This uses the contents of the `public/` folder including `index.html` and assets.

---

## ⚙️ WebSocket URL Setup

The app requires a valid WebSocket endpoint. Go to **Settings** (via sidebar) and enter a full `ws://` or `wss://` URL, e.g.:

```
wss://example.com/socket
```

This will persist across sessions via `localStorage`.

---

## 📂 Persistent Data

* **Chat History** is stored per `socketId` using `@nanostores/persistent`
* **Usage Data** (if needed) is similarly persisted
* All local data is cleared when starting a new session or manually resetting history

---

## 🔮 Development Tips

* Messages are converted from HTML to Markdown before being sent
* The component `<x-chat>` and `<x-sidebar>` are auto-mounted at runtime via `app.jsx`
* Copy buttons are auto-appended to assistant messages

---

## 🔐 Security Notes (Electron)

Make sure to set a proper `Content-Security-Policy` in production builds and avoid using `"unsafe-inline"` or `"unsafe-eval"` where possible. Electron warns if the policy is insecure.

---

## 📄 License

MIT License 


Folder: cd /e/DEVELOPMENT/FuseMix/FuseMix.ChatUI/HTML
