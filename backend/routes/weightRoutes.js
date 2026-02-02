const express = require('express');
const router = express.Router();
const { addWeight, getWeightHistory } = require('../controllers/weightController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addWeight);
router.get('/history', protect, getWeightHistory);

module.exports = router;