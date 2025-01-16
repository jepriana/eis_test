import React, { createContext, useState, useEffect } from 'react';
import { login } from '../api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    refreshToken: null,
    user: null,
  });

  useEffect(() => {
    // Restore auth state from localStorage if available
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      setAuthState(JSON.parse(storedAuthState));
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login({ username, password });
      console.log(response);
      const { accessToken, refreshToken, userData } = response.data;
      const newAuthState = { accessToken, refreshToken, userData };
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    setAuthState({ token: null, refreshToken: null, user: null });
    localStorage.removeItem('authState');
  };

  return (
    <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
