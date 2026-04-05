import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, ButtonBase, Typography, Fab, useTheme } from '@mui/material';
import {
  FormatListBulletedSharp,
  TodaySharp,
  PersonOutlineSharp,
} from '@mui/icons-material';
import { Plus } from 'lucide-react';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface MobileBottomNavProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function MobileBottomNav({
  selectedFilter,
  onFilterChange,
}: MobileBottomNavProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname.includes('/profile');

  const navItems = [
    {
      icon: <FormatListBulletedSharp sx={{ fontSize: 24 }} />,
      label: 'All Tasks',
      isActive: !isProfile && selectedFilter === 'all',
      onClick: () => {
        onFilterChange('all');
        navigate('/app/tasks');
      },
    },
    {
      icon: <TodaySharp sx={{ fontSize: 24 }} />,
      label: 'Today',
      isActive: !isProfile && selectedFilter === 'today',
      onClick: () => {
        onFilterChange('today');
        navigate('/app/tasks');
      },
    },
    {
      icon: <PersonOutlineSharp sx={{ fontSize: 24 }} />,
      label: 'Profile',
      isActive: isProfile,
      onClick: () => navigate('/app/profile'),
    },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: tokens.card,
        borderTop: `1px solid ${tokens.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.slice(0, 2).map((item) => (
        <ButtonBase
          key={item.label}
          onClick={item.onClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            borderRadius: '12px',
            color: item.isActive ? '#FF8400' : tokens.mutedForeground,
          }}
        >
          {item.icon}
          <Typography sx={{ fontSize: 11, fontWeight: item.isActive ? 600 : 400 }}>
            {item.label}
          </Typography>
        </ButtonBase>
      ))}

      {/* Center FAB */}
      <Fab
        sx={{
          width: 56,
          height: 56,
          backgroundColor: '#FF8400',
          color: '#111111',
          boxShadow: '0 4px 16px rgba(255,132,0,0.4)',
          marginTop: '-28px',
          '&:hover': {
            backgroundColor: '#E67700',
          },
        }}
      >
        <Plus size={24} />
      </Fab>

      {navItems.slice(2).map((item) => (
        <ButtonBase
          key={item.label}
          onClick={item.onClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            borderRadius: '12px',
            color: item.isActive ? '#FF8400' : tokens.mutedForeground,
          }}
        >
          {item.icon}
          <Typography sx={{ fontSize: 11, fontWeight: item.isActive ? 600 : 400 }}>
            {item.label}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
