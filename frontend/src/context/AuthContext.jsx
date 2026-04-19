import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('covera_token');
      const cachedUser = localStorage.getItem('covera_user');
      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch (e) { /* ignore */ }
      }
      if (token) {
        try {
          const fresh = await authApi.me();
          setUser(fresh);
          localStorage.setItem('covera_user', JSON.stringify(fresh));
        } catch (e) {
          localStorage.removeItem('covera_token');
          localStorage.removeItem('covera_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('covera_token', res.token);
    localStorage.setItem('covera_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const signup = async (name, email, password) => {
    const res = await authApi.signup(name, email, password);
    localStorage.setItem('covera_token', res.token);
    localStorage.setItem('covera_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const loginWithGoogle = async () => {
    // Simple demo Google login — in production, integrate Google Identity Services.
    const demoProfile = {
      email: `user${Date.now()}@gmail.com`,
      name: 'Google User',
      google_id: `g_${Date.now()}`,
      picture: null,
    };
    const res = await authApi.google(demoProfile);
    localStorage.setItem('covera_token', res.token);
    localStorage.setItem('covera_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('covera_token');
    localStorage.removeItem('covera_user');
    setUser(null);
  };

  const updatePlan = async (plan) => {
    const u = await authApi.updatePlan(plan);
    setUser(u);
    localStorage.setItem('covera_user', JSON.stringify(u));
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
