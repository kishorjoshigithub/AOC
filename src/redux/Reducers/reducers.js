// reducers.js

import { setUserData } from "../Actions/userActions";

const initialState = {
  userData: null,// Add userId to the initial state
  // Other initial state properties
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
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
