import React, { useEffect, useState } from 'react';
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
import { useLogoutMutation } from '../api/authApi';
import { useGetTodosQuery, useCreateTodoMutation, useDeleteAllCompletedMutation } from '../api/todoApi';
import { FilterKey, FilterOption } from '../types';

const FILTERS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTodo] = useState<string>('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || 'Guest');

  const { data: todos = [] } = useGetTodosQuery(filter);
  const [createTodo] = useCreateTodoMutation();
  const [deleteAllCompleted] = useDeleteAllCompletedMutation();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleAddTodo = async (): Promise<void> => {
    if (!title.trim()) return;
    try {
      await createTodo({ title }).unwrap();
      setTodo('');
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await handleAddTodo();
  };

  const handleDeleteAllCompleted = async (): Promise<void> => {
    try {
      await deleteAllCompleted().unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
      localStorage.removeItem('username');
      navigate('/');
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
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
          <TodoList todos={todos} />

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
