import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const userRole = getUserRole();
  const authStatus = isAuthenticated();

  if (!authStatus) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
