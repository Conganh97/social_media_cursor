import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  List,
  ListItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Person,
} from '@mui/icons-material';
import { UserCard } from './UserCard';
import { useUserSearch } from '../hooks/useUserSearch';
import { UserSearchFilters } from '../types/user.types';

interface UserSearchProps {
  onUserSelect?: (userId: number) => void;
  onUserMessage?: (userId: number) => void;
  onUserFollow?: (userId: number) => void;
  onUserUnfollow?: (userId: number) => void;
  compact?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  onUserSelect,
  onUserMessage,
  onUserFollow,
  onUserUnfollow,
  compact = false,
  placeholder = "Search users...",
  autoFocus = false,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  
  const {
    query,
    filters,
    searchResults,
    totalCount,
    hasMore,
    isLoading,
    handleQueryChange,
    loadMoreUsers,
    clearSearch,
    updateFilters,
    resetFilters,
  } = useUserSearch();

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filterKey: keyof UserSearchFilters, value: any) => {
    updateFilters({ [filterKey]: value });
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleUserCardAction = (action: string, userId: number) => {
    switch (action) {
      case 'select':
        onUserSelect?.(userId);
        break;
      case 'message':
        onUserMessage?.(userId);
        break;
      case 'follow':
        onUserFollow?.(userId);
        break;
      case 'unfollow':
        onUserUnfollow?.(userId);
        break;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          autoFocus={autoFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} size="small">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <IconButton
          onClick={handleFilterMenuOpen}
          color={activeFiltersCount > 0 ? 'primary' : 'default'}
        >
          <FilterList />
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                minWidth: 16,
                height: 16,
                fontSize: '0.75rem',
              }}
            />
          )}
        </IconButton>
      </Box>

      {query && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {isLoading ? 'Searching...' : `${totalCount} results for "${query}"`}
          </Typography>
          
          {activeFiltersCount > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {filters.location && (
                <Chip
                  label={`Location: ${filters.location}`}
                  size="small"
                  onDelete={() => handleFilterChange('location', undefined)}
                />
              )}
              {filters.verified !== undefined && (
                <Chip
                  label={`Verified: ${filters.verified ? 'Yes' : 'No'}`}
                  size="small"
                  onDelete={() => handleFilterChange('verified', undefined)}
                />
              )}
              {filters.hasAvatar !== undefined && (
                <Chip
                  label={`Has Avatar: ${filters.hasAvatar ? 'Yes' : 'No'}`}
                  size="small"
                  onDelete={() => handleFilterChange('hasAvatar', undefined)}
                />
              )}
              <Button
                size="small"
                onClick={resetFilters}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>
      )}

      <List sx={{ p: 0 }}>
        {searchResults.map((user) => (
          <ListItem key={user.id} sx={{ p: 0 }}>
            <UserCard
              user={user}
              compact={compact}
              onViewProfile={(userId) => handleUserCardAction('select', userId)}
              onMessage={(userId) => handleUserCardAction('message', userId)}
              onFollow={(userId) => handleUserCardAction('follow', userId)}
              onUnfollow={(userId) => handleUserCardAction('unfollow', userId)}
            />
          </ListItem>
        ))}
      </List>

      {isLoading && searchResults.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && query && searchResults.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="textSecondary">
            No users found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {hasMore && searchResults.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            onClick={loadMoreUsers}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterMenuClose}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Filters
          </Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <TextField
            label="Location"
            size="small"
            fullWidth
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
          />
        </MenuItem>
        
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.verified === true}
                onChange={(e) => handleFilterChange('verified', e.target.checked || undefined)}
              />
            }
            label="Verified users only"
          />
        </MenuItem>
        
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.hasAvatar === true}
                onChange={(e) => handleFilterChange('hasAvatar', e.target.checked || undefined)}
              />
            }
            label="Has profile picture"
          />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={resetFilters}>
          <Typography variant="body2" color="primary">
            Clear all filters
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}; 