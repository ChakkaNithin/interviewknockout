import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const stagger = (d = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: d } },
});

const Auth = ({ mode = 'login' }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleBtnRef = useRef(null);

  const handleGoogleCallback = useCallback(async (response) => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle(response.credential);
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate, from]);

  const renderGoogleButton = useCallback(() => {
    if (!window.google || !googleBtnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
    googleBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: googleBtnRef.current.offsetWidth || 448,
    });
  }, [handleGoogleCallback]);

  useEffect(() => {
    if (window.google) { renderGoogleButton(); return; }
    if (document.getElementById('gsi-script')) {
      document.getElementById('gsi-script').addEventListener('load', renderGoogleButton);
      return;
    }
    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [renderGoogleButton]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError('Please fill all fields');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
      navigate(from);
    } catch (err) {
      const message = err.response?.data?.detail
        || (err.request && !err.response ? 'Unable to reach the server. Please check that the backend is running.' : '')
        || err.message
        || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Unlimited resume downloads',
    'AI-powered content suggestions',
    'ATS-optimized templates',
    'One-click JD tailoring',
  ];

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] p-12 flex-col justify-between relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B47]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease }}
        >
          <Link to="/" className="relative flex items-center gap-2 text-white">
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#FF6B47] flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold">InterviewKnockout</span>
          </Link>
        </motion.div>

        <motion.div className="relative" variants={stagger(0.1)} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} className="text-4xl font-extrabold text-white leading-tight mb-4">
            Build a resume that lands interviews in minutes.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/80 mb-8">
            Join 15M+ job seekers who've used InterviewKnockout to craft standout resumes and land their dream roles.
          </motion.p>
          <motion.ul variants={stagger(0.09)} className="space-y-3">
            {benefits.map((b, i) => (
              <motion.li key={b} variants={fadeUp} className="flex items-center gap-3 text-white/90">
                <motion.div
                  className="w-6 h-6 rounded-full bg-[#FF6B47] flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.35 + i * 0.09 }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative flex items-center gap-3 text-white/70 text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="flex -space-x-2">
            {[
              'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80',
              'https://images.pexels.com/photos/14589344/pexels-photo-14589344.jpeg?w=80',
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80',
            ].map((a, i) => (
              <img key={i} src={a} className="w-8 h-8 rounded-full border-2 border-[#0F3D2E] object-cover" alt="" />
            ))}
          </div>
          <div>⭐ 4.8/5 · 5,187 reviews</div>
        </motion.div>
      </motion.div>

      {/* Right form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <motion.div
            className="lg:hidden mb-8"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewKnockout</span>
            </Link>
          </motion.div>

          {/* Heading — re-animates when switching login ↔ signup */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-head' : 'signup-head'}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease }}
            >
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-slate-600 mb-8">
                {isLogin ? 'Sign in to continue building your career.' : 'Start building your standout resume today.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Google button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease }}
          >
            <div ref={googleBtnRef} className="w-full mb-5 flex justify-center min-h-[44px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.3 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-slate-200"></div></div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-500 uppercase tracking-wider font-bold">
                or {isLogin ? 'sign in' : 'sign up'} with email
              </span>
            </div>
          </motion.div>

          {/* Form fields — stagger in, re-animate on mode switch */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login-form' : 'signup-form'}
              onSubmit={handleSubmit}
              variants={stagger(0.07)} initial="hidden" animate="show"
              className="space-y-4"
            >
              {!isLogin && (
                <motion.div variants={fadeUp}>
                  <label htmlFor="auth-name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-name" name="name" type="text" value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="John Doe" autoComplete="name"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp}>
                <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-email" name="email" type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="you@example.com" autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <label htmlFor="auth-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-password" name="password" type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="At least 8 characters"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={fadeUp}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 14px 32px rgba(255,107,71,0.30)' } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-[#FF6B47]/20 transition-colors"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            </motion.form>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-center mt-6 text-sm text-slate-600"
          >
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[#0F3D2E] font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            className="text-center mt-8 text-xs text-slate-500"
          >
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-700">Terms</a> and{' '}
            <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
