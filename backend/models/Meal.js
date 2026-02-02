const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  mealType: { type: String, required: true }, // Breakfast, Lunch, etc.
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);