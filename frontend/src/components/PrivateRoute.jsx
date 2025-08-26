import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If user is logged in, show the requested page (via <Outlet />)
  // Otherwise, redirect them to the /login page
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
