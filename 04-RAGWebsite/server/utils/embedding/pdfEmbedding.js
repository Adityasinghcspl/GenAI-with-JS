import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import saveEmbedding from "./saveEmbedding.js";

export default async function processPDFEmbedding(pdfBuffer) {
  // Convert Buffer -> Blob
  const blob = new Blob([pdfBuffer], { type: "application/pdf" });
  const loader = new PDFLoader(blob);

  const docs = await loader.load();
  console.log(`✅ Loaded ${docs.length} pages from uploaded PDF`);

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  await saveEmbedding(splitDocs);
}
