import React from 'react';
import { Box, InputBase, ButtonBase, useTheme } from '@mui/material';
import { Search, Plus } from 'lucide-react';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddTask: () => void;
}

export default function ActionBar({ searchQuery, onSearchChange, onAddTask }: ActionBarProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 32px',
      }}
    >
      {/* Search input */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: 44,
          borderRadius: 999,
          backgroundColor: tokens.card,
          border: `1px solid ${tokens.border}`,
          padding: '0 16px',
        }}
      >
        <Search size={18} color={tokens.mutedForeground} />
        <InputBase
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          sx={{
            flex: 1,
            fontSize: 14,
            color: tokens.foreground,
            '& input::placeholder': {
              color: tokens.mutedForeground,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Add Task button */}
      <ButtonBase
        onClick={onAddTask}
        sx={{
          height: 44,
          borderRadius: 999,
          backgroundColor: '#FF8400',
          color: '#111111',
          padding: '0 20px',
          gap: '8px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: 14,
          whiteSpace: 'nowrap',
          '&:hover': { backgroundColor: '#E67700' },
        }}
      >
        <Plus size={18} />
        Add Task
      </ButtonBase>
    </Box>
  );
}
