import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useUser } from '../hooks/useUser';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserAvatar } from '../components/UserAvatar';
import { LoadingSpinner } from '@/shared/components';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading, error } = useUser();

  const {
    formData,
    errors,
    isDirty,
    isUpdating,
    isUploading,
    handleSubmit,
    getFieldProps,
    handleAvatarUpload,
    resetForm,
  } = useUserProfile({
    initialData: currentUser ? {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      website: currentUser.website || '',
      dateOfBirth: currentUser.dateOfBirth || '',
      phoneNumber: currentUser.phoneNumber || '',
      isPrivate: currentUser.isPrivate,
    } : undefined,
    onSuccess: () => {
      navigate('/profile');
    },
  });

  useEffect(() => {
    if (currentUser && !formData.firstName) {
      resetForm();
    }
  }, [currentUser, formData.firstName, resetForm]);

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/profile');
  };

  const handleAvatarChange = async (file: File) => {
    try {
      await handleAvatarUpload(file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  if (isLoading && !currentUser) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Unable to load profile data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <UserAvatar
              src={currentUser.profilePictureUrl}
              firstName={currentUser.firstName}
              lastName={currentUser.lastName}
              size="large"
              editable
              onUpload={handleAvatarChange}
            />
            
            <Box>
              <Typography variant="h6">
                {currentUser.firstName} {currentUser.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                @{currentUser.username}
              </Typography>
              {isUploading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">
                    Uploading avatar...
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                {...getFieldProps('firstName')}
                disabled={isUpdating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                required
                {...getFieldProps('lastName')}
                disabled={isUpdating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Username"
                fullWidth
                required
                {...getFieldProps('username')}
                disabled={true}
                helperText="Username cannot be changed"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                {...getFieldProps('email')}
                disabled={true}
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={3}
                {...getFieldProps('bio')}
                disabled={isUpdating}
                helperText="Tell people about yourself"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Location"
                fullWidth
                {...getFieldProps('location')}
                disabled={isUpdating}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Website"
                fullWidth
                {...getFieldProps('website')}
                disabled={isUpdating}
                helperText="Include http:// or https://"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                fullWidth
                type="date"
                {...getFieldProps('dateOfBirth')}
                disabled={isUpdating}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                {...getFieldProps('phoneNumber')}
                disabled={isUpdating}
              />
            </Grid>

            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrivate}
                    onChange={(e) => getFieldProps('isPrivate').onChange(e)}
                    disabled={isUpdating}
                  />
                }
                label="Private Account"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                When your account is private, only people you approve can see your posts
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={isUpdating ? <CircularProgress size={20} /> : <Save />}
              disabled={isUpdating || !isDirty}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}; 