// backend/services/langchainService.js

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("langchain/document");

require("dotenv").config();

const generateSummary = async (transcript) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  });

  const docs = await splitter.createDocuments([transcript]);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.3,
    modelName: "gpt-3.5-turbo-1106", // or "gpt-4"
  });

  const mapPrompt = PromptTemplate.fromTemplate(`
    You are analyzing a section of a meeting transcript. Extract the most important details in clear bullet-point format.

    For each section, identify and include:
    - Participants mentioned (names, titles if available)
    - Topics or agenda items discussed
    - Decisions made or motions passed/rejected
    - Any follow-up actions or scheduled future meetings
    - Conflicts or disagreements: who disagreed and what was the issue
    - Notable quotes or statements (if impactful or controversial)
    - Action items assigned, to whom, and deadlines if mentioned
    - Tone or sentiment (e.g., collaborative, tense, neutral)

    Transcript Section:
    {pageContent}
  `);

  const combinePrompt = PromptTemplate.fromTemplate(`
    You are generating a full summary of a meeting based on combined notes from individual sections. Write clearly and professionally.

    Your summary should include:

    1. Participants
      - List key participants and their roles (if mentioned)

    2. Topics Discussed
      - Group and summarize main issues or agenda items

    3. Decisions and Outcomes
      - Include votes, approvals, rejections, or consensus points

    4. Conflicts and Disagreements
      - Who was involved, the topic of dispute, and how it was resolved (if resolved)

    5. Notable Quotes or Statements
      - Include any quotes that reflect key moments or tones

    6. Action Items
      - List tasks assigned, responsible parties, and deadlines

    7. Follow-ups
      - Mention scheduled meetings or deadlines for future discussion

    8. Overall Sentiment
      - Briefly describe the tone (e.g., productive, tense, divided)

    Use clear formatting and paragraphs where appropriate. Avoid listing “None” — skip sections that are not present.

    Combined Notes:
    {text}`
  );

  const summarizationChain = loadSummarizationChain(model, {
    type: "map_reduce",
    combinePrompt,
    mapPrompt,
  });

  const result = await summarizationChain.call({
    input_documents: docs,
  });

  return result.text;
};

module.exports = { generateSummary };