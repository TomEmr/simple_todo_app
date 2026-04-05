import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useGetMeQuery } from '../api/authApi';

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { data, isLoading, isError } = useGetMeQuery();

  // Also check localStorage as a fallback for faster redirect
  const hasLocalUser = Boolean(localStorage.getItem('taskly-user'));

  if (isLoading) {
    // Show spinner only if we think we might be authenticated
    if (hasLocalUser) {
      return (
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#FF8400' }} />
        </Box>
      );
    }
    // If no local user, redirect immediately
    return <Navigate to="/" replace />;
  }

  if (isError || !data) {
    // Clear stale localStorage
    localStorage.removeItem('taskly-user');
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
