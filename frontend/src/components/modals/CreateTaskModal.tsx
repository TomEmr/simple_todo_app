import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  InputBase,
  ButtonBase,
  Select,
  MenuItem,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateTaskMutation } from '../../api/todoApi';
import { useGetCategoriesQuery } from '../../api/categoryApi';
import type { CreateTaskRequest } from '../../types';
import {
  lightTokens,
  darkTokens,
  fontPrimary,
} from '../../theme/tokens';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setDueDate('');
    setPriority('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const body: CreateTaskRequest = {
      title: title.trim(),
    };

    if (description.trim()) body.description = description.trim();
    if (dueDate) body.dueDate = dueDate;
    if (priority) body.priority = priority;
    if (categoryId !== '') body.categoryId = categoryId as number;

    try {
      await createTask(body).unwrap();
      toast.success('Task created');
      resetForm();
      onClose();
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const priorities: { value: Priority; label: string }[] = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 560,
          maxWidth: '95vw',
          borderRadius: '16px',
          padding: '32px',
          backgroundColor: tokens.card,
          backgroundImage: 'none',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontPrimary,
            fontSize: 20,
            fontWeight: 700,
            color: tokens.foreground,
          }}
        >
          Create New Task
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            width: 32,
            height: 32,
            backgroundColor: tokens.muted,
            color: tokens.mutedForeground,
            '&:hover': { backgroundColor: tokens.secondary },
          }}
        >
          <X size={16} />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: tokens.border, mb: 3 }} />

      {/* Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
            Task Title
          </Typography>
          <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            sx={{
              height: 44,
              borderRadius: '8px',
              backgroundColor: tokens.background,
              border: `1px solid ${tokens.input}`,
              padding: '0 16px',
              fontSize: 14,
              color: tokens.foreground,
              '& input::placeholder': {
                color: tokens.mutedForeground,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
            Description
          </Typography>
          <InputBase
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            multiline
            rows={3}
            sx={{
              minHeight: 88,
              borderRadius: '8px',
              backgroundColor: tokens.background,
              border: `1px solid ${tokens.input}`,
              padding: '12px 16px',
              fontSize: 14,
              color: tokens.foreground,
              alignItems: 'flex-start',
              '& textarea::placeholder': {
                color: tokens.mutedForeground,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Category + Due Date row */}
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
              Category
            </Typography>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as number | '')}
              displayEmpty
              size="small"
              sx={{
                height: 44,
                borderRadius: '8px',
                backgroundColor: tokens.background,
                fontSize: 14,
                color: tokens.foreground,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: tokens.input,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: tokens.ring,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: tokens.popover,
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: 14, color: tokens.mutedForeground }}>
                  No category
                </Typography>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Typography sx={{ fontSize: 14, color: tokens.foreground }}>
                    {cat.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
              Due Date
            </Typography>
            <InputBase
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              sx={{
                height: 44,
                borderRadius: '8px',
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.input}`,
                padding: '0 16px',
                fontSize: 14,
                color: tokens.foreground,
                '& input::-webkit-calendar-picker-indicator': {
                  filter:
                    theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
                },
              }}
            />
          </Box>
        </Box>

        {/* Priority */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
            Priority
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {priorities.map(({ value, label }) => {
              const isActive = priority === value;
              return (
                <ButtonBase
                  key={value}
                  onClick={() => setPriority(isActive ? '' : value)}
                  sx={{
                    flex: 1,
                    height: 40,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#FF8400' : 'transparent',
                    border: isActive
                      ? '1px solid #FF8400'
                      : `1px solid ${tokens.input}`,
                    color: isActive ? '#111111' : tokens.foreground,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: tokens.border, mt: 3, mb: 2 }} />

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <ButtonBase
          onClick={handleClose}
          sx={{
            height: 40,
            padding: '0 20px',
            borderRadius: '8px',
            border: `1px solid ${tokens.border}`,
            color: tokens.foreground,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Cancel
        </ButtonBase>
        <ButtonBase
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            height: 40,
            padding: '0 20px',
            borderRadius: '8px',
            backgroundColor: '#FF8400',
            color: '#111111',
            fontSize: 14,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#E67700' },
            '&:disabled': { opacity: 0.7 },
          }}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </ButtonBase>
      </Box>
    </Dialog>
  );
}
