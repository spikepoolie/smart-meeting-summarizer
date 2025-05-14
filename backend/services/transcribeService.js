const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const transcribe = new AWS.TranscribeService();

const startTranscriptionJob = async (mediaFileUri, jobName) => {
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: "en-US",
    MediaFormat: "mp3",
    Media: { MediaFileUri: mediaFileUri },
    OutputBucketName: process.env.AWS_S3_BUCKET_NAME,
  };

  await transcribe.startTranscriptionJob(params).promise();
};

const getTranscriptionJobResult = async (jobName) => {
  const data = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();

  if (data.TranscriptionJob.TranscriptionJobStatus !== "COMPLETED") {
    throw new Error("Transcription is still in progress.");
  }

  const url = data.TranscriptionJob.Transcript.TranscriptFileUri;
  const response = await fetch(url);
  const result = await response.json();
  return result.results.transcripts[0].transcript;
};

module.exports = {
  startTranscriptionJob,
  getTranscriptionJobResult,
};