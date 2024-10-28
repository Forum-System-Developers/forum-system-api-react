import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1"
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

    if (error.response && error.response.status === 401 && refreshToken) {
      try { 

      const response = await axios.post("http://localhost:8000/api/v1/auth/refresh", 
          { refresh_token: refreshToken }
        );
          localStorage.setItem("token", access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return axiosInstance(originalRequest);
      } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            
            window.location.href = "/login";
          }
        }
      return Promise.reject(error);
  },
);

export default axiosInstance;
