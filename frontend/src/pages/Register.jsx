import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Box, Typography, Paper, TextField, InputAdornment, Avatar } from '@mui/material';
import { Person, Email, Lock, AppRegistration } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Divider from '@mui/material/Divider';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      alert("Registration failed. Email might already be taken.");
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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper elevation={10} sx={{ maxWidth: 450, mx: 'auto', p: 5, borderRadius: 5, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
              <AppRegistration fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="900" gutterBottom color="success.main">Create Account</Typography>
            <Typography color="text.secondary" mb={4}>Join FitFlow and start your transformation</Typography>
            
            <Form onSubmit={handleSubmit}>
              <TextField 
                fullWidth label="Full Name" variant="outlined" className="mb-3"
                InputProps={{ startAdornment: <InputAdornment position="start"><Person color="success" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
              />

              <TextField 
                fullWidth label="Email Address" variant="outlined" className="mb-3"
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="success" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
              
              <TextField 
                fullWidth label="Password" type="password" variant="outlined" className="mb-4"
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="success" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />

              <Button type="submit" className="w-100 py-3 fw-bold grad-consumed border-0 text-white shadow-lg rounded-pill mb-4" style={{ letterSpacing: '1px' }}>
                SIGN UP
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
              Already have an account? <Link to="/login" style={{ fontWeight: '700', textDecoration: 'none', color: '#10b981' }}>Login here</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;