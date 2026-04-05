import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  ButtonBase,
  useTheme,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { lightTokens, darkTokens } from '../../theme/tokens';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 440,
          maxWidth: '95vw',
          borderRadius: '16px',
          padding: '32px',
          backgroundColor: tokens.card,
          backgroundImage: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: tokens.colorError,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Trash2 size={24} color={tokens.colorErrorForeground} />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          color: tokens.foreground,
          textAlign: 'center',
          mb: 1,
        }}
      >
        Delete Task?
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: 14,
          color: tokens.mutedForeground,
          textAlign: 'center',
          lineHeight: 1.5,
          mb: 3,
          maxWidth: 320,
        }}
      >
        This action cannot be undone. The task will be permanently removed from your list.
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <ButtonBase
          onClick={onClose}
          sx={{
            width: '100%',
            height: 40,
            borderRadius: '8px',
            border: `1px solid ${tokens.border}`,
            color: tokens.foreground,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Cancel
        </ButtonBase>
        <ButtonBase
          onClick={onConfirm}
          sx={{
            width: '100%',
            height: 40,
            borderRadius: '8px',
            backgroundColor: tokens.destructive,
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 600,
            '&:hover': { opacity: 0.9 },
          }}
        >
          Delete
        </ButtonBase>
      </Box>
    </Dialog>
  );
}
