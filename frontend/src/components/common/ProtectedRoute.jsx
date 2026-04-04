import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, getToken, hasRole } from "../../services/authService";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();
  const redirectPath = `${location.pathname}${location.search}${location.hash}`;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  if (allowedRoles.length && !hasRole(user, allowedRoles)) {
    return <Navigate to="/listings" replace />;
  }

  return children;
};

export default ProtectedRoute;
