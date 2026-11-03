import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getCSRF().finally(() => {
      checkAuth();
    });
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe();
      console.log('🔍 checkAuth response:', data);
      setUser(data.user || null);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    console.log('🔐 Login response:', data);
    if (!data.ok) {
      throw data;
    }
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    console.log('🔐 Register response:', data);
    if (!data.ok) {
      throw data;
    }
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (formData) => {
    const data = await authAPI.updateProfile(formData);
    if (!data.ok) {
      throw data;
    }
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};