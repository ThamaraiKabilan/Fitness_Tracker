import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Box, Typography, Paper, IconButton, TextField, MenuItem, Chip, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Delete, Lock, History } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FilterContext } from '../context/FilterContext';
import { ThemeContext } from '../context/ThemeContext';

const MEAL_TYPES = [{ name: 'Breakfast', icon: '🥐' }, { name: 'Lunch', icon: '🥗' }, { name: 'Dinner', icon: '🍗' }, { name: 'Snack', icon: '🍎' }];
const QUICK_ADD = [
  { name: 'Egg', cal: 70, type: 'Breakfast' }, { name: 'Apple', cal: 95, type: 'Snack' }, { name: 'Coffee', cal: 5, type: 'Breakfast' },
  { name: 'Chicken', cal: 165, type: 'Lunch' }, { name: 'Shake', cal: 120, type: 'Snack' }
];

const Meals = () => {
  const { user } = useContext(AuthContext);
  const { dateFilter } = useContext(FilterContext);
  const { darkMode } = useContext(ThemeContext);
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({ foodName: '', calories: '', mealType: 'Breakfast' });
  const [editId, setEditId] = useState(null);

  const isToday = dateFilter === 'Today';

  const fetchMeals = async () => {
    try {
      const { data } = await API.get(`/meals?dateFilter=${dateFilter}`);
      setMeals(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
  const fetchMeals = async () => {
    // 🔁 paste your existing fetchMeals logic here
    // axios call / API call / setState etc.
  };

  fetchMeals();
}, [dateFilter]);


  const total = meals.reduce((sum, m) => sum + m.calories, 0);
  const goal = user?.dailyGoal || 2500;
  const left = goal - total;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/meals/${editId}`, formData);
      else await API.post('/meals', formData);
      setFormData({ foodName: '', calories: '', mealType: 'Breakfast' });
      setEditId(null);
      fetchMeals();
    } catch (err) { alert("Error saving meal"); }
  };

  return (
    <Container className="mt-4 pb-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" fontWeight="900" color="text.primary">Nutrition Tracker</Typography>
            {!isToday && <Chip icon={<Lock />} label="History Mode" variant="outlined" color="warning" />}
        </Box>
      </motion.div>

      <Row className="mb-4">
        <Col lg={4}>
          <Paper sx={{ p: 4, borderRadius: 8, textAlign: 'center', mb: 3 }} className="shadow-sm border">
            <Typography variant="h6" fontWeight="800" mb={2}>Daily Budget</Typography>
            <Box sx={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{value: total}, {value: Math.max(0, left)}]} innerRadius={65} outerRadius={85} dataKey="value" startAngle={90} endAngle={450}>
                    <Cell fill="#6366f1" /><Cell fill={darkMode ? '#334155' : '#e2e8f0'} />
                    <Label value={`${left > 0 ? left : 0} kcal`} position="center" fill={darkMode ? '#fff' : '#000'} style={{ fontSize: '1.2rem', fontWeight: '900' }} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Col>

        <Col lg={8}>
          <Paper sx={{ p: 4, borderRadius: 8, mb: 3 }} className="shadow-sm border">
            <Typography variant="h6" fontWeight="800" mb={3} color="text.primary">Estimated Nutrients</Typography>
            <Row>
              {['PROTEIN', 'CARBS', 'FATS'].map((n, i) => (
                <Col key={n} xs={4}>
                  <Typography variant="caption" sx={{ fontWeight: '800', color:'text.secondary' }}>{n}</Typography>
                  <Typography variant="h4" fontWeight="900" color={i === 0 ? "primary" : i === 1 ? "success.main" : "warning.main"}>{~~(total * [0.25, 0.45, 0.3][i] / [4,4,9][i])}g</Typography>
                  <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4 }} color={i === 0 ? "primary" : i === 1 ? "success" : "warning"} />
                </Col>
              ))}
            </Row>
            {isToday && (
                <Box mt={4}>
                    <Typography variant="caption" fontWeight="800" color="text.secondary">⚡ QUICK ADD</Typography>
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                        {QUICK_ADD.map(item => <Chip key={item.name} label={`+ ${item.name}`} onClick={async () => { await API.post('/meals', { foodName: item.name, calories: item.cal, mealType: item.type }); fetchMeals(); }} sx={{ fontWeight: 'bold', cursor: 'pointer' }} />)}
                    </Box>
                </Box>
            )}
          </Paper>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <AnimatePresence mode="wait">
            {isToday ? (
              <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Paper sx={{ p: 4, borderRadius: 8 }} className="shadow-sm border">
                    <Typography variant="h6" fontWeight="800" mb={3}>{editId ? "Edit Entry" : "Log New Meal"}</Typography>
                    <Form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Food Name" className="mb-3" value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})} required />
                        <TextField fullWidth label="Calories" type="number" className="mb-3" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} required />
                        <TextField fullWidth select label="Type" className="mb-4" value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
                            {MEAL_TYPES.map(m => <MenuItem key={m.name} value={m.name}>{m.icon} {m.name}</MenuItem>)}
                        </TextField>
                        <Button type="submit" className="w-100 py-3 fw-bold grad-consumed border-0 text-white rounded-pill shadow-lg">Save Meal</Button>
                    </Form>
                </Paper>
              </motion.div>
            ) : (
                <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Paper sx={{ p: 5, borderRadius: 8, textAlign: 'center', opacity: 0.7 }} className="border bg-light">
                        <History sx={{ fontSize: 60, mb: 2, color: 'grey.400' }} />
                        <Typography variant="h6" fontWeight="800">Past Logs</Typography>
                        <Typography variant="body2" color="textSecondary">Log is locked for past dates.</Typography>
                    </Paper>
                </motion.div>
            )}
          </AnimatePresence>
        </Col>

        <Col lg={8}>
          {MEAL_TYPES.map(typeObj => {
            const typeMeals = meals.filter(m => m.mealType === typeObj.name);
            return (
              <motion.div key={typeObj.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Paper sx={{ mb: 2, overflow: 'hidden', bgcolor: 'background.paper', borderRadius: 4 }} className="shadow-sm border">
                    <Box p={2} px={3} display="flex" justifyContent="space-between" alignItems="center" bgcolor={darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}>
                        <Typography fontWeight="800">{typeObj.icon} {typeObj.name}</Typography>
                        <Typography color="primary" fontWeight="900">{typeMeals.reduce((s, m) => s + m.calories, 0)} kcal</Typography>
                    </Box>
                    <Table hover responsive className="mb-0">
                        <tbody>
                            {typeMeals.map(m => (
                                <tr key={m._id} style={{ color: 'inherit' }}>
                                    <td className="ps-4 fw-bold">{m.foodName}</td>
                                    <td className="text-center fw-bold">{m.calories} kcal</td>
                                    <td className="text-end pe-4">
                                        {isToday && (
                                            <>
                                                <IconButton size="sm" color="primary" onClick={() => {setEditId(m._id); setFormData(m); window.scrollTo(0,0);}}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="sm" color="error" onClick={async () => { if(window.confirm("Delete?")) { await API.delete(`/meals/${m._id}`); fetchMeals(); } }}><Delete fontSize="small" /></IconButton>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Paper>
              </motion.div>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};
export default Meals;