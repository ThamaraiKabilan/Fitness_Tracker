import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, Box, Typography, Paper, Grid, Avatar, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  FitnessCenter, 
  LocalFireDepartment, 
  Restaurant, 
  TrendingUp, 
  WaterDrop, 
  Add, 
  Remove,
  CheckCircleOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FilterContext } from '../context/FilterContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#f43f5e'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { dateFilter } = useContext(FilterContext);
  const [stats, setStats] = useState({ 
    totalWorkouts: 0, 
    totalCaloriesBurned: 0, 
    totalCaloriesConsumed: 0, 
    netBalance: 0, 
    chartData: [], 
    pieData: [] 
  });
  
  const [water, setWater] = useState(parseInt(localStorage.getItem('water_ml')) || 0);

  // 1. Dynamic Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get(`/workouts/stats?dateFilter=${dateFilter}`);
        setStats(data);
      } catch (err) { console.error("Error fetching stats"); }
    };
    fetchStats();
  }, [dateFilter]);

  const updateWater = (val) => {
    const newWater = Math.max(0, water + val);
    setWater(newWater);
    localStorage.setItem('water_ml', newWater);
  };

  return (
    <Container className="mt-4 pb-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={2}>
          <Box>
            {/* DYNAMIC WELCOME MESSAGE */}
            <Typography variant="h3" fontWeight="900" sx={{ color: 'text.primary', letterSpacing: '-1px' }}>
              {getGreeting()}, {user?.name}! 👋
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Viewing stats for: <span style={{ color: '#6366f1' }}>{dateFilter}</span>
            </Typography>
          </Box>
          
          {/* Water Tracker */}
          <Paper sx={{ p: 2, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }} className="shadow-sm border">
            <Avatar sx={{ bgcolor: 'info.light', width: 40, height: 40 }}><WaterDrop /></Avatar>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'info.main', display: 'block', lineHeight: 1 }}>WATER</Typography>
              <Typography variant="h5" fontWeight="900">{water}ml</Typography>
            </Box>
            <Box display="flex" gap={0.5}>
              <IconButton size="small" onClick={() => updateWater(250)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': {bgcolor:'primary.dark'} }}><Add fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => updateWater(-250)} sx={{ border: '1px solid #eee' }}><Remove fontSize="small" /></IconButton>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* Top Gradient Stats */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'Workouts', val: stats.totalWorkouts, icon: <FitnessCenter />, grad: 'grad-workout' },
          { label: 'Burned', val: `${stats.totalCaloriesBurned}`, icon: <LocalFireDepartment />, grad: 'grad-burned' },
          { label: 'Consumed', val: `${stats.totalCaloriesConsumed}`, icon: <Restaurant />, grad: 'grad-consumed' }
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div whileHover={{ y: -5 }}>
              <Paper className={`premium-card ${item.grad} p-4 shadow-lg`} sx={{ borderRadius: 5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, fontWeight: 600 }}>{item.label}</Typography>
                        <Typography variant="h2" sx={{ color: 'white', fontWeight: '900' }}>{item.val}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>{item.icon}</Avatar>
                  </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Row>
        <Col lg={8}>
          <Card className="premium-card p-4 shadow-sm mb-4" sx={{ bgcolor: 'background.paper', borderRadius: 6, minHeight: 450 }}>
            <Typography variant="h5" mb={4} fontWeight="800" color="text.primary">Activity Analysis (kcal)</Typography>
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="calories" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={350}>
                <Typography color="text.secondary">No workout data found for this period</Typography>
              </Box>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="premium-card p-4 shadow-sm mb-4" sx={{ bgcolor: 'background.paper', borderRadius: 6 }}>
            <Typography variant="h6" mb={2} fontWeight="800" color="text.primary">Meal Distribution</Typography>
            <Box height={250}>
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.pieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                      {stats.pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%"><Typography color="text.secondary">No data</Typography></Box>
              )}
            </Box>
          </Card>

          <Card className="premium-card p-4 shadow-sm" sx={{ bgcolor: 'background.paper', borderRadius: 6 }}>
            <Typography variant="h6" fontWeight="800" color="primary" display="flex" alignItems="center">
              <TrendingUp sx={{ mr: 1 }} /> Net Balance
            </Typography>
            <Box mt={2}>
                <Typography variant="h2" fontWeight="900" sx={{ color: stats.netBalance > 0 ? 'error.main' : 'success.main' }}>
                    {Math.abs(stats.netBalance)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.7 }}>
                    {stats.netBalance > 0 ? "kcal surplus remaining" : "kcal deficit achieved"}
                </Typography>
            </Box>
          </Card>
        </Col>
      </Row>

      {/* FOOTER STATS: BMI & Health Status */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Paper sx={{ mt: 4, p: 2, px: 4, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }} className="border shadow-sm">
            <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}><CheckCircleOutline /></Avatar>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight="700">Current Health Status</Typography>
                    <Typography variant="h5" fontWeight="900" color="success.main">Normal</Typography>
                </Box>
            </Box>
            <Box textAlign="right">
                <Typography variant="caption" color="textSecondary" fontWeight="700">BMI Index</Typography>
                <Typography variant="h5" fontWeight="900" color="text.primary">22.9</Typography>
            </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Dashboard;