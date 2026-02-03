const Meal = require('../models/Meal');

exports.addMeal = async (req, res) => {
  try {
    const { foodName, calories, mealType } = req.body;
    const meal = await Meal.create({
      userId: req.user.id,
      foodName,
      calories: Number(calories), // Force number
      mealType
    });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const filter = req.query.dateFilter || 'Today';
    const meals = await Meal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meal);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};