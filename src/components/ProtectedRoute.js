import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, requiredRole }) => {
  const userData = useSelector((state) => state.user.userData);

 
  const isAuthenticated = userData;

  if (isAuthenticated && userData.role === requiredRole) {
   
    return element;
  } else if (isAuthenticated) {
    
    return <Navigate to="/unauthorized" />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
