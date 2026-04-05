import { createTheme } from '@mui/material/styles';
import { lightTokens, darkTokens, fontPrimary, fontSecondary } from './tokens';

export function getTheme(mode: 'light' | 'dark') {
  const tokens = mode === 'light' ? lightTokens : darkTokens;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
      },
      background: {
        default: tokens.background,
        paper: tokens.card,
      },
      error: {
        main: tokens.destructive,
      },
      text: {
        primary: tokens.foreground,
        secondary: tokens.mutedForeground,
      },
    },
    typography: {
      fontFamily: fontSecondary,
      h1: { fontFamily: fontPrimary },
      h2: { fontFamily: fontPrimary },
      h3: { fontFamily: fontPrimary },
      h4: { fontFamily: fontPrimary },
      h5: { fontFamily: fontPrimary },
      h6: { fontFamily: fontPrimary },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
    },
  });
}
