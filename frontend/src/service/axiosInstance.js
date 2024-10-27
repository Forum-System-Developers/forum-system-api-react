import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Set your base URL
});

// Interceptor to add token to headers if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic in axios instance
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) { // Unauthorized
      const refresh_token = localStorage.getItem('refresh_token');

      if (refresh_token) {
        return axios.post('http://localhost:8000/api/v1/auth/refresh', {
          refresh_token
        })
        .then((response) => {
          const { access_token } = response.data;
          localStorage.setItem('token', access_token);

          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return axios(originalRequest); // Retry the original request
        })
        .catch((refreshError) => {
          console.error('Token refresh failed:', refreshError);
          // Handle refresh token failure (e.g., redirect to login)
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        });
      } else {
        // If there's no refresh token, redirect to login directly
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
