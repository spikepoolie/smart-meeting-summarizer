// services/pineconeService.js

const { Pinecone } = require('@pinecone-database/pinecone');
const { PineconeStore } = require('@langchain/pinecone');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { Document } = require('langchain/document');

require('dotenv').config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  controllerHostUrl: process.env.PINECONE_CONTROLLER_HOST_URL, // ✅ REPLACE `environment` with this
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME;

async function upsertDocuments(docs, namespace = 'meetings') {
  const index = pinecone.Index(indexName);
  const store = await PineconeStore.fromDocuments(
    docs.map((text, i) => new Document({ pageContent: text, metadata: { id: i } })),
    embeddings,
    {
      pineconeIndex: index,
      namespace,
    }
  );
  return store;
}

async function queryDocuments(query, namespace = 'meetings') {
  const index = pinecone.Index(indexName);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace,
  });

  const results = await vectorStore.similaritySearch(query, 3);
  return results.map((doc) => doc.pageContent);
}

module.exports = {
  upsertDocuments,
  queryDocuments,
};