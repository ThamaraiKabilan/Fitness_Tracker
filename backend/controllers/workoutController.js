const Workout = require('../models/Workout');
const Meal = require('../models/Meal');

// 1. Add Workout Session
exports.addWorkout = async (req, res) => {
  try {
    const { sessionName, exercises, totalCaloriesBurned } = req.body;
    const cleanedExercises = (exercises || []).map(ex => ({
      name: ex.name,
      type: ex.type || 'strength',
      image: ex.image || '',
      duration: Number(ex.duration) || 0,
      caloriesBurned: Number(ex.caloriesBurned) || 0,
      sets: (ex.sets || []).map(s => ({
        kg: s.kg === "" ? 0 : Number(s.kg),
        reps: s.reps === "" ? 0 : Number(s.reps),
        completed: Boolean(s.completed)
      }))
    }));

    const workout = await Workout.create({
      userId: req.user.id,
      sessionName: sessionName || "Daily Session",
      exercises: cleanedExercises,
      totalCaloriesBurned: Number(totalCaloriesBurned) || 0
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Workouts (Date Filtered)
exports.getWorkouts = async (req, res) => {
  try {
    const filter = req.query.dateFilter || 'Today';
    const now = new Date();
    let start = new Date(0); 
    if (filter === 'Today') start = new Date(now.setHours(0,0,0,0));
    const workouts = await Workout.find({ userId: req.user.id, date: { $gte: start } }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Workout (THE MISSING FUNCTION)
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workout) return res.status(404).json({ message: "Not found" });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Delete Workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({ userId });
    const meals = await Meal.find({ userId });
    
    const burned = workouts.reduce((s, w) => s + (w.totalCaloriesBurned || 0), 0);
    const consumed = meals.reduce((s, m) => s + (m.calories || 0), 0);
    const mealCounts = meals.reduce((acc, m) => { acc[m.mealType] = (acc[m.mealType] || 0) + 1; return acc; }, {});

    res.json({ 
      totalWorkouts: workouts.length, 
      totalCaloriesBurned: burned, 
      totalCaloriesConsumed: consumed, 
      netBalance: consumed - burned, 
      chartData: workouts.slice(-7).map(w => ({ name: new Date(w.date).toLocaleDateString(), calories: w.totalCaloriesBurned })),
      pieData: Object.keys(mealCounts).map(t => ({ name: t, value: mealCounts[t] }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};