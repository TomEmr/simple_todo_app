import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  ButtonBase,
  InputBase,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLoginMutation, useRegisterMutation } from '../../api/authApi';
import type { LoginFormData } from '../../types';
import {
  lightTokens,
  darkTokens,
  fontPrimary,
} from '../../theme/tokens';

type TabValue = 'login' | 'register';

interface StyledInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function StyledInput({ label, type = 'text', value, onChange, placeholder }: StyledInputProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Typography
        sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}
      >
        {label}
      </Typography>
      <InputBase
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          height: 40,
          borderRadius: 999,
          backgroundColor: tokens.background,
          border: `1px solid ${tokens.input}`,
          padding: '0 16px',
          fontSize: 14,
          color: tokens.foreground,
          '& input::placeholder': {
            color: tokens.mutedForeground,
            opacity: 1,
          },
        }}
      />
    </Box>
  );
}

function TabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box
      sx={{
        display: 'flex',
        height: 44,
        borderRadius: 999,
        backgroundColor: tokens.secondary,
        padding: '4px',
        gap: '4px',
      }}
    >
      {(['login', 'register'] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <ButtonBase
            key={tab}
            onClick={() => onTabChange(tab)}
            sx={{
              flex: 1,
              borderRadius: 999,
              backgroundColor: isActive ? tokens.card : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? tokens.foreground : tokens.mutedForeground,
              }}
            >
              {tab === 'login' ? 'Login' : 'Register'}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default function AuthPage() {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('login');

  // Login state
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [loginData, setLoginData] = useState<LoginFormData>({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginData).unwrap();
      localStorage.setItem('taskly-user', JSON.stringify(result));
      toast.success('Welcome back!');
      navigate('/app/tasks');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }).unwrap();
      toast.success('Account created! Please sign in.');
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  const isLogin = activeTab === 'login';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: tokens.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Box
        component="form"
        onSubmit={isLogin ? handleLogin : handleRegister}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: '24px',
          backgroundColor: tokens.card,
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: '#FF8400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={18} color="#111111" strokeWidth={3} />
          </Box>
          <Typography sx={{ fontFamily: fontPrimary, fontSize: 22, fontWeight: 700 }}>
            Taskly
          </Typography>
        </Box>

        {/* Heading */}
        <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 0.5 }}>
          {isLogin ? 'Welcome back' : 'Create your account'}
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.mutedForeground, mb: 3 }}>
          {isLogin
            ? 'Sign in to your account to continue'
            : 'Join Taskly and start organizing your tasks'}
        </Typography>

        {/* Tab Switcher */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', mt: 3 }}>
          {!isLogin && (
            <StyledInput
              label="Full name"
              value={registerData.name}
              onChange={(val) => setRegisterData((p) => ({ ...p, name: val }))}
              placeholder="John Doe"
            />
          )}
          <StyledInput
            label="Email address"
            type="email"
            value={isLogin ? loginData.email : registerData.email}
            onChange={(val) =>
              isLogin
                ? setLoginData((p) => ({ ...p, email: val }))
                : setRegisterData((p) => ({ ...p, email: val }))
            }
            placeholder="you@example.com"
          />
          <StyledInput
            label="Password"
            type="password"
            value={isLogin ? loginData.password : registerData.password}
            onChange={(val) =>
              isLogin
                ? setLoginData((p) => ({ ...p, password: val }))
                : setRegisterData((p) => ({ ...p, password: val }))
            }
            placeholder={isLogin ? 'Enter your password' : 'Create a password'}
          />
          {!isLogin && (
            <StyledInput
              label="Confirm password"
              type="password"
              value={registerData.confirmPassword}
              onChange={(val) => setRegisterData((p) => ({ ...p, confirmPassword: val }))}
              placeholder="Repeat your password"
            />
          )}
        </Box>

        {/* Login extras */}
        {isLogin && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              mb: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ '&.Mui-checked': { color: '#FF8400' } }}
                />
              }
              label={
                <Typography sx={{ fontSize: 13, color: tokens.mutedForeground }}>
                  Remember me
                </Typography>
              }
            />
            <Typography
              sx={{
                fontSize: 13,
                color: '#FF8400',
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Typography>
          </Box>
        )}

        {/* Submit Button */}
        <ButtonBase
          type="submit"
          disabled={loginLoading || registerLoading}
          sx={{
            width: '100%',
            height: 40,
            borderRadius: 999,
            backgroundColor: '#FF8400',
            color: '#111111',
            fontWeight: 600,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: isLogin ? 2 : 3,
            '&:hover': { backgroundColor: '#E67700' },
            '&:disabled': { opacity: 0.7 },
          }}
        >
          {(loginLoading || registerLoading) ? (
            <CircularProgress size={20} color="inherit" />
          ) : isLogin ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </ButtonBase>

        {/* Footer */}
        <Typography
          sx={{
            fontSize: 13,
            color: tokens.mutedForeground,
            textAlign: 'center',
            mt: 3,
          }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Box
            component="span"
            onClick={() => setActiveTab(isLogin ? 'register' : 'login')}
            sx={{
              color: '#FF8400',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
