const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const extractAudioFromVideo = require('../utils/extractAudio');

const {
  uploadToS3,
  startTranscriptionJob,
  getTranscriptionJobResult,
} = require('../services/awsTranscribeService');
const { generateSummary } = require('../services/langchainService');

const uploadAudio = async (req, res) => {
  try {
    const file = req.file;

    // If video, extract audio first
    const isVideo = file.mimetype.startsWith('video/');
    let processedFile = file;

    if (isVideo) {
      const audioPath = await extractAudioFromVideo(file.path);

      processedFile = {
        originalname: path.basename(audioPath),
        path: audioPath,
        buffer: fs.readFileSync(audioPath),
      };
    }

    // Upload to S3
    const s3Url = await uploadToS3(processedFile);

    if (isVideo && processedFile.path) {
      fs.unlink(processedFile.path, (err) => {
        if (err) console.warn('Failed to delete extracted audio:', err);
        else console.log('Extracted audio file deleted:', processedFile.path);
      });
    }

    // Start AWS Transcribe
    const jobName = `transcription_${Date.now()}`;
    await startTranscriptionJob(s3Url, jobName);

    res.status(200).json({ message: 'Transcription job started', jobName });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTranscriptionResult = async (req, res) => {
  try {
    const { jobName } = req.params;
    const transcript = await getTranscriptionJobResult(jobName);
    res.status(200).json({ transcript });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const summarizeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    const summary = await generateSummary(transcript);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadAudio,
  getTranscriptionResult,
  summarizeTranscript,
};