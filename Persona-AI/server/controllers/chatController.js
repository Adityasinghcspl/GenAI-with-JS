import hiteshSystemPromt from '../utils/prompting-msg/hiteshSystemPromt.js';
import piyushSystemPromt from '../utils/prompting-msg/piyushSystemPromt.js';
import generateResponse from '../utils/generateResponse.js';

export const hiteshPromptHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await generateResponse(message, hiteshSystemPromt);
    res.json({ reply });
  } catch (error) {
    console.error("Hitesh Prompt Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const piyushPromptHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await generateResponse(message, piyushSystemPromt);
    res.json({ reply });
  } catch (error) {
    console.error("Piyush Prompt Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add more handlers like piyushPromptHandler if needed