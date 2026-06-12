import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  
  // If authorized, return outlet (child routes) otherwise navigate to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
