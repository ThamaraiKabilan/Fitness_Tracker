import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FilterContext } from '../context/FilterContext';
import { IconButton, Avatar, Box } from '@mui/material';
import { Brightness4, Brightness7, FitnessCenter, CalendarToday } from '@mui/icons-material';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { dateFilter, setDateFilter } = useContext(FilterContext);
  const navigate = useNavigate();

  return (
    <Navbar 
      expand="lg" 
      sticky="top" 
      style={{ 
        backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
        borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
        padding: '10px 0'
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center fw-bold text-primary fs-4">
          <FitnessCenter className="me-2" /> FITFLOW
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard" className={darkMode ? "text-white" : "text-dark"}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/workouts" className={darkMode ? "text-white" : "text-dark"}>Workouts</Nav.Link>
                <Nav.Link as={Link} to="/meals" className={darkMode ? "text-white" : "text-dark"}>Meals</Nav.Link>
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, bgcolor: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: 2, px: 2 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#6366f1' }} />
                  <Form.Select 
                    size="sm" 
                    className="bg-transparent border-0 shadow-none"
                    style={{ color: darkMode ? 'white' : 'black', cursor: 'pointer', fontSize: '0.85rem' }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="Today" style={{background: darkMode ? '#0f172a' : '#fff'}}>Today</option>
                    <option value="Yesterday" style={{background: darkMode ? '#0f172a' : '#fff'}}>Yesterday</option>
                    <option value="Last7Days" style={{background: darkMode ? '#0f172a' : '#fff'}}>Last 7 Days</option>
                    <option value="AllTime" style={{background: darkMode ? '#0f172a' : '#fff'}}>All Time</option>
                  </Form.Select>
                </Box>
              </>
            )}
          </Nav>
          
          <Box display="flex" alignItems="center">
            <IconButton onClick={toggleTheme} sx={{ mr: 2 }} color="primary">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {user ? (
              <Box display="flex" alignItems="center">
                <Avatar 
                  onClick={() => navigate('/profile')} 
                  sx={{ width: 35, height: 35, bgcolor: '#6366f1', mr: 2, cursor: 'pointer' }}
                >
                  {user.name[0].toUpperCase()}
                </Avatar>
                <Button variant="outline-danger" size="sm" onClick={logout}>Logout</Button>
              </Box>
            ) : (
              <Nav.Link as={Link} to="/login" style={{ color: darkMode ? 'white' : 'black' }}>Login</Nav.Link>
            )}
          </Box>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;