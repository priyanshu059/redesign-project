// src/hooks/useAuth.js - Custom hook to access AuthContext
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Call this in any component to get auth state:
// const { user, login, logout, isAdmin } = useAuth();
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default useAuth;
