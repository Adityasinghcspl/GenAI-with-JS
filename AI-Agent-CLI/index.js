import 'dotenv/config';
import readline from 'readline';
import GeminiAI from './aiClients/gemini.js';
import PerplexityAI from './aiClients/perplexity.js';

// ✅ CLI helper
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

// ✅ Main function
async function main() {
  let aiChoice;

  while (true) {
    console.log("\nWhich AI do you want to use?");
    console.log("1. Gemini");
    console.log("2. Perplexity");
    console.log("3. Exit");

    aiChoice = await askQuestion("👉 Enter choice (1, 2 or 3): ");

    if (aiChoice === "1" || aiChoice === "2") break;
    if (aiChoice === "3") {
      console.log("👋 Exiting...");
      process.exit(0);
    }

    console.log("❌ Invalid choice. Please select 1, 2, or 3.\n");
  }

  const url = await askQuestion("🌐 Enter website URL: ");
  const folder = await askQuestion("📂 Enter folder name to save cloned site: ");

  console.log(`✅ AI: ${aiChoice === "1" ? "Gemini" : "Perplexity"}, URL: ${url}, Folder: ${folder}`);

  // Call corresponding AI function
  if (aiChoice === "1") {
    await GeminiAI(url, folder);
  } else {
    await PerplexityAI(url, folder);
  }
}

// ✅ Call main function
main();
