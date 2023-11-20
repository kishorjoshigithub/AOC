export const userInitialState = {
  userData: {
    role: '',
    username: '',
    email: '',
  },
};

export const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      console.log('Received userData:', action.payload.userData);
      return {
        ...state,
        userData: action.payload.userData,
      };
    // Handle other actions if needed
    default:
      return state;
  }
}


const initialState = {
  isAuthenticated: false,
  
};

 export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('Logged in');
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
    case 'LOGOUT':
      console.log('Logged out');
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
      
    // other cases
    default:
      return state;
  }
};

 

