import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('resumeflow_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('resumeflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login
    const mockUser = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      plan: 'free',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('resumeflow_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const signup = (name, email, password) => {
    const mockUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      plan: 'free',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('resumeflow_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const loginWithGoogle = () => {
    const mockUser = {
      id: 'u_google_' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      plan: 'free',
      avatar: null,
      createdAt: new Date().toISOString(),
      provider: 'google',
    };
    localStorage.setItem('resumeflow_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('resumeflow_user');
    setUser(null);
  };

  const updatePlan = (plan) => {
    if (!user) return;
    const updated = { ...user, plan };
    localStorage.setItem('resumeflow_user', JSON.stringify(updated));
    setUser(updated);
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
