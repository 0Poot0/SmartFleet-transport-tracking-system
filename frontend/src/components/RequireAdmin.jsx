import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../utils/auth';

const RequireAdmin = ({ children }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;

