// src/components/common/ProtectedRoute.jsx - Require login to access
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  // If not logged in, redirect to login page
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
