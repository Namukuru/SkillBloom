import React, { createContext, useState, useEffect } from "react";

// Create a Context for Authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for access_token in sessionStorage when the component loads
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true); // Set as authenticated if token exists
    }
  }, []); // Empty dependency array means this runs only once when the component mounts

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    sessionStorage.clear(); // Clear session storage upon logout
    setIsAuthenticated(false); // Set authentication state to false
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
};