// ============================================================
// src/context/AuthContext.jsx - Global Auth State
// ============================================================
// This provides login/logout state to every component in the app.
// Any component can use useContext(AuthContext) to know if a user is logged in.
// ============================================================

import { createContext, useState, useEffect } from 'react';

// Create the context object
export const AuthContext = createContext(null);

// AuthProvider wraps the whole app (in main.jsx)
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage so login persists on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // --- login ---
  // Called after a successful login API call.
  // Saves user info and token to state + localStorage.
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // --- logout ---
  // Clears all user data from state and localStorage.
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Derived values for easy checking
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
