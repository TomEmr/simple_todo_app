import React from 'react';
import { Box, Typography } from '@mui/material';

interface UserAvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserAvatar({ name, size = 36 }: UserAvatarProps) {
  const fontSize = size * 0.4;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 999,
        backgroundColor: '#FF8400',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#111111',
          fontWeight: 700,
          fontSize,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {getInitials(name)}
      </Typography>
    </Box>
  );
}
