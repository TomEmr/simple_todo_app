import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useApiCall from '../hooks/useApiCall.ts';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { makeApiCall } = useApiCall();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerUrl = `${process.env.REACT_APP_API_BASE_URL}/register`;
    const [data, err] = await makeApiCall({
      url: registerUrl,
      method: 'POST',
      data: formData,
    });
    if (data) {
      setSuccess('Registration successful! You can now log in.');
      setFormData({ userName: '', password: '', email: '' });
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
            <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" color="primary">
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Register a new account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%' }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
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
                  Register
                </Button>
              </Stack>
            </Box>

            <Link component={RouterLink} to="/" underline="hover">
              Already have an account? Login here
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
