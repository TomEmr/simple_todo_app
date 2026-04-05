import React from 'react';
import { Box, Typography } from '@mui/material';

interface CategoryBadgeProps {
  name: string;
  color: string;
  textColor: string;
}

export default function CategoryBadge({ name, color, textColor }: CategoryBadgeProps) {
  return (
    <Box
      sx={{
        height: 24,
        borderRadius: 999,
        padding: '0 10px',
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: color,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: textColor,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
