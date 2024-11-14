import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';

    if (token && adminStatus) {
      setIsAdmin(true);
      setIsAuthenticated(false); // Only admin should be true, not both
    } else if (token && !adminStatus) {
      setIsAuthenticated(true);
      setIsAdmin(false); // Only user should be true, not both
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  const adminlogin = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
    setIsAuthenticated(false);
  };

  const adminlogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setIsAdmin(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, adminlogin, adminlogout, login, logout, ProtectedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};


export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/userauth" />;
  }
  return children;
};
