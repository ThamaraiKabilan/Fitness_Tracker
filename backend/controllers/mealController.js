const Meal = require('../models/Meal');

// Helper to calculate date ranges for the database query
const getDateRange = (filter) => {
  const now = new Date();
  let start = new Date(0); 
  let end = new Date();

  if (filter === 'Today') {
    start = new Date(now.setHours(0, 0, 0, 0));
    end = new Date(now.setHours(23, 59, 59, 999));
  } else if (filter === 'Yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    start = new Date(yesterday.setHours(0, 0, 0, 0));
    end = new Date(yesterday.setHours(23, 59, 59, 999));
  } else if (filter === 'Last7Days') {
    start = new Date();
    start.setDate(start.getDate() - 7);
  }
  return { $gte: start, $lte: end };
};

exports.addMeal = async (req, res) => {
  try {
    const { foodName, calories, mealType } = req.body;
    const meal = await Meal.create({
      userId: req.user.id,
      foodName,
      calories: Number(calories),
      mealType
    });
    res.status(201).json(meal);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMeals = async (req, res) => {
  try {
    const dateRange = getDateRange(req.query.dateFilter);
    const meals = await Meal.find({ userId: req.user.id, date: dateRange }).sort({ date: -1 });
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
    res.json({ message: "Meal deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};