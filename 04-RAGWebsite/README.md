# 🤖 Notebook AI Chat Backend  
_A Google Gemini API-powered chat backend with OpenAI compatibility and MongoDB storage_

[![Made with Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Google Gemini API](https://img.shields.io/badge/Gemini%20API-Latest-orange?logo=google)](https://aistudio.google.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-brightgreen?logo=mongodb)](https://www.mongodb.com/)

---

## 📖 About  
This is the **backend service** for the **Notebook AI Chat Application**.  
It provides an API powered by **Google Gemini AI** with **OpenAI-compatible endpoints** and stores all chats & user data in **MongoDB**.  

---

## ✨ Features
- 💬 **AI Chat API** — Talk to AI through Google Gemini.  
- 🛠 **OpenAI-Compatible Endpoints** — Works as a drop-in replacement for OpenAI APIs.  
- 📦 **MongoDB Storage** — All conversations and user data are persisted.  
- 🔒 **Secure API Keys** — Environment variable support with `.env`.  
- ⚡ **Node.js Express Server** — Fast and lightweight backend.  

---

## 📦 Tech Stack
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Atlas or local)  
- **AI Models:** Google Gemini API (OpenAI-compatible)  
- **Utilities:** dotenv, mongoose, axios  

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Adityasinghcspl/GenAI-with-JS.git
cd 04-RAGWebsite/server
```

### 2️⃣ Install Dependencies
``` bash
npm install
```

### 3️⃣ Configure Environment Variables
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4️⃣ Start the Server
```bash 
npm run dev
```
### 💬 Usage

All chats are stored in MongoDB.

API endpoints can be used just like OpenAI API but are powered by Google Gemini.

Ready for integration with any frontend (React, Vue, mobile apps, etc).

### Also shared the postman collection