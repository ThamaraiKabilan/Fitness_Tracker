import axios from 'axios';

const API = axios.create({
  // Use the .env variable if it exists, otherwise use localhost for development
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    // CRITICAL: Sends the token so you can save Workouts/Meals
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;