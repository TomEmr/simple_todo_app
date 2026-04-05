import React, { useState, useMemo } from 'react';
import { Box, Typography, ButtonBase, useTheme } from '@mui/material';
import { ExpandMoreSharp, ExpandLessSharp } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { useReorderTasksMutation } from '../../api/todoApi';
import TaskItem from './TaskItem';
import type { Task } from '../../types';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
}

export default function TaskList({ tasks, searchQuery }: TaskListProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const [completedExpanded, setCompletedExpanded] = useState(true);
  const [reorderTasks] = useReorderTasksMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  const activeTasks = useMemo(
    () => filtered.filter((t) => !t.completed),
    [filtered]
  );

  const completedTasks = useMemo(
    () => filtered.filter((t) => t.completed),
    [filtered]
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeTasks.findIndex((t) => t.id === active.id);
    const newIndex = activeTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...activeTasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const newOrder = reordered.map((t) => t.id);

    try {
      await reorderTasks(newOrder).unwrap();
    } catch {
      toast.error('Failed to reorder tasks');
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Active tasks with drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {activeTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Completed section */}
      {completedTasks.length > 0 && (
        <>
          <ButtonBase
            onClick={() => setCompletedExpanded(!completedExpanded)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 32px',
              justifyContent: 'flex-start',
              width: '100%',
              borderBottom: `1px solid ${tokens.border}`,
            }}
          >
            {completedExpanded ? (
              <ExpandLessSharp sx={{ fontSize: 20, color: tokens.mutedForeground }} />
            ) : (
              <ExpandMoreSharp sx={{ fontSize: 20, color: tokens.mutedForeground }} />
            )}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: tokens.mutedForeground,
              }}
            >
              Completed ({completedTasks.length})
            </Typography>
          </ButtonBase>

          {completedExpanded &&
            completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
        </>
      )}
    </Box>
  );
}
