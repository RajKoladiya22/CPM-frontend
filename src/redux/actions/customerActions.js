// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";

// export const addCustomer = (customerData) => async (dispatch) => {
//   try {
//     dispatch({ type: "ADD_CUSTOMER_REQUEST" });

//     const { data } = await axiosInstance.post(
//       "/customer/customer",
//       customerData
//     );
//     // console.log(data);

//     dispatch({ type: "ADD_CUSTOMER_SUCCESS", payload: data });

//     toast.success(data.message || "Customer added successfully!");

//     return Promise.resolve();
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";

//     dispatch({ type: "ADD_CUSTOMER_FAIL", payload: errorMessage });

//     toast.error(errorMessage);

//     return Promise.reject();
//   }
// };

// export const searchCustomer =
//   (searchQuery, page = 1, limit = 10) =>
//   async (dispatch) => {
//     try {
//       dispatch({ type: "FETCH_CUSTOMERS_REQUEST" });

//       const { data } = await axiosInstance.get("/customer/customer", {
//         params: { ...searchQuery, page, limit }, // Send search + pagination params
//       });
//       // console.log("Action",data.data);

//       dispatch({
//         type: "FETCH_CUSTOMERS_SUCCESS",
//         payload: {
//           customers: data.data,
//           pagination: data.data, // Store pagination metadata
//         },
//       });
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong";
//       dispatch({ type: "FETCH_CUSTOMERS_FAIL", payload: errorMessage });
//     }
//   };

// export const deleteCustomer = (customerId) => async (dispatch) => {
//   try {
//     // await axios.delete(`https://cpm-api.vercel.app/api/customer/customer/${customerId}`);
//     await axiosInstance.delete(`/customer/customer/${customerId}`);
//     dispatch({ type: "DELETE_CUSTOMER_SUCCESS", payload: customerId });
//     toast.success("Customer deleted successfully");
//   } catch (error) {
//     toast.error("Fail to Delete");
//     dispatch({
//       type: "DELETE_CUSTOMER_FAIL",
//       payload: error.response.data.message,
//     });
//     throw error;
//   }
// };

// export const updateCustomer =
//   (customerId, customerData) => async (dispatch) => {
//     try {
//       dispatch({ type: "UPDATE_CUSTOMER_REQUEST" });
//       const { data } = await axiosInstance.put(
//         `/customer/customer/${customerId}`,
//         customerData
//       );
//       console.log("Action",data.customer);
//       dispatch({
//         type: "UPDATE_CUSTOMER_SUCCESS",
//         payload: data.customer,
//       });
//       toast.success(data.message || "Customer Updated successfully!");
//       return data;
//     } catch (error) {
//       console.log(error);

//       dispatch({
//         type: "UPDATE_CUSTOMER_FAIL",
//         payload: error.response.data.message,
//       });
//       throw error;
//     }
//   };

// export const addCustomField = (fieldData) => async (dispatch) => {
//   try {
//     dispatch({ type: "ADD_CUSTOM_FIELD_REQUEST" });

//     const { data } = await axiosInstance.post(
//       "/customer/customfield",
//       fieldData
//     );

//     dispatch({ type: "ADD_CUSTOM_FIELD_SUCCESS", payload: data.data });

//     toast.success(data.message || "Custom field added successfully!");
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";

//     dispatch({ type: "ADD_CUSTOM_FIELD_FAIL", payload: errorMessage });

//     toast.error(errorMessage);
//   }
// };

// export const getCustomFields = () => async (dispatch) => {
//   try {
//     dispatch({ type: "FETCH_CUSTOM_FIELDS_REQUEST" });

//     const { data } = await axiosInstance.get("/customer/customfield");
//     // console.log("Data From Action \n", data.data);

//     dispatch({ type: "FETCH_CUSTOM_FIELDS_SUCCESS", payload: data.data });
//   } catch (error) {
//     dispatch({
//       type: "FETCH_CUSTOM_FIELDS_FAIL",
//       payload: error.response?.data?.message || "Failed to fetch fields",
//     });
//   }
// };

// export const updateCustomField = (id, updatedData) => async (dispatch) => {
//   try {
//     dispatch({ type: "UPDATE_CUSTOM_FIELD_REQUEST" });

//     const { data } = await axiosInstance.put(
//       `/customer/customfield/${id}`,
//       updatedData
//     );
//     toast.success(data.message || "Field Updated successfully!");
//     dispatch({ type: "UPDATE_CUSTOM_FIELD_SUCCESS", payload: data.data });
//   } catch (error) {
//     dispatch({ type: "UPDATE_CUSTOM_FIELD_FAILURE", payload: error.message });
//   }
// };

// export const deleteField = (fieldId) => async (dispatch) => {
//   try {
//     await axiosInstance.delete(`/customer/customfield/${fieldId}`);
//     dispatch({ type: "DELETE_FIELD_SUCCESS", payload: fieldId });
//     toast.success("Field deleted successfully");
//   } catch (error) {
//     toast.error("Failed to delete field.");
//     dispatch({
//       type: "DELETE_FIELD_FAIL",
//       payload: error.response.data.message,
//     });
//     throw error;
//   }
// };


import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

// ✅ Add Customer
export const addCustomer = (customerData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CUSTOMER_REQUEST" });

    const { data } = await axiosInstance.post("/customer/customer", customerData);

    dispatch({ type: "ADD_CUSTOMER_SUCCESS", payload: data.data });

    toast.success(data.message || "Customer added successfully!");
    return Promise.resolve();
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";

    dispatch({ type: "ADD_CUSTOMER_FAIL", payload: errorMessage });
    toast.error(errorMessage);

    return Promise.reject();
  }
};

// ✅ Search Customers with Pagination
export const searchCustomer = (searchQuery, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_CUSTOMERS_REQUEST" });

    const { data } = await axiosInstance.get("/customer/customer", {
      params: { ...searchQuery, page, limit },
    });
    // console.log(data);
    
    dispatch({
      type: "FETCH_CUSTOMERS_SUCCESS",
      payload: {
        customers: data.data.customers, // Extract customer array correctly
        pagination: data.data.pagination, // Ensure pagination data is stored
      },
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: "FETCH_CUSTOMERS_FAIL", payload: errorMessage });
  }
};

// ✅ Delete Customer
export const deleteCustomer = (customerId) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/customer/customer/${customerId}`);
    
    dispatch({ type: "DELETE_CUSTOMER_SUCCESS", payload: customerId });
    toast.success("Customer deleted successfully");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete";
    
    dispatch({ type: "DELETE_CUSTOMER_FAIL", payload: errorMessage });
    toast.error(errorMessage);
    
    throw error;
  }
};

// ✅ Update Customer
export const updateCustomer = (customerId, customerData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_CUSTOMER_REQUEST" });

    const { data } = await axiosInstance.put(`/customer/customer/${customerId}`, customerData);

    dispatch({
      type: "UPDATE_CUSTOMER_SUCCESS",
      payload: data.customer,
    });

    toast.success(data.message || "Customer updated successfully!");
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Update failed";

    dispatch({ type: "UPDATE_CUSTOMER_FAIL", payload: errorMessage });
    toast.error(errorMessage);

    throw error;
  }
};

// ✅ Add Custom Field
export const addCustomField = (fieldData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CUSTOM_FIELD_REQUEST" });

    const { data } = await axiosInstance.post("/customer/customfield", fieldData);

    dispatch({ type: "ADD_CUSTOM_FIELD_SUCCESS", payload: data.data });

    toast.success(data.message || "Custom field added successfully!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";

    dispatch({ type: "ADD_CUSTOM_FIELD_FAIL", payload: errorMessage });
    toast.error(errorMessage);
  }
};

// ✅ Get Custom Fields
export const getCustomFields = () => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_CUSTOM_FIELDS_REQUEST" });

    const { data } = await axiosInstance.get("/customer/customfield");

    dispatch({ type: "FETCH_CUSTOM_FIELDS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({
      type: "FETCH_CUSTOM_FIELDS_FAIL",
      payload: error.response?.data?.message || "Failed to fetch fields",
    });
  }
};

// ✅ Update Custom Field
export const updateCustomField = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_CUSTOM_FIELD_REQUEST" });

    const { data } = await axiosInstance.put(`/customer/customfield/${id}`, updatedData);

    dispatch({ type: "UPDATE_CUSTOM_FIELD_SUCCESS", payload: data.data });

    toast.success(data.message || "Custom field updated successfully!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Update failed";

    dispatch({ type: "UPDATE_CUSTOM_FIELD_FAILURE", payload: errorMessage });
    toast.error(errorMessage);
  }
};

// ✅ Delete Custom Field
export const deleteField = (fieldId) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/customer/customfield/${fieldId}`);

    dispatch({ type: "DELETE_FIELD_SUCCESS", payload: fieldId });
    toast.success("Custom field deleted successfully");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete";

    dispatch({ type: "DELETE_FIELD_FAIL", payload: errorMessage });
    toast.error(errorMessage);

    throw error;
  }
};
