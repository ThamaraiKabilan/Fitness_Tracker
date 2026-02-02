const Workout = require('../models/Workout');
const Meal = require('../models/Meal');

// Helper function to calculate date ranges
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

exports.addWorkout = async (req, res) => {
  try {
    const { sessionName, exercises, totalCaloriesBurned } = req.body;
    const workout = await Workout.create({
      userId: req.user.id,
      sessionName,
      exercises,
      totalCaloriesBurned: Number(totalCaloriesBurned) || 0
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const dateRange = getDateRange(req.query.dateFilter);
    const workouts = await Workout.find({ userId: req.user.id, date: dateRange }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const dateRange = getDateRange(req.query.dateFilter);
    const userId = req.user.id;
    
    const workouts = await Workout.find({ userId, date: dateRange });
    const meals = await Meal.find({ userId, date: dateRange });

    const totalWorkouts = workouts.length;
    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.totalCaloriesBurned || 0), 0);
    const totalCaloriesConsumed = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

    // FIX: Group workouts by date so the chart is clean
    const grouped = workouts.reduce((acc, w) => {
      const day = new Date(w.date).toLocaleDateString();
      acc[day] = (acc[day] || 0) + (w.totalCaloriesBurned || 0);
      return acc;
    }, {});

    const chartData = Object.keys(grouped).map(date => ({
      name: date,
      calories: grouped[date]
    })).slice(-7); // Last 7 days

    const mealCounts = meals.reduce((acc, m) => {
      acc[m.mealType] = (acc[m.mealType] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(mealCounts).map(type => ({ name: type, value: mealCounts[type] }));

    res.json({ totalWorkouts, totalCaloriesBurned, totalCaloriesConsumed, netBalance: totalCaloriesConsumed - totalCaloriesBurned, chartData, pieData });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(workout);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};