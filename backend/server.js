// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const transcribeRoutes = require('./routes/transcribeRoutes');
const pineconeRoutes = require('./routes/pineconeRoutes');
const summarizeRoutes = require('./routes/summarizeRoutes');

const app = express();
app.use(
  cors({
    origin: "*", // For testing — replace with actual domain for production
    methods: ["GET", "POST", "OPTIONS"],
    credentials: false,
  })
);
app.use(express.json());

// Serve uploaded audio files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/pinecone', pineconeRoutes);
app.use('/api/summarize', summarizeRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});