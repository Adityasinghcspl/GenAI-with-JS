import { useState, useEffect, useCallback } from 'react';
import { APIError, NetworkError, ValidationError } from '../api';

// Custom hook for API calls with loading states and error handling
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    }
  };
};

// Hook for handling form submissions with API calls
export const useApiForm = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await apiFunction(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    submit,
    reset
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiFunction, initialPage = 1, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(async (pageNumber = page, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction({
        page: pageNumber,
        limit: pageSize
      });
      
      const newData = result.data || [];
      setData(prevData => reset ? newData : [...prevData, ...newData]);
      setHasMore(result.hasMore || false);
      setTotal(result.total || 0);
      setPage(pageNumber);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      return loadPage(page + 1);
    }
  }, [loadPage, loading, hasMore, page]);

  const refresh = useCallback(() => {
    return loadPage(1, true);
  }, [loadPage]);

  useEffect(() => {
    loadPage(1, true);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    total,
    loadMore,
    refresh,
    reset: () => {
      setData([]);
      setError(null);
      setPage(initialPage);
      setHasMore(true);
      setTotal(0);
    }
  };
};

// Error message formatter
export const formatApiError = (error) => {
  if (error instanceof ValidationError) {
    return {
      type: 'validation',
      message: error.message,
      errors: error.errors
    };
  } else if (error instanceof APIError) {
    return {
      type: 'api',
      message: error.message,
      status: error.status
    };
  } else if (error instanceof NetworkError) {
    return {
      type: 'network',
      message: 'Please check your internet connection and try again.'
    };
  } else {
    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred.'
    };
  }
};