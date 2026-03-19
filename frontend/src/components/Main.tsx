import React, { useState, useMemo } from 'react';
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
  CircularProgress,
  Fade,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UndoIcon from '@mui/icons-material/Undo';
import toast from 'react-hot-toast';
import TodoList from './TodoList';
import { useLogoutMutation } from '../api/authApi';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useDeleteAllCompletedMutation,
  useToggleTodoCompletedMutation,
  useReorderTodosMutation,
} from '../api/todoApi';
import { FilterKey, FilterOption, Todo } from '../types';

const FILTERS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const username = localStorage.getItem('username') || 'Guest';

  const { data: todos = [], isLoading, isFetching } = useGetTodosQuery(filter);
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [deleteAllCompleted, { isLoading: isDeleting }] = useDeleteAllCompletedMutation();
  const [toggleTodoCompleted] = useToggleTodoCompletedMutation();
  const [reorderTodos] = useReorderTodosMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const filteredTodos = useMemo(() => {
    if (!search.trim()) return todos;
    const q = search.toLowerCase();
    return todos.filter((t) => t.title.toLowerCase().includes(q));
  }, [todos, search]);

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTodo({ title }).unwrap();
      setTitle('');
      toast.success('Task added');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteAllCompleted = async (): Promise<void> => {
    setConfirmOpen(false);
    try {
      await deleteAllCompleted().unwrap();
      toast.success('Completed tasks removed');
    } catch {
      toast.error('Failed to remove completed tasks');
    }
  };

  const handleSelectAll = async (): Promise<void> => {
    const activeTodos = todos.filter((t) => !t.completed);
    try {
      await Promise.all(activeTodos.map((t) => toggleTodoCompleted(t.id).unwrap()));
      toast.success('All tasks completed');
    } catch {
      toast.error('Failed to complete tasks');
    }
  };

  const handleDeselectAll = async (): Promise<void> => {
    const completedTodos = todos.filter((t) => t.completed);
    try {
      await Promise.all(completedTodos.map((t) => toggleTodoCompleted(t.id).unwrap()));
      toast.success('All tasks uncompleted');
    } catch {
      toast.error('Failed to uncomplete tasks');
    }
  };

  const handleReorder = async (reorderedTodos: Todo[]): Promise<void> => {
    try {
      await reorderTodos(reorderedTodos.map((t) => t.id)).unwrap();
    } catch {
      toast.error('Failed to reorder tasks');
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
    } catch {
      // Logout anyway
    }
    localStorage.removeItem('username');
    navigate('/');
  };

  const getFilterLabel = (f: FilterOption): string => {
    if (f.key === 'all') return `All (${todos.length})`;
    if (f.key === 'active') return `Active (${activeCount})`;
    return `Done (${completedCount})`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F1F5F9' }}>
      {/* AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
      >
        <Toolbar>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.75rem' }}>STA</Typography>
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {username}'s Tasks
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={isLoggingOut ? <CircularProgress size={18} color="inherit" /> : <LogoutIcon />}
            disabled={isLoggingOut}
            sx={{ borderRadius: 2, opacity: 0.9, '&:hover': { opacity: 1 } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Section 1: Add Task */}
        <Fade in timeout={300}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
              New Task
            </Typography>
            <Box component="form" onSubmit={handleAddTodo}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isCreating}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCreating || !title.trim()}
                  sx={{
                    minWidth: 48,
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    '&:hover': { background: 'linear-gradient(135deg, #4338CA, #6D28D9)' },
                    '&.Mui-disabled': { color: '#FFFFFF', background: '#C7D2FE' },
                  }}
                >
                  {isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>

        {/* Section 2: Filters + Search */}
        <Fade in timeout={400}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
              {FILTERS.map((f) => (
                <Chip
                  key={f.key}
                  label={getFilterLabel(f)}
                  onClick={() => setFilter(f.key)}
                  color={filter === f.key ? 'primary' : 'default'}
                  variant={filter === f.key ? 'filled' : 'outlined'}
                  size="small"
                  sx={{
                    ...(filter !== f.key && {
                      borderColor: '#CBD5E1',
                      color: '#64748B',
                    }),
                  }}
                />
              ))}
              {isFetching && <CircularProgress size={16} sx={{ color: '#94A3B8' }} />}
              <Box sx={{ flexGrow: 1 }} />
              {activeCount > 0 && (
                <Tooltip title="Complete all">
                  <IconButton size="small" onClick={handleSelectAll} sx={{ color: '#94A3B8', '&:hover': { color: '#4F46E5' } }}>
                    <CheckCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {completedCount > 0 && (
                <Tooltip title="Uncomplete all">
                  <IconButton size="small" onClick={handleDeselectAll} sx={{ color: '#94A3B8', '&:hover': { color: '#4F46E5' } }}>
                    <UndoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F8FAFC',
                  '& fieldset': { borderColor: '#E2E8F0' },
                },
              }}
            />
          </Paper>
        </Fade>

        {/* Section 3: Task List */}
        <Fade in timeout={500}>
          <Paper elevation={0} sx={{ p: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                Tasks
              </Typography>
              {completedCount > 0 && (
                <Button
                  size="small"
                  startIcon={isDeleting ? <CircularProgress size={14} /> : <DeleteSweepIcon sx={{ fontSize: 16 }} />}
                  onClick={() => setConfirmOpen(true)}
                  disabled={isDeleting}
                  sx={{
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' },
                  }}
                >
                  Clear done ({completedCount})
                </Button>
              )}
            </Stack>

            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: '#94A3B8' }} />
              </Box>
            ) : filteredTodos.length === 0 ? (
              <Fade in>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography sx={{ fontSize: 40, mb: 1, opacity: 0.4 }}>
                    {search ? '\uD83D\uDD0D' : '\u2728'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {search
                      ? 'No matching tasks'
                      : filter === 'all'
                      ? 'No tasks yet'
                      : `No ${filter} tasks`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                    {search
                      ? 'Try a different search term.'
                      : filter === 'all'
                      ? 'Add your first task above!'
                      : 'Try a different filter.'}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <TodoList todos={filteredTodos} onReorder={handleReorder} />
            )}
          </Paper>
        </Fade>
      </Container>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>Remove completed tasks?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button onClick={handleDeleteAllCompleted} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Main;
