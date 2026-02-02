const Weight = require('../models/Weight');

// @desc    Add current weight
exports.addWeight = async (req, res) => {
  try {
    const { weight } = req.body;
    const newEntry = await Weight.create({
      userId: req.user.id,
      weight: Number(weight)
    });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weight history for chart
exports.getWeightHistory = async (req, res) => {
  try {
    const history = await Weight.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};