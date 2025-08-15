# 🤖 AI Chat Application  
_A Google Gemini API-powered chat app with OpenAI compatibility_

[![Made with Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Made with React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Google Gemini API](https://img.shields.io/badge/Gemini%20API-Latest-orange?logo=google)](https://aistudio.google.com/)


A modern, animated **AI chat application** where you can talk to multiple AI buddies.  
Built with **React.js** on the frontend, **Node.js** on the backend, and powered by **Google Gemini API** with **OpenAI API compatibility**.

---

## ✨ Features
- 💬 **Multiple AI Buddies** — Switch between personalities instantly.
- ⚡ **Fast Responses** — Powered by Google Gemini AI.
- 🎨 **Beautiful UI** — Tailwind CSS + Framer Motion animations.
- 🔌 **OpenAI-Compatible API** — Drop-in replacement for OpenAI apps.
- 🔒 **Secure API Key Handling** — Environment variables with `.env`.
- 📱 **Responsive Design** — Works on desktop & mobile.



## 📦 Tech Stack
**Frontend**
- React.js
- Tailwind CSS
- Framer Motion

**Backend**
- Node.js
- Express.js
- Google Gemini API (OpenAI-compatible)

**Other Tools**
- dotenv for environment variables
- nodemon for development
- axios for API requests

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Adityasinghcspl/GenAI-with-JS.git
cd Persona-AI
```
### 2️⃣ Get Your Gemini API Key
🔑 To connect with Google Gemini API, you’ll need an API key.  

1️⃣ Go to **[Google AI Studio](https://aistudio.google.com/apikey)**.  
2️⃣ **Sign in** with your Google account.  
3️⃣ Click **"Create API Key"**.  
4️⃣ **Copy** the API key and keep it safe — you’ll paste it into your `.env` file later. 
```base
GEMINI_API_KEY=your_api_key_here
```

### 3️⃣ Setup the Backend
```bash
cd server
npm install
npm run dev
```
Your backend should now be running at http://localhost:5000.

### 4️⃣ Setup the Frontend
```bash
cd client
npm install
npm run dev
```
The frontend should now be available at http://localhost:5173.

## 💬 How to Use

- Start both backend and frontend servers.

- Open the frontend in your browser.

- Choose an AI buddy from the list.

- Start chatting! 🤖