import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { getTheme } from './theme';
import AuthPage from './components/auth/AuthPage';
import AppLayout from './components/layout/AppLayout';
import TasksPage from './components/tasks/TasksPage';
import ProfilePage from './components/profile/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import './global.css';

function ThemedApp() {
  const { resolvedMode } = useThemeMode();
  const theme = getTheme(resolvedMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/tasks" replace />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontFamily: '"Geist", "Inter", sans-serif',
            borderRadius: '12px',
          },
        }}
      />
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
