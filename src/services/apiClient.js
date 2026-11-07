import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

let unauthorizedHandler = null;

// Lets the store react to a 401 without creating a circular import.
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Backend errors come as { message }, { message, errors[] } or a plain-text body.
const toApiError = (error) => {
  if (!error.response) {
    return new ApiError('Unable to reach the server. Please check your connection.', 0);
  }
  const { status, data } = error.response;
  let message = typeof data === 'string' && data ? data : data?.message;
  if (Array.isArray(data?.errors) && data.errors.length) {
    message = `${message || 'Validation failed'}: ${data.errors.join(', ')}`;
  }
  return new ApiError(message || `Request failed (${status})`, status, data);
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if (apiError.status === 401 && !isLoginCall && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(apiError);
  },
);

// Success responses are wrapped as { status, message, httpCode, data }.
export const unwrap = (response) => response.data?.data ?? null;

export default apiClient;
