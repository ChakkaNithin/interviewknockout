import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext(null);

const toAppUser = (supaUser) => {
  if (!supaUser) return null;
  return {
    id: supaUser.id,
    email: supaUser.email,
    name: supaUser.user_metadata?.name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || '',
    plan: supaUser.user_metadata?.plan || 'free',
    cal_booking_url: supaUser.user_metadata?.cal_booking_url || 'https://cal.com/interviewknockout/interviewknockout-consultation',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires immediately with INITIAL_SESSION on mount —
    // this replaces getSession() and is the ONLY place we set user.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAppUser(session?.user ?? null));
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange already updated user in context by this point
    return toAppUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    // null session means Supabase email confirmation is ON
    if (!data.session) return null;
    return toAppUser(data.user);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange fires SIGNED_OUT and sets user to null
  };

  const updatePlan = async (plan) => {
    const { data, error } = await supabase.auth.updateUser({ data: { plan } });
    if (error) throw error;
    const updated = toAppUser(data.user);
    setUser(updated);
    return updated;
  };

  const refreshUser = async () => {
    const { data: { user: fresh } } = await supabase.auth.getUser();
    const updated = toAppUser(fresh);
    setUser(updated);
    return updated;
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
