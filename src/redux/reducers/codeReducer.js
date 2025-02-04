const initialState = {
  loadingAdmin: false,
  loadingUser: false,
  adminCode: null,
  userCode: null,
  error: null
};

export const codeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GENERATE_ADMIN_CODE_REQUEST":
      return { ...state, loadingAdmin: true, error: null };
    case "GENERATE_USER_CODE_REQUEST":
      return { ...state, loadingUser: true, error: null };

    case "GENERATE_ADMIN_CODE_SUCCESS":
      return { ...state, loadingAdmin: false, adminCode: action.payload };
    case "GENERATE_USER_CODE_SUCCESS":
      return { ...state, loadingUser: false, userCode: action.payload };

    case "GENERATE_ADMIN_CODE_FAIL":
      return { ...state, loadingAdmin: false, error: action.payload };
    case "GENERATE_USER_CODE_FAIL":
      return { ...state, loadingUser: false, error: action.payload };

    default:
      return state;
  }
};
