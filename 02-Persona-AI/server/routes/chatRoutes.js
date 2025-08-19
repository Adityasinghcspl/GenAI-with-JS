import express from 'express';
import { hiteshPromptHandler, piyushPromptHandler } from '../controllers/chatController.js';

const router = express.Router();

// Hitesh route
router.post('/hitesh', hiteshPromptHandler);
// Piyush route
router.post('/piyush', piyushPromptHandler);

export default router;