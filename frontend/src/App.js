import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { MyThemeProvider } from './context/ThemeContext';
import { FilterProvider } from './context/FilterContext'; // <--- 1. Import this

// Components
import AppNavbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Meals from './pages/Meals';
import Profile from './pages/Profile';

import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <GoogleOAuthProvider clientId="164444498134-p8jtt6u8e31lsgs7aih8lopi69pishdp.apps.googleusercontent.com">
    <AuthProvider>
      <MyThemeProvider>
        {/* 2. Wrap everything inside FilterProvider */}
        <FilterProvider> 
          <Router>
            <AppNavbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
              <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
              
              <ChatBot /> {/* 2. Place it here */}
          </Router>
        </FilterProvider>
      </MyThemeProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;