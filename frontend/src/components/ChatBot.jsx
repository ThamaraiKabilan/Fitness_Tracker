import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, IconButton, TextField, Typography, Stack, Avatar } from '@mui/material';
import { Close, Send, SmartToy, FitnessCenter } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: 'bot', text: 'Hello! I am your FitFlow AI. Need workout tips or meal ideas?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [chatLog]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', text: message };
    setChatLog(prev => [...prev, userMsg]);
    setLoading(true);
    setMessage("");

    try {
      // Ensure the URL matches your backend route exactly
      const { data } = await API.post('/chat', { message });
      setChatLog(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      // THIS WILL SHOW US THE REAL PROBLEM
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Chat Error:", err);
      setChatLog(prev => [...prev, { role: 'bot', text: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 2000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8, transformOrigin: 'bottom right' }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
          >
            <Paper elevation={12} sx={{ width: 350, height: 480, mb: 2, display: 'flex', flexDirection: 'column', borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
              {/* Header */}
              <Box sx={{ p: 2.5, bgcolor: '#6366f1', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'white', color: '#6366f1' }}><FitnessCenter /></Avatar>
                  <Box>
                    <Typography fontWeight="800" variant="body1">FitFlow Assistant</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Online & Ready</Typography>
                  </Box>
                </Stack>
                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
              </Box>

              {/* Chat Window */}
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {chatLog.map((chat, i) => (
                  <Box key={i} sx={{ alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <Paper sx={{ 
                      p: 1.5, 
                      px: 2, 
                      borderRadius: chat.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0', 
                      bgcolor: chat.role === 'user' ? '#6366f1' : 'white', 
                      color: chat.role === 'user' ? 'white' : '#1e293b',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{chat.text}</Typography>
                    </Paper>
                  </Box>
                ))}
                {loading && (
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>AI is writing...</Typography>
                )}
                <div ref={chatEndRef} />
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 1 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Ask about diet or workout..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSend} 
                  disabled={!message.trim()}
                  sx={{ bgcolor: '#6366f1', color: 'white', '&:hover': { bgcolor: '#4f46e5' }, '&.Mui-disabled': { bgcolor: '#e2e8f0' } }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <IconButton 
          onClick={() => setIsOpen(!isOpen)} 
          sx={{ 
            width: 65, 
            height: 65, 
            bgcolor: '#6366f1', 
            color: 'white', 
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)', 
            '&:hover': { bgcolor: '#4f46e5' } 
          }}
        >
          {isOpen ? <Close fontSize="large" /> : <SmartToy fontSize="large" />}
        </IconButton>
      </motion.div>
    </Box>
  );
};

export default ChatBot;