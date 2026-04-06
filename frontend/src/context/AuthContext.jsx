// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login/', { email, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    // Decode JWT payload to get user info
    const payload = JSON.parse(atob(res.data.access.split('.')[1]));
    localStorage.setItem('user', JSON.stringify(payload));
    setUser(payload);
    return payload;
  };

  const register = async (email, name, password, password2, role = 'NORMAL_USER') => {
    const res = await api.post('/api/auth/register/', {
      email,
      name,
      password,
      password2,
      role,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
