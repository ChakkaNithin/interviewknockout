import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('ik_token');
      const cachedUser = localStorage.getItem('ik_user');

      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch { localStorage.removeItem('ik_user'); }
      }

      if (token) {
        try {
          const fresh = await authApi.me();
          setUser(fresh);
          localStorage.setItem('ik_user', JSON.stringify(fresh));
        } catch (error) {
          const status = error?.response?.status;
          if (status === 401 || status === 403 || status === 404) {
            // Token is invalid, expired, or points to a deleted user.
            localStorage.removeItem('ik_token');
            localStorage.removeItem('ik_user');
            setUser(null);
          }
          // Network error / 5xx — keep cached user logged in, don't force logout
        }
      }

      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('ik_token', res.token);
    localStorage.setItem('ik_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const signup = async (name, email, password) => {
    const res = await authApi.signup(name, email, password);
    localStorage.setItem('ik_token', res.token);
    localStorage.setItem('ik_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const loginWithGoogle = async (googleToken) => {
    const res = await authApi.google({ token: googleToken });
    localStorage.setItem('ik_token', res.token);
    localStorage.setItem('ik_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('ik_token');
    localStorage.removeItem('ik_user');
    setUser(null);
  };

  const updatePlan = async (plan) => {
    const u = await authApi.updatePlan(plan);
    setUser(u);
    localStorage.setItem('ik_user', JSON.stringify(u));
    return u;
  };

  const refreshUser = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ik_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, updatePlan, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
