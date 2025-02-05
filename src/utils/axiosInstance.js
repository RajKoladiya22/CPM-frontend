import axios from "axios";
import { logoutUser } from "../redux/actions/authActions";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8052/api",
  baseURL: "https://cpm-api.vercel.app/api",
});

// Request Interceptor (Attach token automatically)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle Token Expiry)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // const  store  = await import("../redux/store"); // <-- Dynamically import store
      // store.dispatch(logoutUser());
      toast.error("session expired");
      const reduxStoreModule = await import("../redux/store");
      const store = reduxStoreModule.default; // Get the default export

      if (store && typeof store.dispatch === "function") {
        store.dispatch(logoutUser());
      } else {
        console.error("Redux store is not available or dispatch is not a function.");
      }

      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");

      delete axiosInstance.defaults.headers.common["Authorization"];

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
