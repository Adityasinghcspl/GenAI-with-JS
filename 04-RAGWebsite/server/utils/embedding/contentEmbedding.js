import saveEmbedding from "./saveEmbedding.js";

export default async function processContentEmbedding(message) {
  const docs = [
    {
      pageContent: message,
      metadata: { source: "message_content" },
    },
  ];
  // Save embeddings
  await saveEmbedding(docs);
}
