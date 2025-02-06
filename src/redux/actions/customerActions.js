import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

// ✅ Add Customer
export const addCustomer = (customerData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CUSTOMER_REQUEST" });

    const { data } = await axiosInstance.post(
      "/customer/customer",
      customerData
    );
    // console.log(data);

    dispatch({ type: "ADD_CUSTOMER_SUCCESS", payload: data });

    toast.success(data.message || "Customer added successfully!");

    return Promise.resolve();
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";

    dispatch({ type: "ADD_CUSTOMER_FAIL", payload: errorMessage });

    toast.error(errorMessage);

    return Promise.reject();
  }
};

export const searchCustomer = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_CUSTOMERS_REQUEST" });

    const { data } = await axiosInstance.get("/customer/customer", {
      params: searchQuery, // Sending search query as params
    });
    dispatch({
      type: "FETCH_CUSTOMERS_SUCCESS",
      payload: data.data,
    });
  } catch (error) {
    // console.log(error);

    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    dispatch({ type: "FETCH_CUSTOMERS_FAIL", payload: errorMessage });
  }
};

export const deleteCustomer = (customerId) => async (dispatch) => {
  try {
    // await axios.delete(`https://cpm-api.vercel.app/api/customer/customer/${customerId}`);
    await axiosInstance.delete(`/customer/customer/${customerId}`);
    dispatch({ type: "DELETE_CUSTOMER_SUCCESS", payload: customerId });
    toast.success("Customer deleted successfully");
  } catch (error) {
    toast.error("Fail to Delete");
    dispatch({
      type: "DELETE_CUSTOMER_FAIL",
      payload: error.response.data.message,
    });
    throw error;
  }
};

export const updateCustomer =
  (customerId, customerData) => async (dispatch) => {
    try {
      dispatch({ type: "UPDATE_CUSTOMER_REQUEST" });
      const { data } = await axiosInstance.put(
        `/customer/customer/${customerId}`,
        customerData
      );
      dispatch({ type: "UPDATE_CUSTOMER_SUCCESS", payload: data.customer });
      toast.success(data.message || "Customer Updated successfully!");
      return data;
    } catch (error) {
      dispatch({
        type: "UPDATE_CUSTOMER_FAIL",
        payload: error.response.data.message,
      });
      throw error;
    }
  };
// ✅ Add Custom Field
export const addCustomField = (fieldData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CUSTOM_FIELD_REQUEST" });

    const { data } = await axiosInstance.post(
      "/customer/customfield",
      fieldData
    );

    dispatch({ type: "ADD_CUSTOM_FIELD_SUCCESS", payload: data.data });

    toast.success(data.message || "Custom field added successfully!");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";

    dispatch({ type: "ADD_CUSTOM_FIELD_FAIL", payload: errorMessage });

    toast.error(errorMessage);
  }
};

// ✅ Fetch Custom Fields
export const getCustomFields = () => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_CUSTOM_FIELDS_REQUEST" });

    const { data } = await axiosInstance.get("/customer/customfield");
    // console.log("Data From Action \n", data.data);

    dispatch({ type: "FETCH_CUSTOM_FIELDS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({
      type: "FETCH_CUSTOM_FIELDS_FAIL",
      payload: error.response?.data?.message || "Failed to fetch fields",
    });
  }
};

export const updateCustomField = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_CUSTOM_FIELD_REQUEST" });

    const { data } = await axiosInstance.put(
      `/customer/customfield/${id}`,
      updatedData
    );

    dispatch({ type: "UPDATE_CUSTOM_FIELD_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "UPDATE_CUSTOM_FIELD_FAILURE", payload: error.message });
  }
};

export const deleteField = (fieldId) => async (dispatch) => {
  try {
    // console.log("ACTION ID", fieldId);

    // await axios.delete(`https://cpm-api.vercel.app/api/customer/customer/${fieldId}`);
    await axiosInstance.delete(`/customer/customfield/${fieldId}`);
    dispatch({ type: "DELETE_FIELD_SUCCESS", payload: fieldId });
    toast.success("Field deleted successfully");
  } catch (error) {
    toast.error("Fail to Delete");
    dispatch({
      type: "DELETE_FIELD_FAIL",
      payload: error.response.data.message,
    });
    throw error;
  }
};
