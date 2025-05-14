// backend/routes/transcribeRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const {
  uploadAudio,
  getTranscriptionResult,
  summarizeTranscript,
} = require('../controllers/transcribeController');

// POST /api/transcribe/upload
router.post('/upload', upload.single('file'), uploadAudio);

// GET /api/transcribe/result/:jobName
router.get('/result/:jobName', getTranscriptionResult);

// POST /api/transcribe/summarize
router.post('/summarize', summarizeTranscript);

module.exports = router;