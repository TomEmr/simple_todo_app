import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import {
  CheckCircleSharp,
  RadioButtonUncheckedSharp,
  DeleteOutlineSharp,
} from '@mui/icons-material';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../../api/todoApi';
import CategoryBadge from '../shared/CategoryBadge';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import type { Task } from '../../types';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface TaskItemProps {
  task: Task;
}

function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export default function TaskItem({ task }: TaskItemProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleCompleted = async () => {
    try {
      await updateTask({ id: task.id, completed: !task.completed }).unwrap();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
      toast.success('Task deleted');
      setShowDeleteModal(false);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const dueDateText = formatDueDate(task.dueDate);

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: `1px solid ${tokens.border}`,
          opacity: isDragging ? 0.5 : task.completed ? 0.6 : 1,
          backgroundColor: isDragging ? tokens.muted : 'transparent',
          padding: '0 32px',
          '&:hover .drag-handle': {
            opacity: 1,
          },
          '&:hover .delete-btn': {
            opacity: 1,
          },
        }}
      >
        {/* Drag handle */}
        <Box
          className="drag-handle"
          {...attributes}
          {...listeners}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'grab',
            color: tokens.mutedForeground,
            opacity: 0,
            transition: 'opacity 0.15s ease',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <GripVertical size={16} />
        </Box>

        {/* Checkbox */}
        <IconButton
          onClick={handleToggleCompleted}
          sx={{
            padding: 0,
            color: task.completed ? '#FF8400' : tokens.mutedForeground,
          }}
        >
          {task.completed ? (
            <CheckCircleSharp sx={{ fontSize: 24 }} />
          ) : (
            <RadioButtonUncheckedSharp sx={{ fontSize: 24 }} />
          )}
        </IconButton>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: task.completed ? 400 : 500,
              color: task.completed ? tokens.mutedForeground : tokens.foreground,
              textDecoration: task.completed ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </Typography>
          {dueDateText && (
            <Typography
              sx={{
                fontSize: 12,
                color: tokens.mutedForeground,
                lineHeight: 1.3,
              }}
            >
              {dueDateText}
            </Typography>
          )}
        </Box>

        {/* Category badge */}
        {task.categoryName && task.categoryColor && task.categoryTextColor && (
          <CategoryBadge
            name={task.categoryName}
            color={task.categoryColor}
            textColor={task.categoryTextColor}
          />
        )}

        {/* Delete button */}
        <IconButton
          className="delete-btn"
          onClick={() => setShowDeleteModal(true)}
          sx={{
            padding: '4px',
            color: tokens.mutedForeground,
            opacity: 0,
            transition: 'opacity 0.15s ease',
            '&:hover': { color: tokens.destructive },
          }}
        >
          <DeleteOutlineSharp sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
