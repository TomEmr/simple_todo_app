import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Checkbox,
  TextField,
  Stack,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import toast from 'react-hot-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateTodoTitleMutation, useToggleTodoCompletedMutation, useDeleteTodoMutation } from '../api/todoApi';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updateTodoTitle, { isLoading: isUpdating }] = useUpdateTodoTitleMutation();
  const [toggleTodoCompleted] = useToggleTodoCompletedMutation();
  const [deleteTodo, { isLoading: isDeletePending }] = useDeleteTodoMutation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isDeletePending ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const handleUpdateTitle = async (): Promise<void> => {
    if (!newTitle.trim() || newTitle === todo.title) {
      setIsEditing(false);
      setNewTitle(todo.title);
      return;
    }
    try {
      await updateTodoTitle({ id: todo.id, title: newTitle }).unwrap();
      setIsEditing(false);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await handleUpdateTitle();
  };

  const handleCancelEdit = (): void => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id).unwrap();
      setConfirmDelete(false);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleComplete = async (): Promise<void> => {
    try {
      await toggleTodoCompleted(todo.id).unwrap();
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py: 1,
          mb: 1,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: isDragging ? '#4F46E5' : '#E2E8F0',
          bgcolor: isDragging ? '#F5F3FF' : '#FFFFFF',
          '&:hover': {
            borderColor: '#CBD5E1',
            bgcolor: '#FAFBFC',
          },
          transition: 'all 0.15s ease',
        }}
      >
        {/* Drag Handle */}
        <IconButton
          size="small"
          sx={{
            cursor: 'grab',
            color: '#CBD5E1',
            '&:hover': { color: '#94A3B8' },
            p: 0.5,
          }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Checkbox */}
        <Checkbox
          checked={todo.completed}
          onChange={handleComplete}
          size="small"
          sx={{
            color: '#CBD5E1',
            '&.Mui-checked': { color: '#4F46E5' },
            p: 0.5,
          }}
        />

        {/* Title / Edit */}
        {isEditing ? (
          <Stack
            component="form"
            onSubmit={handleSubmit}
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <TextField
              size="small"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              fullWidth
              variant="standard"
              disabled={isUpdating}
              sx={{ '& .MuiInput-underline:before': { borderColor: '#E2E8F0' } }}
            />
            <Tooltip title="Save">
              <IconButton size="small" onClick={() => handleUpdateTitle()} disabled={isUpdating} sx={{ color: '#4F46E5' }}>
                <DoneIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel (Esc)">
              <IconButton size="small" onClick={handleCancelEdit} sx={{ color: '#94A3B8' }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Typography
            sx={{
              flexGrow: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#94A3B8' : '#1E293B',
              fontWeight: todo.completed ? 400 : 500,
              fontSize: '0.9rem',
              py: 0.5,
            }}
          >
            {todo.title}
          </Typography>
        )}

        {/* Actions */}
        {!isEditing && (
          <Stack direction="row" spacing={0}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{ color: '#CBD5E1', '&:hover': { color: '#4F46E5' }, p: 0.5 }}
              >
                <EditIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => setConfirmDelete(true)}
                disabled={isDeletePending}
                sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444' }, p: 0.5 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {/* Delete Confirmation */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{todo.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDelete(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem;
