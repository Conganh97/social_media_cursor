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
  ImageList,
  ImageListItem,
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
  BookmarkBorder,
  Bookmark,
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

  const isOwner = currentUser?.id === post.author.id;

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
      if (post.isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick(post.author.id);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(post.id);
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(post);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(post.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.firstName} ${post.author.lastName}`,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getVisibilityIcon = () => {
    switch (post.visibility) {
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
              src={post.author.avatarUrl}
              onClick={handleUserClick}
              sx={{ cursor: 'pointer' }}
            >
              {post.author.firstName[0]}
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
                {post.author.firstName} {post.author.lastName}
              </Typography>
              {getVisibilityIcon()}
            </Box>
          }
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                @{post.author.username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                •
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatTimeAgo(post.createdAt)}
              </Typography>
              {post.location && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    •
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {post.location}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          }
        />

        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>

          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {post.tags.map((tag, index) => (
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

          {post.images && post.images.length > 0 && (
            <ImageList
              cols={post.images.length === 1 ? 1 : 2}
              gap={8}
              sx={{ mb: 2 }}
            >
              {post.images.map((image) => (
                <ImageListItem key={image.id}>
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.description || 'Post image'}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      objectFit: 'cover',
                      width: '100%',
                      height: post.images.length === 1 ? 'auto' : 200,
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleLikeToggle}
              disabled={isLiking}
              color={post.isLiked ? 'error' : 'default'}
            >
              {post.isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {post.likesCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleCommentClick}>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {post.commentsCount}
            </Typography>
          </Box>

          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>

          <IconButton>
            {post.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
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