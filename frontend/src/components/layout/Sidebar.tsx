import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase, useTheme } from '@mui/material';
import {
  FormatListBulletedSharp,
  TodaySharp,
  SettingsOutlined,
  WorkSharp,
  PersonSharp,
  ShoppingCartSharp,
  FavoriteSharp,
  TagSharp,
} from '@mui/icons-material';
import { Check, Plus, Moon, Sun } from 'lucide-react';
import { useGetCategoriesQuery } from '../../api/categoryApi';
import { useGetMeQuery } from '../../api/authApi';
import { useThemeMode } from '../../context/ThemeContext';
import UserAvatar from '../shared/UserAvatar';
import {
  lightTokens,
  darkTokens,
  fontPrimary,
} from '../../theme/tokens';

interface SidebarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  muted?: boolean;
}

function NavItem({ icon, label, count, isActive, onClick, muted }: NavItemProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        height: 44,
        borderRadius: 999,
        padding: '0 12px',
        gap: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: isActive ? tokens.sidebarAccent : 'transparent',
        color: muted
          ? tokens.mutedForeground
          : isActive
          ? tokens.sidebarAccentForeground
          : tokens.sidebarForeground,
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: isActive
            ? tokens.sidebarAccent
            : theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.04)',
        },
      }}
    >
      {icon}
      <Typography
        sx={{
          flex: 1,
          fontSize: 14,
          fontWeight: isActive ? 600 : 400,
          textAlign: 'left',
        }}
      >
        {label}
      </Typography>
      {count !== undefined && count > 0 && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: tokens.mutedForeground,
            minWidth: 20,
            textAlign: 'right',
          }}
        >
          {count}
        </Typography>
      )}
    </ButtonBase>
  );
}

function getCategoryIcon(iconName: string) {
  const iconProps = { sx: { fontSize: 20 } };
  const iconMap: Record<string, React.ReactNode> = {
    work: <WorkSharp {...iconProps} />,
    person: <PersonSharp {...iconProps} />,
    shopping_cart: <ShoppingCartSharp {...iconProps} />,
    favorite: <FavoriteSharp {...iconProps} />,
  };

  return iconMap[iconName] || <TagSharp {...iconProps} />;
}

export default function Sidebar({ selectedFilter, onFilterChange }: SidebarProps) {
  const theme = useTheme();
  const tokens = theme.palette.mode === 'dark' ? darkTokens : lightTokens;
  const navigate = useNavigate();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: user } = useGetMeQuery();
  const { resolvedMode, setMode, mode } = useThemeMode();

  const handleToggleTheme = () => {
    if (mode === 'system') {
      setMode(resolvedMode === 'light' ? 'dark' : 'light');
    } else {
      setMode(mode === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.sidebar,
        borderRight: `1px solid ${tokens.sidebarBorder}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 20px',
          borderBottom: `1px solid ${tokens.sidebarBorder}`,
        }}
      >
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
        <Typography
          sx={{
            fontFamily: fontPrimary,
            fontSize: 22,
            fontWeight: 700,
            color: tokens.sidebarAccentForeground,
          }}
        >
          Taskly
        </Typography>
      </Box>

      {/* Nav section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: tokens.mutedForeground,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '8px 12px 8px',
          }}
        >
          Categories
        </Typography>

        <NavItem
          icon={<FormatListBulletedSharp sx={{ fontSize: 20 }} />}
          label="All Tasks"
          isActive={selectedFilter === 'all'}
          onClick={() => {
            onFilterChange('all');
            navigate('/app/tasks');
          }}
        />

        <NavItem
          icon={<TodaySharp sx={{ fontSize: 20 }} />}
          label="Today"
          isActive={selectedFilter === 'today'}
          onClick={() => {
            onFilterChange('today');
            navigate('/app/tasks');
          }}
        />

        {categories.map((cat) => (
          <NavItem
            key={cat.id}
            icon={getCategoryIcon(cat.icon)}
            label={cat.name}
            count={cat.taskCount}
            isActive={selectedFilter === String(cat.id)}
            onClick={() => {
              onFilterChange(String(cat.id));
              navigate('/app/tasks');
            }}
          />
        ))}

        <NavItem
          icon={<Plus size={20} />}
          label="Add Category"
          isActive={false}
          onClick={() => {
            // Could open a dialog to add categories
          }}
          muted
        />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
          borderTop: `1px solid ${tokens.sidebarBorder}`,
        }}
      >
        <UserAvatar name={user?.name || 'User'} size={36} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: tokens.sidebarAccentForeground,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name || 'User'}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: tokens.mutedForeground,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email || ''}
          </Typography>
        </Box>
        <ButtonBase
          onClick={handleToggleTheme}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.mutedForeground,
            '&:hover': { backgroundColor: tokens.sidebarAccent },
          }}
        >
          {resolvedMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </ButtonBase>
        <ButtonBase
          onClick={() => navigate('/app/profile')}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.mutedForeground,
            '&:hover': { backgroundColor: tokens.sidebarAccent },
          }}
        >
          <SettingsOutlined sx={{ fontSize: 18 }} />
        </ButtonBase>
      </Box>
    </Box>
  );
}
