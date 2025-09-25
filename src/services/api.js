import axios from 'axios';

// Read API base URL from Vite environment variables; fallback to localhost:8888
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';
// Optional: enable cookie-based auth if backend uses cookies (CORS must allow credentials)
const WITH_CREDENTIALS = (import.meta.env.VITE_API_WITH_CREDENTIALS || 'false') === 'true';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: WITH_CREDENTIALS,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    // Helper: determine if this request is public (no token required)
    const isGet = (config.method || 'get').toLowerCase() === 'get';
    let isPublic = false;
    try {
      const url = new URL(config.url, BASE_URL);
      const path = url.pathname.replace(/\/+$/, '') || '/';
  // Public GET endpoints
  const publicPaths = ['/api/services', '/api/quotes'];
  const publicGetRegexes = [/^\/api\/tradies\/\d+$/]; // e.g., /api/tradies/135
  isPublic = isGet && (publicPaths.includes(path) || publicGetRegexes.some((re) => re.test(path)));
    } catch {
      // If URL parsing fails, default to enforcing auth
      isPublic = false;
    }

    // Read token from both localStorage and sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Attach Authorization header if token exists (even for public endpoints it's okay but not required)
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // If no token and endpoint is public, allow the request to proceed without redirect/reject
    if (isPublic) {
      return config;
    }

    // Otherwise, redirect to login and block the request
    if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(new Error('Missing auth token'));
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally: clear tokens and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear any stored auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Avoid redirect loop when already on login
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
