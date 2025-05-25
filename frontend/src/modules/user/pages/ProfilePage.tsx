import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert } from '@mui/material';
import { LoadingSpinner } from '@/shared/components';
import { UserProfile } from '../components/UserProfile';
import { useUser } from '../hooks/useUser';
import { useAuth } from '@/modules/auth';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const userId = id ? parseInt(id, 10) : authUser?.id;
  const isCurrentUser = !id || userId === authUser?.id;
  
  const {
    currentUser,
    userProfile,
    isLoading,
    error,
    getUserProfile,
    followUser,
    unfollowUser,
    uploadAvatar,
  } = useUser(userId);

  const displayUser = isCurrentUser ? currentUser : userProfile;

  useEffect(() => {
    if (userId && !isCurrentUser && !userProfile) {
      getUserProfile(userId);
    }
  }, [userId, isCurrentUser, userProfile, getUserProfile]);

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  const handleFollow = (targetUserId: number) => {
    followUser(targetUserId);
  };

  const handleUnfollow = (targetUserId: number) => {
    unfollowUser(targetUserId);
  };

  const handleMessage = (targetUserId: number) => {
    navigate(`/messages?user=${targetUserId}`);
  };

  const handleBlock = (targetUserId: number) => {
    console.log('Block user:', targetUserId);
  };

  const handleReport = (targetUserId: number) => {
    console.log('Report user:', targetUserId);
  };

  const handleAvatarUpload = (file: File) => {
    if (isCurrentUser) {
      uploadAvatar(file);
    }
  };

  if (isLoading && !displayUser) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (error && !displayUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!displayUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <UserProfile
        user={displayUser}
        isCurrentUser={isCurrentUser}
        onEdit={handleEdit}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onMessage={handleMessage}
        onBlock={handleBlock}
        onReport={handleReport}
        onAvatarUpload={handleAvatarUpload}
        isLoading={isLoading}
      />
    </Container>
  );
}; 