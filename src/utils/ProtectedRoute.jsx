import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Use the auth context

const ProtectedRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
   
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
