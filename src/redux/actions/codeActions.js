import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const generateAdminCode = (username) => async (dispatch) => {
  try {
    dispatch({ type: "GENERATE_ADMIN_CODE_REQUEST" });

    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("Authentication failed! Please login again.");
    }
  
    const { data } = await axiosInstance.post("/users/admincode", {username});

    dispatch({ type: "GENERATE_ADMIN_CODE_SUCCESS", payload: data.data.code });
    toast.success("Admin registration code generated successfully!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to generate admin code";
    dispatch({ type: "GENERATE_ADMIN_CODE_FAIL", payload: errorMessage });
    toast.error(errorMessage);
  }
};

export const generateUserCode = (username) => async (dispatch) => {
  try {
    dispatch({ type: "GENERATE_USER_CODE_REQUEST" });

    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("Authentication failed! Please login again.");
    }

    const { data } = await axiosInstance.post("/users/usercode", {username});
    
    dispatch({ type: "GENERATE_USER_CODE_SUCCESS", payload: data.data.code });
    toast.success("User registration code generated successfully!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to generate user code";
    dispatch({ type: "GENERATE_USER_CODE_FAIL", payload: errorMessage });
    toast.error(errorMessage);
  }
};
