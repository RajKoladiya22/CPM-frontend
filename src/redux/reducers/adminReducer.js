const initialState = {
    superadminCount: 0,
    adminCount: 0,
    userCount: 0,
    loadingUsers: false,
    error: null,
  };
  
  export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_USER_COUNTS_REQUEST":
        return { ...state, loadingUsers: true, error: null };
  
      case "FETCH_USER_COUNTS_SUCCESS":
        return {
          ...state,
          loadingUsers: false,
          superadminCount: action.payload.superadminCount,
          adminCount: action.payload.adminCount,
          userCount: action.payload.userCount,
        };
  
      case "FETCH_USER_COUNTS_FAIL":
        return { ...state, loadingUsers: false, error: action.payload };
  
      default:
        return state;
    }
  };
  