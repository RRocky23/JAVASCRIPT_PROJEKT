import axios from "axios";
import * as tokenService from "./tokenService.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if(!original || original._retry) {
      return Promise.reject(error);
    }
    
    if(error.response?.status === 401) {
      original._retry = true;
      try {
        const refreshRes = await axios.post("/api/account/refresh", {}, { withCredentials: true });
        const newAccessToken = refreshRes.data.accessToken;
        if(newAccessToken) {
          tokenService.setAccessToken(newAccessToken, true);
          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(original);
        }
      } 
      catch (refreshErr) {
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;