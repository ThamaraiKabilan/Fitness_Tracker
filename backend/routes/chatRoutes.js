const express = require('express');
const router = express.Router();
const { getChatResponse, listModels } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Chat remains protected (Requires Login)
router.post('/', protect, getChatResponse);

// Debug is now PUBLIC (No Login required for 5 mins to test)
router.get('/debug', listModels); 

module.exports = router;