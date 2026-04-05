import React from 'react';
import { Box, Typography, ButtonBase, IconButton, useTheme } from '@mui/material';
import { SortSharp, FilterListSharp } from '@mui/icons-material';
import type { FilterKey } from '../../types';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface FilterTabsProps {
  activeFilter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  allCount: number;
  activeCount: number;
  completedCount: number;
}

const tabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  allCount,
  activeCount,
  completedCount,
}: FilterTabsProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  const counts: Record<FilterKey, number> = {
    all: allCount,
    active: activeCount,
    completed: completedCount,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 32px 0',
      }}
    >
      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: '4px' }}>
        {tabs.map(({ key, label }) => {
          const isActive = activeFilter === key;
          return (
            <ButtonBase
              key={key}
              onClick={() => onFilterChange(key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderBottom: isActive ? '2px solid #FF8400' : '2px solid transparent',
                color: isActive ? '#FF8400' : tokens.mutedForeground,
                transition: 'all 0.15s ease',
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </Typography>
              <Box
                sx={{
                  height: 20,
                  minWidth: 20,
                  borderRadius: 999,
                  backgroundColor: isActive ? '#FF8400' : tokens.secondary,
                  color: isActive ? '#111111' : tokens.mutedForeground,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>
                  {counts[key]}
                </Typography>
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      {/* Sort & Filter buttons */}
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <IconButton
          size="small"
          sx={{
            border: `1px solid ${tokens.border}`,
            borderRadius: 999,
            width: 36,
            height: 36,
            color: tokens.mutedForeground,
          }}
        >
          <SortSharp sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            border: `1px solid ${tokens.border}`,
            borderRadius: 999,
            width: 36,
            height: 36,
            color: tokens.mutedForeground,
          }}
        >
          <FilterListSharp sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
