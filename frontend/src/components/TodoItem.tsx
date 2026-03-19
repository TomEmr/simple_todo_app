import React, { useState } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
  TextField,
  Stack,
  Tooltip,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateTodoTitleMutation, useToggleTodoCompletedMutation, useDeleteTodoMutation } from '../api/todoApi';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const [updateTodoTitle] = useUpdateTodoTitleMutation();
  const [toggleTodoCompleted] = useToggleTodoCompletedMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleUpdateTitle = async (): Promise<void> => {
    if (!newTitle.trim()) return;
    try {
      await updateTodoTitle({ id: todo.id, title: newTitle }).unwrap();
      setIsEditing(false);
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
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

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
    }
  };

  const handleComplete = async (): Promise<void> => {
    try {
      await toggleTodoCompleted(todo.id).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <ListItem
        sx={{
          borderRadius: 2,
          mb: 0.5,
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'background-color 0.2s',
        }}
        secondaryAction={
          <Stack direction="row" spacing={0.5}>
            {!isEditing && (
              <Tooltip title="Edit task">
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{ color: 'warning.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete task">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Tooltip
            title={
              todo.completed ? 'Mark as incomplete' : 'Mark as complete'
            }
          >
            <Checkbox
              edge="start"
              checked={todo.completed}
              onChange={handleComplete}
              color="secondary"
            />
          </Tooltip>
        </ListItemIcon>

        {isEditing ? (
          <Stack
            component="form"
            onSubmit={handleSubmit}
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flexGrow: 1, mr: 8 }}
          >
            <TextField
              size="small"
              value={newTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
              autoFocus
              fullWidth
              variant="standard"
            />
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={() => handleUpdateTitle()}
                sx={{ color: 'success.main' }}
              >
                <DoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={handleCancelEdit}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <ListItemText
            primary={todo.title}
            sx={{
              mr: 8,
              '& .MuiListItemText-primary': {
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              },
            }}
          />
        )}
      </ListItem>
      <Divider component="li" variant="inset" />
    </>
  );
};

export default TodoItem;
