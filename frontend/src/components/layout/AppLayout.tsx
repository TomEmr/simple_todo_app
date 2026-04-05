import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

export default function AppLayout() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isMobile && (
        <Sidebar
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pb: isMobile ? '80px' : 0,
        }}
      >
        <Outlet context={{ selectedFilter, setSelectedFilter }} />
      </Box>

      {isMobile && (
        <MobileBottomNav
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      )}
    </Box>
  );
}
