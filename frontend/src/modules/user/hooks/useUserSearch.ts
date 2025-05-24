import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useDebounce } from '@/shared/hooks';
import {
  searchUsersAsync,
  clearSearchResults,
  selectUserSearchResults,
} from '../store/userSlice';
import { UserSearchFilters } from '../types/user.types';

interface UseUserSearchOptions {
  debounceMs?: number;
  pageSize?: number;
  autoSearch?: boolean;
}

export const useUserSearch = (options: UseUserSearchOptions = {}) => {
  const { debounceMs = 300, pageSize = 20, autoSearch = true } = options;
  
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(selectUserSearchResults);
  
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  const searchUsers = useCallback(async (
    searchQuery: string = debouncedQuery,
    page: number = 1,
    searchFilters: UserSearchFilters = filters
  ) => {
    if (!searchQuery.trim()) {
      dispatch(clearSearchResults());
      return;
    }

    const searchParams = {
      query: searchQuery,
      page,
      limit: pageSize,
      filters: searchFilters,
    };

    return dispatch(searchUsersAsync(searchParams));
  }, [dispatch, debouncedQuery, filters, pageSize]);

  const loadMoreUsers = useCallback(() => {
    if (searchResults.hasMore && !searchResults.isLoading && debouncedQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchUsers(debouncedQuery, nextPage, filters);
    }
  }, [searchResults.hasMore, searchResults.isLoading, debouncedQuery, currentPage, filters, searchUsers]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setCurrentPage(1);
    dispatch(clearSearchResults());
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<UserSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
    
    if (debouncedQuery && autoSearch) {
      searchUsers(debouncedQuery, 1, { ...filters, ...newFilters });
    }
  }, [filters, debouncedQuery, autoSearch, searchUsers]);

  const resetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
    
    if (debouncedQuery && autoSearch) {
      searchUsers(debouncedQuery, 1, {});
    }
  }, [debouncedQuery, autoSearch, searchUsers]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (autoSearch && debouncedQuery !== query) {
      setCurrentPage(1);
      searchUsers(debouncedQuery, 1, filters);
    }
  }, [debouncedQuery, query, filters, autoSearch, searchUsers]);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  return {
    query,
    filters,
    searchResults: searchResults.users,
    totalCount: searchResults.totalCount,
    hasMore: searchResults.hasMore,
    isLoading: searchResults.isLoading,
    currentPage,
    handleQueryChange,
    searchUsers: (searchQuery?: string) => searchUsers(searchQuery || debouncedQuery),
    loadMoreUsers,
    clearSearch,
    updateFilters,
    resetFilters,
  };
}; 