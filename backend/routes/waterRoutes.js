const express = require('express');
const router = express.Router();
const { 
  addWorkout, 
  getWorkouts, 
  getStats, 
  updateWorkout, 
  deleteWorkout 
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard stats route
router.get('/stats', protect, getStats);

// Main workout routes
router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);

// Update and Delete routes
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;