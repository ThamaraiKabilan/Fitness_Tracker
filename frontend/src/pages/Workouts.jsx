import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col, Form, Button, Accordion, Table, Modal, Badge as BBadge } from 'react-bootstrap';
import { Box, Typography, Paper, IconButton, Avatar, Card, TextField, Chip, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { exerciseDatabase } from '../services/exerciseData';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { FilterContext } from '../context/FilterContext';
import { CheckCircle, PlayArrow, Pause, Stop, Delete, Info, Stars, History, Lock, EventNote } from '@mui/icons-material';

const Workouts = () => {
  const { darkMode } = useContext(ThemeContext);
  const { dateFilter } = useContext(FilterContext);
  
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLevel, setUserLevel] = useState("Beginner"); // Controls the suggested logic
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState({ name: '', url: '' });
  const [activeTimerIdx, setActiveTimerIdx] = useState(null);
  const timerRef = useRef(null);

  const isToday = dateFilter === 'Today';

  const fetchWorkouts = async () => {
    try {
      const { data } = await API.get(`/workouts?dateFilter=${dateFilter}`);
      setHistory(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
  const fetchWorkouts = async () => {
    // your existing fetchWorkouts logic here
    // axios / API call / setState etc.
  };

  fetchWorkouts();
}, [dateFilter]);


  useEffect(() => {
    if (activeTimerIdx !== null) {
      timerRef.current = setInterval(() => {
        setSelectedExercises(prev => {
          const updated = [...prev];
          const ex = updated[activeTimerIdx];
          ex.duration = (ex.duration || 0) + 1;
          ex.caloriesBurned = Math.floor((ex.duration / 60) * 10);
          return updated;
        });
      }, 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [activeTimerIdx]);

  const toggleComplete = (exIdx, sIdx) => {
    if (!isToday) return;
    const updated = [...selectedExercises];
    updated[exIdx].sets[sIdx].completed = !updated[exIdx].sets[sIdx].completed;
    
    // Calorie formula: KG * Reps * 0.1
    updated[exIdx].caloriesBurned = updated[exIdx].sets.reduce((acc, s) => 
        (s.completed && s.kg && s.reps) ? acc + (parseFloat(s.kg) * parseInt(s.reps) * 0.1) : acc, 0).toFixed(0);
    
    setSelectedExercises(updated);
  };

  const finishWorkout = async () => {
    const totalCals = selectedExercises.reduce((sum, ex) => sum + parseInt(ex.caloriesBurned || 0), 0);
    try {
      await API.post('/workouts', { sessionName: `${userLevel} Focused Session`, exercises: selectedExercises, totalCaloriesBurned: totalCals });
      alert(`Session Saved! You burned ${totalCals} kcal! 🏆`);
      setSelectedExercises([]);
      fetchWorkouts();
    } catch (err) { alert("Error saving session"); }
  };

  return (
    <Container className="mt-4 pb-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
                <Typography variant="h3" fontWeight="900" sx={{ color: 'text.primary' }}>Workout Session</Typography>
                <Typography color="textSecondary">{isToday ? "Log your live activity" : `Reviewing logs for ${dateFilter}`}</Typography>
            </Box>
            {isToday && selectedExercises.length > 0 && (
                <Button variant="success" className="rounded-pill px-5 fw-bold shadow-lg" onClick={finishWorkout}>Finish Session</Button>
            )}
            {!isToday && <Chip icon={<Lock />} label="History Mode" variant="outlined" color="warning" />}
        </Box>
      </motion.div>

      <Row>
        <Col lg={4}>
          <AnimatePresence mode="wait">
            {isToday ? (
              <motion.div key="library" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Paper sx={{ p: 0, mb: 4, bgcolor: 'background.paper', borderRadius: 6, overflow: 'hidden' }} className="border shadow-sm">
                  <Box p={3} pb={1}>
                    <Typography variant="subtitle2" color="primary" mb={1} display="flex" alignItems="center"><Stars fontSize="small" sx={{mr:1}}/> Skill Level</Typography>
                    <Stack direction="row" spacing={1} mb={3}>
                        {['Beginner', 'Intermediate', 'Experienced'].map(lvl => (
                            <Chip key={lvl} label={lvl} size="small" onClick={() => setUserLevel(lvl)} color={userLevel === lvl ? "primary" : "default"} sx={{ cursor: 'pointer' }} />
                        ))}
                    </Stack>
                    <TextField fullWidth size="small" placeholder="Search exercises..." sx={{ mb: 2 }} onChange={e => setSearchTerm(e.target.value)} />
                  </Box>

                  <Accordion flush style={{ border: 'none' }}>
                    {Object.keys(exerciseDatabase).map((cat, i) => (
                      <Accordion.Item eventKey={i.toString()} key={cat} style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <Accordion.Header sx={{ color: 'text.primary' }}>{cat}</Accordion.Header>
                        <Accordion.Body className="p-0" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : '#fff' }}>
                          {Object.keys(exerciseDatabase[cat]).map(sub => (
                            <Box key={sub} py={1} borderBottom="1px solid rgba(0,0,0,0.05)">
                              <Typography variant="caption" sx={{ px: 2, fontWeight: '800', color: 'text.secondary', opacity: 0.7 }}>{sub.toUpperCase()}</Typography>
                              {exerciseDatabase[cat][sub].filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase())).map(ex => (
                                <Box key={ex.name} display="flex" justifyContent="space-between" alignItems="center" px={1} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                  <Button variant="link" className="text-start py-2 text-decoration-none" style={{ color: darkMode ? '#fff' : '#000', fontSize: '0.9rem' }} onClick={() => setSelectedExercises([...selectedExercises, { ...ex, sets: [{ kg: '', reps: '', completed: false }], caloriesBurned: 0 }])}>
                                      + {ex.name} 
                                      {/* THE SUGGESTION LOGIC */}
                                      {ex.level === userLevel && <BBadge bg="info" className="ms-2" style={{fontSize:'0.55rem', verticalAlign:'middle'}}>SUGGESTED</BBadge>}
                                  </Button>
                                  <IconButton size="small" color="primary" onClick={() => { setVideoData({ name: ex.name, url: ex.video }); setShowVideo(true); }}><Info fontSize="small"/></IconButton>
                                </Box>
                              ))}
                            </Box>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Paper>
              </motion.div>
            ) : (
                <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Paper sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 6, border: '1px dashed #ccc' }}>
                        <History sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" fontWeight="700" color="text.primary">Past Records</Typography>
                        <Typography variant="body2" color="textSecondary">Switch to <b>Today</b> to log new data.</Typography>
                    </Paper>
                </motion.div>
            )}
          </AnimatePresence>
        </Col>

        <Col lg={8}>
          <AnimatePresence>
            {isToday && selectedExercises.map((ex, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 50 }}>
                    <Card sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 8 }} className="border shadow-sm">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <Avatar src={ex.image} sx={{ mr: 2, width: 50, height: 50, border: '1px solid #eee' }} />
                            <Typography variant="h6" fontWeight="800" color="text.primary">{ex.name}</Typography>
                        </Box>
                        <IconButton color="error" onClick={() => setSelectedExercises(selectedExercises.filter((_, i) => i !== idx))}><Delete /></IconButton>
                    </Box>
                    
                    {ex.type === 'strength' ? (
                        <Box mt={3}>
                        <Table borderless size="sm" style={{ color: 'inherit' }}>
                            <thead><tr className="text-center text-muted small border-bottom"><th>SET</th><th>KG</th><th>REPS</th><th>DONE</th></tr></thead>
                            <tbody>
                            {ex.sets.map((set, sIdx) => (
                                <tr key={sIdx}>
                                <td className="text-center fw-bold align-middle">{sIdx + 1}</td>
                                <td><Form.Control type="number" size="sm" className="text-center border-0" style={{ background: darkMode ? '#334155' : '#f1f5f9', color:'inherit' }} value={set.kg} onChange={e => { const u=[...selectedExercises]; u[idx].sets[sIdx].kg=e.target.value; setSelectedExercises(u); }} /></td>
                                <td><Form.Control type="number" size="sm" className="text-center border-0" style={{ background: darkMode ? '#334155' : '#f1f5f9', color:'inherit' }} value={set.reps} onChange={e => { const u=[...selectedExercises]; u[idx].sets[sIdx].reps=e.target.value; setSelectedExercises(u); }} /></td>
                                <td className="text-center"><IconButton size="small" color={set.completed ? "success" : "default"} onClick={() => toggleComplete(idx, sIdx)}><CheckCircle /></IconButton></td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Button variant="link" className="w-100 fw-bold text-decoration-none mt-2" onClick={() => { const u=[...selectedExercises]; u[idx].sets.push({kg:'', reps:'', completed:false}); setSelectedExercises(u); }}>+ ADD SET</Button>
                        <Typography variant="caption" sx={{ display:'block', textAlign:'right', mt:1, fontWeight:'800', color:'primary.main' }}>Burned: {ex.caloriesBurned} kcal</Typography>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={3} mt={2} bgcolor={darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'} borderRadius={4}>
                            <Typography variant="h2" fontWeight="900" color="text.primary">{new Date((ex.duration || 0) * 1000).toISOString().substr(14, 5)}</Typography>
                            <Box display="flex" justifyContent="center" gap={3} mt={2}>
                                <Button variant="primary" className="rounded-circle p-3 d-flex shadow" onClick={() => setActiveTimerIdx(idx)}><PlayArrow /></Button>
                                <Button variant="warning" className="rounded-circle p-3 d-flex shadow" onClick={() => setActiveTimerIdx(null)}><Pause /></Button>
                                <Button variant="danger" className="rounded-circle p-3 d-flex shadow" onClick={() => { setActiveTimerIdx(null); const u=[...selectedExercises]; u[idx].duration=0; setSelectedExercises(u); }}><Stop /></Button>
                            </Box>
                            <Typography variant="caption" sx={{ mt: 2, display:'block', fontWeight:'800', color:'primary.main' }}>Burned: {ex.caloriesBurned} kcal</Typography>
                        </Box>
                    )}
                    </Card>
                </motion.div>
            ))}
          </AnimatePresence>

          <Box mt={5}>
            <Typography variant="h5" fontWeight="900" mb={3} display="flex" alignItems="center" color="text.primary"><EventNote sx={{mr:1}} color="primary"/> Session History ({dateFilter})</Typography>
            {history.map((session) => (
                <motion.div key={session._id} whileHover={{ scale: 1.01 }}>
                    <Paper sx={{ p: 3, mb: 2, bgcolor: 'background.paper', borderRadius: 4 }} className="border shadow-sm">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h6" fontWeight="800" color="text.primary">{session.sessionName}</Typography>
                                <Typography variant="caption" color="textSecondary">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                            </Box>
                            <Typography variant="h5" color="primary.main" fontWeight="900">{session.totalCaloriesBurned} kcal</Typography>
                        </Box>
                    </Paper>
                </motion.div>
            ))}
          </Box>
        </Col>
      </Row>

      <Modal show={showVideo} onHide={() => setShowVideo(false)} centered size="lg">
        <Modal.Header closeButton className={darkMode ? "bg-dark text-white border-secondary" : ""}><Modal.Title>{videoData.name} Tutorial</Modal.Title></Modal.Header>
        <Modal.Body className="p-0 bg-black"><iframe width="100%" height="450" src={videoData.url} frameBorder="0" allowFullScreen title="workout-video"></iframe></Modal.Body>
      </Modal>
    </Container>
  );
};

export default Workouts;