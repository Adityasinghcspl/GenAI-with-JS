import { OpenAI } from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const generateResponse = async (userMessage, systemPrompt) => {
  const response = await client.chat.completions.create({
    model: "gemini-1.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
  });

  return response.choices[0].message;
};

export default generateResponse;