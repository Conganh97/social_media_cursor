import React from 'react';
import { Box, CircularProgress, Typography, Divider } from '@mui/material';
import { PostCard } from './PostCard';
import { Post } from '../types/post.types';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  hasMore?: boolean;
  onCommentClick?: (postId: number) => void;
  onUserClick?: (userId: number) => void;
  onEditClick?: (post: Post) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  compact?: boolean;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading = false,
  hasMore = true,
  onCommentClick,
  onUserClick,
  onEditClick,
  emptyMessage = 'No posts found',
  emptyDescription = 'Be the first to share something!',
  compact = false,
}) => {
  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];

  if (safePosts.length === 0 && !isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {emptyDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {safePosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onCommentClick={onCommentClick}
          onUserClick={onUserClick}
          onEditClick={onEditClick}
          compact={compact}
        />
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* End of List Message */}
      {!hasMore && safePosts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Divider />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            You've reached the end
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 