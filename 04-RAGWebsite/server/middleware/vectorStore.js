import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getDB } from "../config/dbConnection.js";

// Initialize Gemini embeddings (singleton)
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
});

export default function getVectorStore() {
  const db = getDB();
  const collection = db.collection("ragCollection"); // fixed collection

  return new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index", // must match Atlas Vector Search index
    textKey: "text",
    embeddingKey: "embedding",
  });
}
