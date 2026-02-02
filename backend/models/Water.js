const mongoose = require('mongoose');
const waterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Water', waterSchema);