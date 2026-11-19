import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ctss_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ctss_token') || null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('ctss_token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('ctss_user', JSON.stringify(response.data.data));
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ctss_token');
      localStorage.removeItem('ctss_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const userData = response.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('ctss_token', userData.token);
      localStorage.setItem('ctss_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (name, email, password, role = 'customer') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    if (response.data.success) {
      const userData = response.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('ctss_token', userData.token);
      localStorage.setItem('ctss_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ctss_token');
    localStorage.removeItem('ctss_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

