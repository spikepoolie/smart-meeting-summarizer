// backend/config/pineconeClient.js

const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME); // e.g. "meeting-summaries"

module.exports = { pineconeIndex };