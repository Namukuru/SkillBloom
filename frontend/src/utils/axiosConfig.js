import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your backend base URL
});

// Add request interceptor to always include token
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for automatic token refresh
api.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401 && error.response?.data?.code === "token_not_valid") {
        const refreshToken = sessionStorage.getItem("refresh_token");
  
        if (refreshToken) {
          try {
            const refreshResponse = await api.post("/token/refresh/", { refresh: refreshToken });
            sessionStorage.setItem("access_token", refreshResponse.data.access);
            api.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access}`;
  
            // Retry the failed request with the new token
            error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.access}`;
            return api(error.config);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            sessionStorage.clear();
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );
export default api;  
