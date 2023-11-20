

export const setUserData = (userData) => {
    return {
        type: 'SET_USER_DATA',
        payload: {
            userData,
        },
    };
};

export const login = () => ({
  type: 'LOGIN',
  isAuthenticated: true,
});
export const logout = () => ({
  type: 'LOGOUT',
  isAuthenticated: false,
});


// In your Redux actions
  