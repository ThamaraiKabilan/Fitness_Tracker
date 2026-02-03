require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const mealRoutes = require('./routes/mealRoutes');
const weightRoutes = require('./routes/weightRoutes');
const chatRoutes = require('./routes/chatRoutes');
const waterRoutes = require('./routes/waterRoutes');

const app = express();
connectDB();

// FIXED CORS: Allow local testing AND Vercel deployment
app.use(cors({
  origin: ["http://localhost:3000", "https://fitness-tracker-a7hr.vercel.app"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/water', waterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));