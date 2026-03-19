import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import ProtectedRoute from './components/ProtectedRoute';
import './global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            fontFamily: '"Inter", "Roboto", sans-serif',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
