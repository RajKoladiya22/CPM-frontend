import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const registerUser = (userData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_REQUEST" });
    console.log(userData);
    
    const { data } = await axiosInstance.post("/users/register", userData);
    console.log("DATA", data);

    dispatch({ type: "REGISTER_SUCCESS", payload: data });
    toast.success("Register successfull!");
    // navigate("/login");
  } catch (error) {
    console.log(error);
    
    dispatch({
      type: "REGISTER_FAIL",
      payload: error.response?.data?.message || "Registration failed",
    });
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });
    
    // const { data } = await axios.post(
    //   "https://cpm-api.vercel.app/api/users/login",
    //   credentials
    // );
    const { data } = await axiosInstance.post("/users/login", credentials);
    console.log(data);
    
    let token = data?.data?.token;
    let user = data?.data?.user;

    if (token) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data.data.user });

      localStorage.setItem("userToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successfull!");
      navigate("/");
    } else {
      dispatch({ type: "LOGIN_FAIL", payload: "Invalid credentials" });
      toast.error("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login Error:", error);

    let errorMessage = "Login failed";

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = error.response.data?.message || "User not found!";
      } else if (error.response.status === 401) {
        errorMessage = "Invalid email or password!";
      } else {
        errorMessage = error.response.data?.message || "Something went wrong.";
      }
    }

    dispatch({ type: "LOGIN_FAIL", payload: errorMessage });
    toast.error(errorMessage);
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
  delete axiosInstance.defaults.headers.common["Authorization"];

  dispatch({ type: "LOGOUT" });
  window.location.href = "/login";
};

export const setUserFromLocalStorage = (userData) => {
  return {
    type: "SET_USER_FROM_LOCAL_STORAGE",
    payload: userData,
  };
};
