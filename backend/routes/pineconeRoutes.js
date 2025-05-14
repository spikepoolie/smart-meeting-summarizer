// routes/pineconeRoutes.js

const express = require('express');
const router = express.Router();
const { upsertHandler, queryHandler } = require('../controllers/pineconeController');

router.post('/upsert', upsertHandler);
router.post('/query', queryHandler);

module.exports = router;