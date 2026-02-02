const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, dailyGoal: user.dailyGoal, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, dailyGoal: user.dailyGoal, token: generateToken(user._id) });
    } else { res.status(401).json({ message: 'Invalid email or password' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.googleAuth = async (req, res) => {
  const { credential } = req.body; // Matches frontend exactly
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: Math.random().toString(36).slice(-10) });
    }
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, dailyGoal: user.dailyGoal, token: generateToken(user._id) });
  } catch (error) {
    res.status(400).json({ message: "Google Authentication Failed" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.dailyGoal = req.body.dailyGoal || user.dailyGoal;
      if (req.body.password) user.password = req.body.password;
      const updatedUser = await user.save();
      res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, dailyGoal: updatedUser.dailyGoal, token: generateToken(updatedUser._id) });
    } else { res.status(404).json({ message: 'User not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};