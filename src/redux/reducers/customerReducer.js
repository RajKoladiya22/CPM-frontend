// ✅ Customer Reducer
const customerInitialState = {
  loading: false,
  customers: [],
  error: null,
};

export const customerReducer = (state = customerInitialState, action) => {
  switch (action.type) {
    case "FETCH_CUSTOMERS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CUSTOMERS_SUCCESS":
      return { ...state, loading: false, customers: action.payload };
    case "FETCH_CUSTOMERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ADD_CUSTOMER_REQUEST":
      return { ...state, loading: true, success: false, error: null };
    case "ADD_CUSTOMER_SUCCESS":
      return { ...state, loading: false, success: true, error: null };
    case "ADD_CUSTOMER_FAIL":
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case "UPDATE_CUSTOMER_REQUEST":
      return { ...state, loading: true, success: false, error: null };
    case "UPDATE_CUSTOMER_SUCCESS":
      return {
        ...state,
        loading: false,
        customers: state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        ),
      };
    case "UPDATE_CUSTOMER_FAIL":
      return { ...state, loading: false, success: false, error: null };
    case "DELETE_CUSTOMER_SUCCESS":
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

// ✅ Custom Field Reducer
const customFieldInitialState = {
  loading: false,
  customFields: [],
  error: null,
};

export const customFieldReducer = (state = customFieldInitialState, action) => {
  switch (action.type) {
    case "ADD_CUSTOM_FIELD_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CUSTOM_FIELDS_REQUEST":
      return { ...state, loading: true };
    case "ADD_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        loading: false,
        customFields: [...state.customFields, action.payload],
      };
    case "FETCH_CUSTOM_FIELDS_SUCCESS":
      return { ...state, loading: false, customFields: action.payload };
    case "ADD_CUSTOM_FIELD_FAIL":
    case "FETCH_CUSTOM_FIELDS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_FIELD_SUCCESS":
      return {
        ...state,
        customFields: state.customFields.filter(
          (field) => field._id !== action.payload
        ),
      };
    case "UPDATE_CUSTOM_FIELD_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        loading: false,
        customFields: state.customFields.map((field) =>
          field._id === action.payload._id ? action.payload : field
        ),
      };
    case "UPDATE_CUSTOM_FIELD_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
