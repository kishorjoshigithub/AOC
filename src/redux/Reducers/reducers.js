const initialState = {
  userData: {},
  
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      console.log('Received userData:', action.payload.userData); // Log the userData
      return {
        ...state,
        userData: action.payload.userData,
      };
    // Handle other actions if needed
    default:
      return state;
  }
};

export default userReducer;
