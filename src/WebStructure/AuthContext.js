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
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setIsAuthenticated(true);
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
    }
  }, []);

  const adminlogin = (isAdmin) => {
    localStorage.setItem('isAdmin', isAdmin);
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
  };

  const adminlogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setIsAdmin(false); // Reset both isAuthenticated and isAdmin
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
