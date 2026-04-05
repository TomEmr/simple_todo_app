import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { NotificationsNoneOutlined } from '@mui/icons-material';
import { useGetMeQuery } from '../../api/authApi';
import UserAvatar from '../shared/UserAvatar';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const { data: user } = useGetMeQuery();

  return (
    <Box
      sx={{
        height: 72,
        minHeight: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: `1px solid ${tokens.border}`,
        backgroundColor: tokens.card,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: tokens.foreground,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontSize: 13,
              color: tokens.mutedForeground,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconButton
          sx={{
            width: 36,
            height: 36,
            backgroundColor: tokens.secondary,
            '&:hover': { backgroundColor: tokens.sidebarAccent },
          }}
        >
          <NotificationsNoneOutlined
            sx={{ fontSize: 20, color: tokens.mutedForeground }}
          />
        </IconButton>
        <UserAvatar name={user?.name || 'User'} size={36} />
      </Box>
    </Box>
  );
}
