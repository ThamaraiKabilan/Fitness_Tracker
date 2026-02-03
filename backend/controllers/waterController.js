const Water = require('../models/Water');

exports.updateWater = async (req, res) => {
  try {
    const today = new Date().setHours(0,0,0,0);
    let water = await Water.findOne({ userId: req.user.id, date: { $gte: today } });
    if (water) {
      water.amount = req.body.amount;
      await water.save();
    } else {
      water = await Water.create({ userId: req.user.id, amount: req.body.amount });
    }
    res.json(water);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getWater = async (req, res) => {
  try {
    const today = new Date().setHours(0,0,0,0);
    const water = await Water.findOne({ userId: req.user.id, date: { $gte: today } });
    res.json(water || { amount: 0 });
  } catch (error) { res.status(500).json({ message: error.message }); }
};