import React from 'react';
import { Box, Typography, ButtonBase, useTheme } from '@mui/material';
import { AssignmentOutlined } from '@mui/icons-material';
import { Plus } from 'lucide-react';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface EmptyStateProps {
  onAddTask: () => void;
}

export default function EmptyState({ onAddTask }: EmptyStateProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px',
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: tokens.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AssignmentOutlined sx={{ fontSize: 40, color: tokens.mutedForeground }} />
      </Box>

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: tokens.foreground,
        }}
      >
        No tasks yet
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: tokens.mutedForeground,
          textAlign: 'center',
        }}
      >
        Add your first task to get started
      </Typography>

      <ButtonBase
        onClick={onAddTask}
        sx={{
          height: 48,
          borderRadius: 999,
          backgroundColor: '#FF8400',
          color: '#111111',
          padding: '0 24px',
          gap: '8px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: 15,
          mt: 1,
          '&:hover': { backgroundColor: '#E67700' },
        }}
      >
        <Plus size={20} />
        Add your first task
      </ButtonBase>
    </Box>
  );
}
