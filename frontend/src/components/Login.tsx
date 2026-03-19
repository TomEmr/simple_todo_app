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
  Fade,
} from '@mui/material';
import { useLoginMutation } from '../api/authApi';
import { LoginFormData } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      localStorage.setItem('username', response.userName);
      navigate('/main');
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error.data?.message || 'Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Fade in timeout={600}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ p: 5, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                    STA
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Simple Todo
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary">
                Welcome back! Sign in to continue.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Stack spacing={2.5}>
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
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                      },
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 600 }}>
                  Create one
                </Link>
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default Login;
