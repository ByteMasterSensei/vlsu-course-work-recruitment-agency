import axios from "axios";
import { authService } from "../services/authService";

const API_URL = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAuthHeader();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const token = authService.getAuthHeader();
        if (token) {
          originalRequest.headers.Authorization = token;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
