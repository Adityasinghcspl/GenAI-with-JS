# 🤖 AI-Powered Website Cloner CLI

A Node.js CLI tool to clone websites locally using AI assistance (Gemini AI or Perplexity AI).  
You can select which AI to use for the scraping process, enter the website URL, and provide a folder name for output.

---

## Features

- Clone a website page with all assets (images, CSS, JS, videos).  
- Handles Next.js image proxies automatically.  
- AI-assisted scraping using:
  - **Gemini AI**
  - **Perplexity AI**
- Organizes assets into folders (`img`, `js`, `css`, `videos`).  
- Limit concurrent downloads for performance.  
- Output folder is created inside `clone/` directory.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Adityasinghcspl/GenAI-with-JS.git
cd AI-Website-Cloner
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
### 3️⃣ Get Your Perplexity API Key
🔑 To connect with Google Gemini API, you’ll need an API key.  

1️⃣ Go to **[perplexity](https://www.perplexity.ai/account/api/keys)**.  
2️⃣ **Sign in** with your Google account.  
3️⃣ Click **"Create API Key"**.  
4️⃣ **Copy** the API key and keep it safe — you’ll paste it into your `.env` file later. 
```base
PERPLEXITY_API_KEY=your_api_key_here
```

### 4️⃣ how to run
```bash
npm install
node index.js
```

## Demo Video url
```
https://jumpshare.com/s/wfx6fGfuOILYTIEP3JBS
```
