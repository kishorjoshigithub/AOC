import React from 'react';
import { Navigate} from 'react-router-dom';
import {  useSelector } from 'react-redux';


const ProtectedRoute = ({ element, requiredRole }) => {
  const userData = useSelector((state) => state.user.userData);
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  

  if (authenticated && userData.role === requiredRole) {
    
    return element;
  } 
   else {
    
    return <Navigate to="/start" />;
  }
};

export default ProtectedRoute;
