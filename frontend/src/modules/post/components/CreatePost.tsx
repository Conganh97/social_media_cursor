import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  ImageList,
  ImageListItem,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  PhotoCamera,
  LocationOn,
  Public,
  People,
  Lock,
  Close,
  EmojiEmotions,
  Tag,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreatePostData, PostUpload } from '../types/post.types';
import { usePost } from '../hooks/usePost';
import { useAuth } from '@/modules/auth';

interface CreatePostProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
  autoFocus?: boolean;
}

const validationSchema = Yup.object({
  content: Yup.string()
    .required('Post content is required')
    .max(2000, 'Post content must be less than 2000 characters'),
  visibility: Yup.string()
    .oneOf(['PUBLIC', 'FRIENDS', 'PRIVATE'])
    .required('Visibility setting is required'),
  location: Yup.string().max(100, 'Location must be less than 100 characters'),
  tags: Yup.array().of(Yup.string()).max(10, 'Maximum 10 tags allowed'),
});

export const CreatePost: React.FC<CreatePostProps> = ({
  onSuccess,
  onCancel,
  placeholder = "What's on your mind?",
  compact = false,
  autoFocus = false,
}) => {
  const { createPost, isCreating, error } = usePost();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploads, setUploads] = useState<PostUpload[]>([]);
  const [tagInput, setTagInput] = useState('');

  const formik = useFormik<CreatePostData>({
    initialValues: {
      content: '',
      visibility: 'PUBLIC',
      location: '',
      tags: [],
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const postData: CreatePostData = {
          ...values,
          images: uploads.map(upload => upload.file),
        };
        
        await createPost(postData);
        
        // Reset form
        formik.resetForm();
        setUploads([]);
        setTagInput('');
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newUpload: PostUpload = {
            file,
            preview: e.target?.result as string,
            progress: 100,
            isUploading: false,
          };
          setUploads(prev => [...prev, newUpload]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      
      if (tag && !formik.values.tags?.includes(tag) && formik.values.tags!.length < 10) {
        formik.setFieldValue('tags', [...(formik.values.tags || []), tag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags?.filter(tag => tag !== tagToRemove) || []
    );
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Public fontSize="small" />;
      case 'FRIENDS':
        return <People fontSize="small" />;
      case 'PRIVATE':
        return <Lock fontSize="small" />;
      default:
        return <Public fontSize="small" />;
    }
  };

  const isSubmitDisabled = !formik.values.content.trim() || isCreating || formik.isSubmitting;

  return (
    <Card sx={{ mb: 2, maxWidth: compact ? 400 : '100%' }}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar src={user?.profilePictureUrl}>
              {user?.firstName?.[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={compact ? 2 : 3}
                placeholder={placeholder}
                variant="outlined"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={
                  formik.touched.content && formik.errors.content ? 
                  formik.errors.content : 
                  `${formik.values.content.length}/2000`
                }
                autoFocus={autoFocus}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Image Previews */}
          {uploads.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <ImageList cols={uploads.length === 1 ? 1 : 2} gap={8}>
                {uploads.map((upload, index) => (
                  <ImageListItem key={index} sx={{ position: 'relative' }}>
                    <img
                      src={upload.preview}
                      alt={`Upload ${index + 1}`}
                      style={{
                        borderRadius: 8,
                        objectFit: 'cover',
                        width: '100%',
                        height: uploads.length === 1 ? 'auto' : 200,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.8)',
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                    {upload.isUploading && (
                      <LinearProgress
                        variant="determinate"
                        value={upload.progress}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                        }}
                      />
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          {/* Location */}
          {formik.values.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="action" fontSize="small" />
              <Typography variant="body2" color="textSecondary">
                {formik.values.location}
              </Typography>
              <IconButton
                size="small"
                onClick={() => formik.setFieldValue('location', '')}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Tags */}
          {formik.values.tags && formik.values.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formik.values.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {/* Tag Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Add tags (press Enter or comma)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            InputProps={{
              startAdornment: <Tag sx={{ mr: 1, color: 'action.main' }} />,
            }}
            sx={{ mb: 2 }}
          />

          {/* Location Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Add location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            InputProps={{
              startAdornment: <LocationOn sx={{ mr: 1, color: 'action.main' }} />,
            }}
            sx={{ mb: 2 }}
          />
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploads.length >= 4}
            >
              <PhotoCamera />
            </IconButton>
            
            <IconButton color="primary" disabled>
              <EmojiEmotions />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Visibility</InputLabel>
              <Select
                name="visibility"
                value={formik.values.visibility}
                onChange={formik.handleChange}
                label="Visibility"
                startAdornment={getVisibilityIcon(formik.values.visibility!)}
              >
                <MenuItem value="PUBLIC">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public fontSize="small" />
                    Public
                  </Box>
                </MenuItem>
                <MenuItem value="FRIENDS">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People fontSize="small" />
                    Friends
                  </Box>
                </MenuItem>
                <MenuItem value="PRIVATE">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock fontSize="small" />
                    Private
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {onCancel && (
              <Button onClick={onCancel} disabled={isCreating}>
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitDisabled}
              sx={{ minWidth: 80 }}
            >
              {isCreating ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </CardActions>
      </form>
    </Card>
  );
}; 