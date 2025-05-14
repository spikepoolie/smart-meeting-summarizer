const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { ChatOpenAI } = require("@langchain/openai");
const { pineconeIndex } = require("../config/pineconeClient");

async function summarizeTranscript(transcript) {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
  const docs = await splitter.createDocuments([transcript]);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.3,
  });

  const vectorStore = await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), { pineconeIndex });

  const chain = loadQAStuffChain(model);
  const response = await chain.call({
    input_documents: docs,
    question: "Summarize the main points of this meeting.",
  });

  return response.text;
}

module.exports = summarizeTranscript;