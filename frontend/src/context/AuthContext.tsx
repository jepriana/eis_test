import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { login } from '../services/auth_api';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userData: any | null;
  loading: boolean; // Add loading state
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (accessToken: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedRefreshToken && storedUserData) {
      setAccessToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUserData(JSON.parse(storedUserData));
    }
    setLoading(false); // Set loading to false after initialization
  }, []);

  const loginUser = async (username: string, password: string) => {
    const response = await login(username, password);
    const { accessToken, refreshToken, userData } = response.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserData(userData);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logoutUser = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserData(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken: accessToken, refreshToken, userData, loading, loginUser, logoutUser, setAccessToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
