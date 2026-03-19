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
import useApiCall from '../hooks/useApiCall.ts';

const TodoItem = ({ todo, fetchTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const { makeApiCall } = useApiCall();

  const handleUpdateTitle = async () => {
    if (!newTitle.trim()) return;
    const updateTitleUrl = `${process.env.REACT_APP_API_TASK_URL}/${todo.id}/title`;
    const [data, error] = await makeApiCall({
      url: updateTitleUrl,
      method: 'PATCH',
      data: { title: newTitle },
    });
    if (data) {
      await fetchTodos();
      setIsEditing(false);
    } else if (error) {
      alert(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateTitle();
  };

  const handleCancelEdit = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const deleteUrl = `${process.env.REACT_APP_API_TASK_URL}/${todo.id}`;
    const [data, error] = await makeApiCall({
      url: deleteUrl,
      method: 'DELETE',
    });
    if (data) {
      await fetchTodos();
    } else if (error) {
      alert(error);
    }
  };

  const handleComplete = async () => {
    const completeUrl = `${process.env.REACT_APP_API_TASK_URL}/${todo.id}/completed`;
    const [data, error] = await makeApiCall({
      url: completeUrl,
      method: 'PATCH',
    });
    if (data) {
      await fetchTodos();
    } else if (error) {
      alert(error);
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
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              fullWidth
              variant="standard"
            />
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={handleSubmit}
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
