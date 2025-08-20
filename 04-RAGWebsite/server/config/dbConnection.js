import { MongoClient } from "mongodb";
import "dotenv/config";

let client;
let db;

export async function connectDB() {
  if (client && db) {
    return { client, db };
  }

  client = new MongoClient(process.env.MONGO_URI); // ✅ no extra options
  await client.connect();

  db = client.db(process.env.DB_NAME);

  console.log("✅ MongoDB connected:", process.env.DB_NAME);

  return { client, db };
}

export function getDB() {
  if (!db) {
    throw new Error("❌ Database not initialized. Call connectDB() first.");
  }
  return db;
}

export function getClient() {
  if (!client) {
    throw new Error("❌ MongoClient not initialized. Call connectDB() first.");
  }
  return client;
}
