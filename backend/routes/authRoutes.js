const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleAuth, 
  updateUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth); // <--- Make sure this line is here
router.put('/profile', protect, updateUserProfile);

module.exports = router;