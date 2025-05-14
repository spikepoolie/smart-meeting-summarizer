// controllers/pineconeController.js

const { upsertDocuments, queryDocuments } = require('../services/pineconeService');

const upsertHandler = async (req, res) => {
  try {
    const { texts, namespace } = req.body;
    await upsertDocuments(texts, namespace);
    res.status(200).json({ message: 'Documents upserted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const queryHandler = async (req, res) => {
  try {
    const { query, namespace } = req.body;
    const results = await queryDocuments(query, namespace);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upsertHandler,
  queryHandler,
};