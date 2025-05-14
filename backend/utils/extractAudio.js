const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const fs = require('fs');
const path = require('path');


function hasAudioStream(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);

      const hasAudio = metadata.streams.some((stream) => stream.codec_type === 'audio');
      resolve(hasAudio);
    });
  });
}

async function extractAudioFromVideo(inputPath, outputDir = 'uploads/audio') {
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const outputPath = path.join(outputDir, `${baseName}.mp3`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const hasAudio = await hasAudioStream(inputPath);
  if (!hasAudio) {
    throw new Error('No audio stream found in the file.');
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioChannels(1)
      .audioFrequency(44100)
      .audioBitrate('128k')
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}

module.exports = extractAudioFromVideo;