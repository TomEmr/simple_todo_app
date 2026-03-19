import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import TodoList from './TodoList';
import useApiCall from '../hooks/useApiCall.ts';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const Main = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const { makeApiCall } = useApiCall();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchTodos = useCallback(
    async (filter = 'all') => {
      let todosUrl = `${process.env.REACT_APP_API_TASK_URL}`;
      if (filter !== 'all') {
        todosUrl += `?status=${filter}`;
      }
      const [data, error] = await makeApiCall({ url: todosUrl, method: 'GET' });
      if (data) {
        setTodos(data);
      } else if (error) {
        alert(error);
      }
    },
    [makeApiCall]
  );

  useEffect(() => {
    (async () => {
      await fetchTodos(filter);
    })();
  }, [filter, fetchTodos]);

  const handleAddTodo = async () => {
    if (!title.trim()) return;
    const todosUrl = `${process.env.REACT_APP_API_TASK_URL}`;
    const [data, error] = await makeApiCall({
      url: todosUrl,
      method: 'POST',
      data: { title },
    });
    if (data) {
      setTodos([...todos, data]);
      setTodo('');
    } else if (error) {
      alert(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleAddTodo();
  };

  const handleDeleteAllCompleted = async () => {
    const deleteAllCompletedUrl = `${process.env.REACT_APP_API_TASK_URL}`;
    const [data, error] = await makeApiCall({
      url: deleteAllCompletedUrl,
      method: 'DELETE',
    });
    if (data) {
      await fetchTodos(filter);
    } else if (error) {
      alert(error);
    }
  };

  const handleLogout = async () => {
    const logoutUrl = `${process.env.REACT_APP_API_BASE_URL}/logout`;
    const [data, error] = await makeApiCall({
      url: logoutUrl,
      method: 'GET',
    });
    if (data) {
      localStorage.removeItem('username');
      navigate('/');
    } else if (error) {
      alert(error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {username}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Header */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            My Tasks
          </Typography>

          {/* Add Todo Form */}
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTodo(e.target.value)}
              />
              <IconButton
                type="submit"
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  borderRadius: 2,
                  px: 2,
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Filter Chips */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {FILTERS.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                onClick={() => setFilter(f.key)}
                color={filter === f.key ? 'primary' : 'default'}
                variant={filter === f.key ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>

          {/* Todo List */}
          <TodoList todos={todos} fetchTodos={() => fetchTodos(filter)} />

          {/* Remove Completed */}
          {todos.some((t) => t.completed) && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Tooltip title="Remove all completed tasks">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleDeleteAllCompleted}
                  size="small"
                >
                  Remove Completed
                </Button>
              </Tooltip>
            </Box>
          )}

          {/* Empty State */}
          {todos.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {filter === 'all'
                  ? 'No tasks yet. Add one above!'
                  : `No ${filter} tasks.`}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Main;
