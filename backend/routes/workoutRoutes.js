const express = require('express');
const router = express.Router();
const { 
    addWorkout, 
    getWorkouts, 
    updateWorkout, 
    deleteWorkout, 
    getStats 
} = require('../controllers/workoutController'); // Check these are all here
const { protect } = require('../middleware/authMiddleware');

// Dashboard stats
router.get('/stats', protect, getStats);

// Main routes
router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);

// Update and Delete
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;