import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  InputBase,
  ButtonBase,
  Dialog,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CameraAltOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import TopBar from '../layout/TopBar';
import UserAvatar from '../shared/UserAvatar';
import ThemeToggle from '../shared/ThemeToggle';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '../../api/userApi';
import { useLogoutMutation } from '../../api/authApi';
import {
  lightTokens,
  darkTokens,
} from '../../theme/tokens';

function ProfileInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.foreground }}>
        {label}
      </Typography>
      <InputBase
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          height: 40,
          borderRadius: '8px',
          backgroundColor: tokens.background,
          border: `1px solid ${tokens.input}`,
          padding: '0 14px',
          fontSize: 14,
          color: tokens.foreground,
          '& input::placeholder': { color: tokens.mutedForeground, opacity: 1 },
        }}
      />
    </Box>
  );
}

function Card({
  children,
  destructive,
}: {
  children: React.ReactNode;
  destructive?: boolean;
}) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <Box
      sx={{
        borderRadius: '16px',
        backgroundColor: tokens.card,
        border: `1px solid ${destructive ? tokens.destructive : tokens.border}`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {children}
    </Box>
  );
}

export default function ProfilePage() {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:767px)');

  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [logout] = useLogoutMutation();

  // Account form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Delete confirm
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, email }).unwrap();
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Both fields are required');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      toast.error('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Password is required');
      return;
    }
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      localStorage.removeItem('taskly-user');
      toast.success('Account deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Continue even on error
    }
    localStorage.removeItem('taskly-user');
    navigate('/');
  };

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <>
      <TopBar title="My Profile" subtitle="Manage your account details" />

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '24px 16px' : '24px 48px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '40px',
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            width: isMobile ? '100%' : 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: '24px',
          }}
        >
          <UserAvatar name={profile?.name || 'User'} size={120} />

          <ButtonBase
            sx={{
              height: 36,
              borderRadius: 999,
              border: `1px solid ${tokens.border}`,
              padding: '0 16px',
              gap: '8px',
              display: 'flex',
              alignItems: 'center',
              color: tokens.foreground,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <CameraAltOutlined sx={{ fontSize: 16 }} />
            Change photo
          </ButtonBase>

          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: tokens.foreground }}>
              {profile?.name || 'User'}
            </Typography>
            <Typography sx={{ fontSize: 14, color: tokens.mutedForeground }}>
              {profile?.email || ''}
            </Typography>
            <Typography sx={{ fontSize: 12, color: tokens.mutedForeground, mt: 0.5 }}>
              Member since {memberSince}
            </Typography>
          </Box>

          {/* Stats card */}
          <Card>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: tokens.foreground }}>
              Your Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Completed tasks', value: profile?.stats.completed ?? 0 },
                { label: 'Active tasks', value: profile?.stats.active ?? 0 },
                { label: 'Categories', value: profile?.stats.categories ?? 0 },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: tokens.mutedForeground }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: tokens.foreground }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Sign out */}
          <ButtonBase
            onClick={handleLogout}
            sx={{
              width: '100%',
              height: 40,
              borderRadius: 999,
              border: `1px solid ${tokens.destructive}`,
              color: tokens.destructive,
              fontSize: 14,
              fontWeight: 500,
              gap: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoutOutlined sx={{ fontSize: 18 }} />
            Sign out
          </ButtonBase>
        </Box>

        {/* Right column */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: 600,
          }}
        >
          {/* Account Information */}
          <Card>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: tokens.foreground }}>
              Account Information
            </Typography>
            <ProfileInput
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
            <ProfileInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', mt: 1 }}>
              <ButtonBase
                onClick={() => {
                  setName(profile?.name || '');
                  setEmail(profile?.email || '');
                }}
                sx={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: '8px',
                  border: `1px solid ${tokens.border}`,
                  color: tokens.foreground,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Cancel
              </ButtonBase>
              <ButtonBase
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                sx={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: '8px',
                  backgroundColor: '#FF8400',
                  color: '#111111',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:disabled': { opacity: 0.7 },
                }}
              >
                {isUpdatingProfile ? 'Saving...' : 'Save'}
              </ButtonBase>
            </Box>
          </Card>

          {/* Change Password */}
          <Card>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: tokens.foreground }}>
              Change Password
            </Typography>
            <ProfileInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
            />
            <ProfileInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Enter new password"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <ButtonBase
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                sx={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: '8px',
                  backgroundColor: '#FF8400',
                  color: '#111111',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:disabled': { opacity: 0.7 },
                }}
              >
                {isChangingPassword ? 'Updating...' : 'Update'}
              </ButtonBase>
            </Box>
          </Card>

          {/* Appearance */}
          <Card>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: tokens.mutedForeground,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Appearance
            </Typography>
            <ThemeToggle />
          </Card>

          {/* Danger Zone */}
          <Card destructive>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: tokens.destructive }}>
              Danger Zone
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.mutedForeground, lineHeight: 1.5 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
              <ButtonBase
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: '8px',
                  backgroundColor: tokens.destructive,
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Delete Account
              </ButtonBase>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletePassword('');
        }}
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

        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: tokens.foreground,
            textAlign: 'center',
            mb: 1,
          }}
        >
          Delete Account?
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: tokens.mutedForeground,
            textAlign: 'center',
            lineHeight: 1.5,
            mb: 3,
          }}
        >
          Enter your password to confirm account deletion. All your data will be permanently removed.
        </Typography>

        <InputBase
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          placeholder="Enter your password"
          sx={{
            width: '100%',
            height: 40,
            borderRadius: '8px',
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.input}`,
            padding: '0 14px',
            fontSize: 14,
            color: tokens.foreground,
            mb: 3,
            '& input::placeholder': { color: tokens.mutedForeground, opacity: 1 },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <ButtonBase
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeletePassword('');
            }}
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
            onClick={handleDeleteAccount}
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
            Delete Account
          </ButtonBase>
        </Box>
      </Dialog>
    </>
  );
}
