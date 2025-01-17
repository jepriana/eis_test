import React, { useState, useContext } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authContext) {
      try {
        await authContext.loginUser(username, password);
        navigate('/dashboard');
      } catch (error) {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography variant="h4">Login</Typography>
        {error && ( 
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}> {error} </Alert> 
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
