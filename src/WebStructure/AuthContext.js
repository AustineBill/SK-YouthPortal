import React, { createContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const adminStatus = sessionStorage.getItem("isAdmin") === "true";

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

    setLoading(false);
  }, []);

  if (loading) return null;

  const adminlogin = (token) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("isAdmin", "true");
    setIsAdmin(true);
    setIsAuthenticated(false);
  };

  const adminlogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setLoading(loading);
  };

  const login = (token, username) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("username", username);
    setIsAuthenticated(true);
    setIsAdmin(false);
  };

  const logout = () => {
    sessionStorage.clear(); // Clears all session data
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        adminlogin,
        adminlogout,
        login,
        logout,
        ProtectedRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ProtectedRoute component to restrict access
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/userauth" />;
  }
  return children;
};
