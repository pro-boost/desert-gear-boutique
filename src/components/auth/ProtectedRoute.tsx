import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const location = useLocation();

  // TODO: Replace with Clerk authentication
  // Temporarily redirecting to login page
  return (
    <Navigate
      to="/auth/login"
      state={{ returnTo: location.pathname }}
      replace
    />
  );
};

export default ProtectedRoute;
