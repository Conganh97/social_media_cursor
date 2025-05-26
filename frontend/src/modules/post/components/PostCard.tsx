import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  MoreVert,
  LocationOn,
  Public,
  People,
  Lock,
  Edit,
  Delete,
  Report,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../types/post.types';
import { usePost } from '../hooks/usePost';
import { useAuth } from '@/modules/auth';

interface PostCardProps {
  post: Post;
  onCommentClick?: (postId: number) => void;
  onUserClick?: (userId: number) => void;
  onEditClick?: (post: Post) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onCommentClick,
  onUserClick,
  onEditClick,
  showActions = true,
  compact = false,
}) => {
  const { likePost, unlikePost, deletePost } = usePost();
  const { user: currentUser } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!post) {
    console.warn('PostCard: Post is null or undefined');
    return null;
  }

  if (!post.user) {
    console.error('PostCard: Post user is missing', { postId: post.id, post });
    return (
      <Card sx={{ mb: 2, maxWidth: compact ? 400 : '100%' }}>
        <CardContent>
          <Typography color="error">
            Error: Post data is incomplete (missing user information)
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const safePost = {
    ...post,
    imageUrl: post.imageUrl || '',
    tags: post.tags || [],
    mentions: post.mentions || [],
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    isLikedByCurrentUser: post.isLikedByCurrentUser || false,
    location: post.location || '',
    user: {
      id: post.user.id || 0,
      username: post.user.username || 'unknown',
      firstName: post.user.firstName || 'Unknown',
      lastName: post.user.lastName || 'User',
      profilePictureUrl: post.user.profilePictureUrl || ''
    }
  };

  const isOwner = currentUser?.id === safePost.user.id;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeToggle = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (safePost.isLikedByCurrentUser) {
        await unlikePost(safePost.id);
      } else {
        await likePost(safePost.id);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleUserClick = () => {
    if (onUserClick && safePost.user.id) {
      onUserClick(safePost.user.id);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(safePost.id);
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(safePost);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(safePost.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${safePost.user.firstName} ${safePost.user.lastName}`,
        text: safePost.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getVisibilityIcon = () => {
    switch (safePost.visibility) {
      case 'PUBLIC':
        return <Public fontSize="small" color="action" />;
      case 'FRIENDS':
        return <People fontSize="small" color="action" />;
      case 'PRIVATE':
        return <Lock fontSize="small" color="action" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, maxWidth: compact ? 400 : '100%' }}>
        <CardHeader
          avatar={
            <Avatar
              src={safePost.user.profilePictureUrl}
              onClick={handleUserClick}
              sx={{ cursor: 'pointer' }}
            >
              {safePost.user.firstName[0]}
            </Avatar>
          }
          action={
            showActions && (
              <IconButton onClick={handleMenuClick}>
                <MoreVert />
              </IconButton>
            )
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ cursor: 'pointer', fontWeight: 600 }}
                onClick={handleUserClick}
              >
                {safePost.user.firstName} {safePost.user.lastName}
              </Typography>
              {getVisibilityIcon()}
            </Box>
          }
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                @{safePost.user.username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                •
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatTimeAgo(safePost.createdAt)}
              </Typography>
              {safePost.location && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    •
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {safePost.location}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          }
        />

        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" paragraph>
            {safePost.content}
          </Typography>

          {safePost.tags && safePost.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {safePost.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  clickable
                />
              ))}
            </Box>
          )}

          {safePost.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <img
                src={safePost.imageUrl}
                alt="Post image"
                loading="lazy"
                style={{
                  borderRadius: 8,
                  objectFit: 'cover',
                  width: '100%',
                  maxHeight: 400,
                }}
              />
            </Box>
          )}
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleLikeToggle}
              disabled={isLiking}
              color={safePost.isLikedByCurrentUser ? 'error' : 'default'}
            >
              {safePost.isLikedByCurrentUser ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {safePost.likeCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleCommentClick}>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {safePost.commentCount}
            </Typography>
          </Box>

          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isOwner && [
          <MenuItem key="edit" onClick={handleEditClick}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit Post
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDeleteClick}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete Post
          </MenuItem>,
        ]}
        {!isOwner && (
          <MenuItem onClick={handleMenuClose}>
            <Report sx={{ mr: 1 }} fontSize="small" />
            Report Post
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 