// backend/controllers/summarizeController.js

const { generateSummary } = require("../services/langchainService");

const summarizeText = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || transcript.length < 20) {
      return res.status(400).json({ error: "Transcript is too short or missing." });
    }

    const summary = await generateSummary(transcript);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Summarization Error:", error);
    res.status(500).json({ error: error.message });
  }
}
module.exports = { summarizeText };