import express from "express";
import { contentUploadHandler, fileUploadHandler, urlUploadHandler } from "../controllers/embeddingController.js";
import { chatHandler } from "../controllers/chatController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Embedding routes
router.post("/content/upload", contentUploadHandler);
router.post("/file/upload", upload.single("pdf"), fileUploadHandler); // ✅ form-data
router.post("/url/upload", urlUploadHandler);

// Chat route
router.post("/chat", chatHandler);

export default router;
