import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [goal, setGoal] = useState(user?.dailyGoal || 2000);
  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState([]);

  const fetchWeight = async () => {
    try {
      const { data } = await API.get('/weight/history');
      const formattedData = data.map(w => ({ 
        date: new Date(w.date).toLocaleDateString(), 
        kg: w.weight 
      }));
      setHistory(formattedData);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchWeight(); }, []);

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', { dailyGoal: goal });
      login(data);
      alert("Goal Updated!");
    } catch (err) { alert("Failed to update goal"); }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    try {
      await API.post('/weight', { weight });
      setWeight('');
      fetchWeight();
    } catch (err) { alert("Failed to log weight"); }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 mb-4 text-center">
             <h3>{user?.name}</h3>
             <p className="text-muted">{user?.email}</p>
             <hr/>
             <Form onSubmit={handleUpdateGoal} className="text-start">
                <Form.Label className="fw-bold">Daily Calorie Goal</Form.Label>
                <Form.Control type="number" value={goal} onChange={(e)=>setGoal(e.target.value)} />
                <Button type="submit" className="w-100 mt-2">Update Goal</Button>
             </Form>
          </Card>

          <Card className="p-4 shadow-sm border-0">
             <h5>Log Current Weight</h5>
             <Form onSubmit={handleAddWeight}>
                <Form.Control type="number" placeholder="Weight (kg)" value={weight} onChange={(e)=>setWeight(e.target.value)} required />
                <Button type="submit" variant="dark" className="w-100 mt-2">Log Weight</Button>
             </Form>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-4 shadow-sm border-0">
            <h5>Weight Progress Trend</h5>
            <div style={{ width: '100%', height: 300 }}>
              {history.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="kg" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center mt-5 text-muted">Log your weight to see your progress chart!</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;