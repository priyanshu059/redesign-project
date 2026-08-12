// src/hooks/useAdmin.js - Hook to access admin status
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAdmin = () => {
  const { isAdmin, user } = useContext(AuthContext);
  return { isAdmin, user };
};

export default useAdmin;
