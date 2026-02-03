const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionName: { type: String, default: "Daily Workout" },
  exercises: [{
    name: String,
    type: String,
    image: String,
    level: String,
    sets: [{
      kg: Number,
      reps: Number,
      completed: { type: Boolean, default: false }
    }],
    duration: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 }
  }],
  totalCaloriesBurned: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);