import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import useApiCall from '../hooks/useApiCall.ts';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { makeApiCall } = useApiCall();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = `${process.env.REACT_APP_API_BASE_URL}/login`;
    const [data, err] = await makeApiCall({
      url: loginUrl,
      method: 'POST',
      data: formData,
    });
    if (data) {
      localStorage.setItem('username', data.userName);
      navigate('/main');
    } else if (err) {
      setError(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" color="primary">
              Easy To-Do
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Login
                </Button>
              </Stack>
            </Box>

            <Link component={RouterLink} to="/register" underline="hover">
              Don't have an account? Register here
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
