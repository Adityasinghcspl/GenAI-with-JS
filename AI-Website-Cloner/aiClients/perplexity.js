import 'dotenv/config';
import { OpenAI } from 'openai';
import cloneWebsite from '../websiteCloner.js';

export const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

// ✅ Tool map
const TOOL_MAP = {
  cloneWebsite: async ({ url, folder }) => {
    if (!url) throw new Error("❌ Missing URL");
    await cloneWebsite(url, folder || "cloned_site");
    return `🎯 Website cloned successfully into folder: clone/${folder}`;
  },
};

// helper to call Perplexity
export default async function PerplexityAI(url, folder) {
  const SYSTEM_PROMPT = `
    You are an AI agent that uses tools. 
    Always respond in **valid JSON** format like this:

    {
      "tool_name": "cloneWebsite",
      "input": { "url": "https://example.com", "folder": "clone-folder" }
    }

    If the task is completed, just respond with:
    { "done": true }
  `;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Clone the website ${url} into folder ${folder}` }
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages
    });

    let rawContent = response.choices[0].message.content;
    let parsedContent;

    try {
      parsedContent = JSON.parse(rawContent);
    } catch (err) {
      console.warn("⚠️ Invalid JSON from model, repairing...");
      try {
        parsedContent = JSON.parse(jsonrepair(rawContent));
      } catch (repairErr) {
        console.error("❌ Could not parse model output:", rawContent);
        break; // stop loop if unrecoverable
      }
    }

    const { tool_name, input, done } = parsedContent;

    if (done) {
      console.log("✅ AI agent finished all tasks.");
      break;
    }

    if (!tool_name || !TOOL_MAP[tool_name]) {
      console.log("🤖 Unknown or missing tool:", parsedContent);
      break;
    }

    console.log(`🔧 Running tool: ${tool_name} with input`, input);

    try {
      const result = await TOOL_MAP[tool_name](input);
      console.log("✅ Tool result:", result);

      // Tell model task is done, so it replies with { "done": true }
      messages.push({ role: "assistant", content: rawContent });
      messages.push({ role: "user", content: `Task completed successfully. Respond with {"done": true}` });
    } catch (err) {
      console.error("❌ Tool error:", err.message);
      break;
    }
  }
}
