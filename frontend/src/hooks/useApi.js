import { useState, useCallback } from 'react';

/**
 * Reusable React Custom Hook for API calls with built-in state management
 * Supporting GET, POST, PUT, DELETE requests, loading state, and error handling.
 */
export const useApi = (baseUrl = '/api') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        ...options,
        headers,
      };

      const response = await fetch(`${baseUrl}${endpoint}`, config);
      
      let responseData = {};
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const textData = await response.text();
          responseData = { message: textData ? textData.slice(0, 150) : `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (parseError) {
        responseData = { message: `Failed to parse response: ${parseError.message}` };
      }

      if (!response.ok) {
        const requestError = new Error(responseData.message || 'An error occurred during the request');
        requestError.status = response.status;
        throw requestError;
      }

      setData(responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      throw err; // rethrow so calling components can also handle it locally if needed
    }
  }, [baseUrl]);

  // Request shortcuts
  const get = useCallback((endpoint, options = {}) => 
    request(endpoint, { method: 'GET', ...options }), [request]);

  const post = useCallback((endpoint, body, options = {}) => 
    request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      ...options 
    }), [request]);

  const put = useCallback((endpoint, body, options = {}) => 
    request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body), 
      ...options 
    }), [request]);

  const del = useCallback((endpoint, options = {}) => 
    request(endpoint, { method: 'DELETE', ...options }), [request]);

  const clearError = () => setError(null);

  return {
    data,
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    clearError
  };
};

export default useApi;
