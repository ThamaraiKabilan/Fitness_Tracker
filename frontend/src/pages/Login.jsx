import React, { useState, useContext } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { Box, Typography, Paper, TextField, InputAdornment, Avatar, Divider, IconButton as MuiIconButton } from '@mui/material';
import { Email, Lock, FitnessCenter, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/api/auth/login', formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Must send the key as 'credential'
      const { data } = await API.post('/auth/google', {
        credential: credentialResponse.credential, 
      });

      login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error("Google Auth Error:", error.response?.data);
      alert("Google Sign-In failed. Check console for details.");
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', 
      py: 5 
    }}>
      <Container>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Paper elevation={10} sx={{ 
            maxWidth: 450, 
            mx: 'auto', 
            p: 5, 
            borderRadius: 5, 
            textAlign: 'center',
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
              <FitnessCenter fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" fontWeight="900" gutterBottom color="primary">
              Welcome Back
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Sign in to FitFlow to track your progress
            </Typography>

            {/* Error Message Display */}
            {error && (
              <Box sx={{ bgcolor: 'error.light', color: 'error.contrastText', p: 1.5, borderRadius: 2, mb: 3, fontSize: '0.875rem', fontWeight: 'bold' }}>
                {error}
              </Box>
            )}
            
            <Form onSubmit={handleSubmit}>
              <TextField 
                fullWidth label="Email Address" variant="outlined" className="mb-3"
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
              
              <TextField 
                fullWidth label="Password" variant="outlined" className="mb-4"
                type={showPassword ? 'text' : 'password'}
                InputProps={{ 
                    startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                    endAdornment: (
                        <InputAdornment position="end">
                          <MuiIconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </MuiIconButton>
                        </InputAdornment>
                      ),
                }}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-100 py-3 fw-bold grad-workout border-0 text-white shadow-lg rounded-pill mb-1" 
                style={{ letterSpacing: '1px' }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "LOGIN"}
              </Button>
            </Form>

            <Box sx={{ mt: 3 }}>
              <Divider sx={{ my: 2 }}>OR</Divider>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="350"
                />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: '700', textDecoration: 'none', color: '#6366f1' }}>Register Here</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;