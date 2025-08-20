import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import getVectorStore from "../../middleware/vectorStore.js";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
});

export default async function saveEmbedding(docs) {
  // Get the vector store instance
  const vectorStore = getVectorStore();
  // Add documents to the vector store
  await vectorStore.addDocuments(docs);
  console.log(`✅ Stored ${docs.length} documents in ragCollection`);
}
