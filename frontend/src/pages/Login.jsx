import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Box, Typography, Paper, TextField, InputAdornment, Avatar } from '@mui/material';
import { Email, Lock, FitnessCenter } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Divider from '@mui/material/Divider';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Change 'token' to 'credential' to match your backend controller
      const { data } = await API.post('/auth/google', {
        credential: credentialResponse.credential, 
      });

      login(data);
      navigate('/dashboard');
      alert("Google Sign-In Successful! 🎉");
    } catch (error) {
      console.error("Google Auth Error:", error.response?.data || error.message);
      alert("Google Sign-In failed: " + (error.response?.data?.message || "Check Console"));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', py: 5 }}>
      <Container>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Paper elevation={10} sx={{ maxWidth: 450, mx: 'auto', p: 5, borderRadius: 5, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
              <FitnessCenter fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="900" gutterBottom color="primary">Welcome Back</Typography>
            <Typography color="text.secondary" mb={4}>Sign in to FitFlow to track your progress</Typography>
            
            <Form onSubmit={handleSubmit}>
              <TextField 
                fullWidth label="Email Address" variant="outlined" className="mb-3"
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
              
              <TextField 
                fullWidth label="Password" type="password" variant="outlined" className="mb-4"
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />

              <Button type="submit" className="w-100 py-3 fw-bold grad-workout border-0 text-white shadow-lg rounded-pill mb-4" style={{ letterSpacing: '1px' }}>
                LOGIN
              </Button>
              <Divider sx={{ my: 3 }}>OR</Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => alert("Google Login Failed")}
                  theme="outline"
                  size="large"
                  width="300"
                />
              </Box>
            </Form>

            <Typography variant="body2" color="text.secondary">
              Don't have an account? <Link to="/register" style={{ fontWeight: '700', textDecoration: 'none', color: '#6366f1' }}>Register Here</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;