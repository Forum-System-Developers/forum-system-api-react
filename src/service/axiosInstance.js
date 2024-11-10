import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://project-ham-backend-0189ae61f169.herokuapp.com/api/v1"
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh_token");

    if (error.response && error.response.status === 401) {
      if (refreshToken) {
        try {
          const response = await axios.post("https://project-ham-backend-0189ae61f169.herokuapp.com/api/v1/auth/refresh", 
            { refresh_token: refreshToken }
          );

          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");

          window.location.href = "/login";
        }
      }

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
