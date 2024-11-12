import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);  // Set authentication state based on localStorage token
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const login = (token, username) => {
    // Set token and username in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear user data from localStorage and update state
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/userauth?view=signIn" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, ProtectedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};
