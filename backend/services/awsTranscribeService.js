// backend/services/awsTranscribeService.js

const fs = require('fs');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require('@aws-sdk/client-transcribe');
const axios = require('axios');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 🔄 Updated function
const uploadToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uniqueKey = `${Date.now()}_${file.originalname}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueKey,
      Body: fileStream,
      ContentType: file.mimetype,
    },
  });

  await upload.done();

  return `s3://${process.env.AWS_S3_BUCKET_NAME}/${uniqueKey}`;
};

const startTranscriptionJob = async (s3Url, jobName) => {
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US',
    MediaFormat: 'mp3',
    Media: { MediaFileUri: s3Url.replace('s3://', 'https://s3.amazonaws.com/') },
    OutputBucketName: process.env.AWS_S3_BUCKET_NAME,
  };
  await transcribe.send(new StartTranscriptionJobCommand(params));
};

const getTranscriptionJobResult = async (jobName) => {
  const params = { TranscriptionJobName: jobName };
  const data = await transcribe.send(new GetTranscriptionJobCommand(params));
  const transcriptFileUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
  const response = await axios.get(transcriptFileUri);
  return response.data.results.transcripts[0].transcript;
};

module.exports = {
  uploadToS3,
  startTranscriptionJob,
  getTranscriptionJobResult,
};
