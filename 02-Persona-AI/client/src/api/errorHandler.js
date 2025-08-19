// Custom error classes
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Error handler utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || `HTTP Error ${status}`;
    
    if (status >= 400 && status < 500) {
      // Client errors
      if (status === 422 && data?.errors) {
        throw new ValidationError(message, data.errors);
      }
      throw new APIError(message, status, data);
    } else if (status >= 500) {
      // Server errors
      throw new APIError('Server error occurred. Please try again later.', status, data);
    }
  } else if (error.request) {
    // Network error
    throw new NetworkError('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Success response handler
export const handleAPIResponse = (response) => {
  return response.data.reply;
};

// Retry utility for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.log(`Request failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
};