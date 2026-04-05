import React from 'react';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../../context/ThemeContext';
import { useUpdateThemeMutation } from '../../api/userApi';

type ThemeMode = 'system' | 'light' | 'dark';

const options: { value: ThemeMode; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export default function ThemeToggle() {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const [updateTheme] = useUpdateThemeMutation();

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: 999,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#E7E8E5',
        padding: '4px',
        gap: '2px',
      }}
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = mode === value;
        return (
          <ButtonBase
            key={value}
            onClick={() => {
              setMode(value);
              updateTheme({ themePreference: value });
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 999,
              backgroundColor: isActive
                ? theme.palette.background.paper
                : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon size={14} />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                lineHeight: 1,
              }}
            >
              {label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
