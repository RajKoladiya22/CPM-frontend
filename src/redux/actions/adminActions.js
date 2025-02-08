import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export const fetchUserCounts = () => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_USER_COUNTS_REQUEST" });

    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("Authentication failed! Please log in again.");

    const { data } = await axiosInstance.get("/userlist");

    dispatch({
      type: "FETCH_USER_COUNTS_SUCCESS",
      payload: {
        superadminCount: data.data.superadmins.length,
        adminCount: data.data.admins.length,
        userCount: data.data.users.length,
      },
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user counts";
    dispatch({ type: "FETCH_USER_COUNTS_FAIL", payload: errorMessage });
    toast.error(errorMessage);
  }
};
