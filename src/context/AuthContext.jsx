import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { authAPI, setUnauthorizedHandler } from '../api/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (userRef.current) {
        userRef.current = null;
        setUser(null);
        addToast('Сессия истекла, войдите снова', 'error');
      }
    });
    return () => setUnauthorizedHandler(null);
  }, [addToast]);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user || null);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    if (!data.ok) {
      throw data;
    }
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
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
