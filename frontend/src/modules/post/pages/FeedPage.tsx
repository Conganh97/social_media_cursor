import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import {
  Add,
  Refresh,
  FilterList,
  TrendingUp,
  Schedule,
  Close,
} from '@mui/icons-material';
import { PostCard } from '../components/PostCard';
import { CreatePost } from '../components/CreatePost';
import { usePost } from '../hooks/usePost';
import { LoadingSpinner } from '@/shared/components';
import { Post } from '../types/post.types';

interface FeedPageProps {
  userId?: number;
  showCreatePost?: boolean;
  title?: string;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  userId,
  showCreatePost = true,
  title = 'Feed',
}) => {
  const {
    feedPosts,
    isLoading,
    error,
    hasMoreFeed,
    feedPage,
    getFeed,
    getUserPosts,
    clearError,
    resetFeed,
  } = usePost();

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'recent' | 'trending'>('recent');

  // Load initial feed
  useEffect(() => {
    const loadInitialFeed = async () => {
      try {
        if (userId) {
          await getUserPosts(userId, 0, 10);
        } else {
          await getFeed({ page: 0, size: 10, refresh: true });
        }
      } catch (error) {
        console.error('Failed to load initial feed:', error);
      }
    };

    loadInitialFeed();
  }, [userId, getFeed, getUserPosts]);

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      resetFeed();
      if (userId) {
        await getUserPosts(userId, 0, 10);
      } else {
        await getFeed({ page: 0, size: 10, refresh: true });
      }
    } catch (error) {
      console.error('Failed to refresh feed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreatePostSuccess = () => {
    setCreatePostOpen(false);
    handleRefresh();
  };

  const handlePostComment = (postId: number) => {
    // TODO: Navigate to post detail page or open comment modal
    console.log('Comment on post:', postId);
  };

  const handleUserClick = (userId: number) => {
    // TODO: Navigate to user profile
    console.log('Navigate to user:', userId);
  };

  const handlePostEdit = (post: any) => {
    // TODO: Open edit post modal
    console.log('Edit post:', post);
  };

  const handleFilterChange = (type: 'recent' | 'trending') => {
    setFilterType(type);
    // TODO: Implement filter logic
    handleRefresh();
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh />
          </IconButton>
          
          <IconButton>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Button
          variant={filterType === 'recent' ? 'contained' : 'outlined'}
          startIcon={<Schedule />}
          onClick={() => handleFilterChange('recent')}
          size="small"
        >
          Recent
        </Button>
        <Button
          variant={filterType === 'trending' ? 'contained' : 'outlined'}
          startIcon={<TrendingUp />}
          onClick={() => handleFilterChange('trending')}
          size="small"
        >
          Trending
        </Button>
      </Box>

      {/* Create Post Button for Mobile */}
      {showCreatePost && (
        <Box sx={{ mb: 3, display: { xs: 'block', sm: 'none' } }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreatePostOpen(true)}
            sx={{ py: 1.5 }}
          >
            Create Post
          </Button>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={clearError}>
              <Close />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Refreshing Indicator */}
      {refreshing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Create Post Component for Desktop */}
      {showCreatePost && (
        <Box sx={{ mb: 3, display: { xs: 'none', sm: 'block' } }}>
          <CreatePost onSuccess={handleCreatePostSuccess} />
        </Box>
      )}

      {/* Posts List */}
      <Box>
        {feedPosts.length === 0 && !isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No posts found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userId ? 'This user hasn\'t posted anything yet.' : 'Be the first to share something!'}
            </Typography>
            {showCreatePost && !userId && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreatePostOpen(true)}
                sx={{ mt: 2 }}
              >
                Create Post
              </Button>
            )}
          </Box>
        ) : (
          <>
            {feedPosts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={post}
                onCommentClick={handlePostComment}
                onUserClick={handleUserClick}
                onEditClick={handlePostEdit}
              />
            ))}

            {/* End of Feed Message */}
            {!hasMoreFeed && feedPosts.length > 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Divider />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  You've reached the end of the feed
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Floating Action Button for Create Post */}
      {showCreatePost && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
          onClick={() => setCreatePostOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Mobile Create Post Drawer */}
      <Drawer
        anchor="bottom"
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '90vh',
          },
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Create Post
            </Typography>
            <IconButton onClick={() => setCreatePostOpen(false)}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 2 }}>
          <CreatePost
            onSuccess={handleCreatePostSuccess}
            onCancel={() => setCreatePostOpen(false)}
            compact
            autoFocus
          />
        </Box>
      </Drawer>

      {/* Initial Loading */}
      {isLoading && feedPosts.length === 0 && (
        <LoadingSpinner fullScreen message="Loading feed..." />
      )}
    </Container>
  );
}; 