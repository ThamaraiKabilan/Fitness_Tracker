import axios from 'axios';

const API = axios.create({
  // Dynamically uses the REACT_APP_API_URL from your .env
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    // Crucial: This allows Dashboard/Workouts/Meals to be authorized
    req.headers.Authorization = `Bearer ${token}`; 
  }
  return req;
});

export default API;