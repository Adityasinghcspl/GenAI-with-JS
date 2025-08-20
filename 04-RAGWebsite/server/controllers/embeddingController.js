import processContentEmbedding from "../utils/embedding/contentEmbedding.js";
import processPDFEmbedding from "../utils/embedding/pdfEmbedding.js";
import processURLEmbedding from "../utils/embedding/urlEmbedding.js";

export const contentUploadHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    await processContentEmbedding(message);
    res.json({ success: true, message: "✅ Content embedded successfully" });
  } catch (error) {
    console.error("Content Embedding Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fileUploadHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    // req.file.buffer contains file data (since we use memoryStorage)
    await processPDFEmbedding(req.file.buffer);

    res.json({ success: true, message: "✅ PDF embedded successfully" });
  } catch (error) {
    console.error("File Embedding Error:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const urlUploadHandler = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    await processURLEmbedding(url);
    res.json({ success: true, message: "✅ URL embedded successfully" });
  } catch (error) {
    console.error("URL Embedding Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
