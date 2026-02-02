const mongoose = require('mongoose');

// This defines what a single "Set" looks like (for Weight Training)
const setSchema = new mongoose.Schema({
  kg: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

// This defines what a single "Exercise" looks like
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['strength', 'cardio'], required: true },
  image: { type: String },
  // For Weight Training
  sets: [setSchema], 
  // For Cardio
  duration: { type: Number, default: 0 }, // in seconds
  caloriesBurned: { type: Number, default: 0 } // calories for this specific exercise
});

// This is the Main Workout Session
const workoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sessionName: { 
    type: String, 
    required: true, 
    default: "Daily Workout" 
  },
  exercises: [exerciseSchema], // An array of the exercises defined above
  totalCaloriesBurned: { 
    type: Number, 
    default: 0 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);