import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  Person,
} from '@mui/icons-material';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: 'small' | 'medium' | 'large' | number;
  editable?: boolean;
  online?: boolean;
  onClick?: () => void;
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  className?: string;
}

const sizeMap = {
  small: 32,
  medium: 56,
  large: 120,
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  firstName = '',
  lastName = '',
  size = 'medium',
  editable = false,
  online = false,
  onClick,
  onUpload,
  onDelete,
  className,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageError, setImageError] = useState(false);

  const avatarSize = typeof size === 'number' ? size : sizeMap[size];
  
  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (editable) {
      setAnchorEl(event.currentTarget);
    } else if (onClick) {
      onClick();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    handleMenuClose();
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    handleMenuClose();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const avatar = (
    <Avatar
      src={!imageError && src ? src : undefined}
      alt={alt || `${firstName} ${lastName}`}
      sx={{
        width: avatarSize,
        height: avatarSize,
        cursor: editable || onClick ? 'pointer' : 'default',
        bgcolor: 'primary.main',
        fontSize: avatarSize * 0.4,
      }}
      onClick={handleMenuOpen}
      className={className}
      onError={handleImageError}
    >
      {!src || imageError ? getInitials() || <Person /> : null}
    </Avatar>
  );

  const badgedAvatar = online ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: '#44b700',
          color: '#44b700',
          '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
          },
        },
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(.8)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
          },
        },
      }}
    >
      {avatar}
    </Badge>
  ) : (
    avatar
  );

  return (
    <>
      {editable ? (
        <Tooltip title="Click to change avatar">
          {badgedAvatar}
        </Tooltip>
      ) : (
        badgedAvatar
      )}

      {editable && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem component="label">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileUpload}
            />
            <ListItemIcon>
              <PhotoCamera fontSize="small" />
            </ListItemIcon>
            <ListItemText>Upload Photo</ListItemText>
          </MenuItem>
          
          {src && !imageError && (
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove Photo</ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}
    </>
  );
}; 