import 'dotenv/config';
import { OpenAI } from 'openai';
import cloneWebsite from '../websiteCloner.js';

export const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ✅ Tool map
const TOOL_MAP = {
  cloneWebsite: async ({ url, folder }) => {
    if (!url) throw new Error("❌ Missing URL");
    await cloneWebsite(url, folder || "cloned_site");
    return `🎯 Website cloned successfully into folder: clone/${folder}`;
  },
};

// helper to call Gemini
export default async function GeminiAI(url, folder) {
  const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputting the final result to user you must check once if everything is correct.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, and OUTPUT.
    - After every THINK, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.

    Output JSON Format:
    { "step": "START | THINK | OUTPUT", "content": "string" }
  `;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Clone the website ${url} into folder ${folder}` },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages,
      response_format: { type: "json_object" }
    });

    const choice = response.choices[0];
    const rawContent = choice.message?.content ?? null;

    if (!rawContent) {
      console.log("⚠️ Model returned no content:", JSON.stringify(choice, null, 2));
      break;
    }

    const parsedContent = JSON.parse(rawContent);

    if (parsedContent.step === "START") {
      console.log(`🔥 ${parsedContent.content}`);
      messages.push({ role: "assistant", content: rawContent });
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log(`\t🧠 ${parsedContent.content}`);
      messages.push({ role: "assistant", content: rawContent });
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖 ${parsedContent.content}`);

      // Run the actual tool
      console.log("🔧 Running tool: cloneWebsite...");
      const result = await TOOL_MAP.cloneWebsite({ url, folder });
      console.log("✅ Tool result:", result);
      break;
    }
  }
  console.log("✅ Done");
}
