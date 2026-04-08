import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
