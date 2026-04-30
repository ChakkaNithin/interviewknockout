import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const Auth = ({ mode = 'login' }) => {
  const { login, signup, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getPwStrength = (pw) => {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: '#EF4444', width: '25%' };
    if (score <= 2) return { label: 'Fair', color: '#F59E0B', width: '50%' };
    if (score <= 3) return { label: 'Good', color: '#4F8EF7', width: '75%' };
    return { label: 'Strong', color: '#0D6B4F', width: '100%' };
  };

  useEffect(() => {
    setIsLogin(mode === 'login');
    setError('');
    setSuccessMsg('');
  }, [mode]);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, user, navigate, from]);

  if (authLoading || user) return null;

  const getAuthErrorMessage = (err) => {
    const msg = err?.message || '';
    const lower = msg.toLowerCase();
    if (lower.includes('invalid login credentials')) {
      return 'Email or password is incorrect. If you signed up with Google, use "Continue with Google".';
    }
    if (lower.includes('user already registered') || err?.code === 'user_already_exists') {
      return 'This email is already registered. Please sign in instead.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link first, then sign in.';
    }
    return msg || 'Something went wrong. Please try again.';
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const email = form.email.trim();
    const password = form.password;
    const name = form.name.trim();

    setError('');
    setSuccessMsg('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const result = await signup(name, email, password);
        if (!result) {
          setSuccessMsg('Account created! Check your email for the confirmation link, then sign in.');
          return;
        }
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Unlimited resume downloads',
    'AI-powered content suggestions',
    'ATS-optimized templates',
    'Expert JD tailoring by our team',
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B47]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <Link to="/" className="relative flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B47] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold">InterviewKnockout</span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Build a resume that lands interviews in minutes.
          </h1>
          <p className="text-white/80 mb-8">
            Join 15M+ job seekers who've used InterviewKnockout to craft standout resumes and land their dream roles.
          </p>
          <ul className="space-y-3">
            {benefits.map(b => (
              <li key={b} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-[#FF6B47] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-3 text-white/70 text-sm">
          <div className="flex -space-x-2">
            {[
              'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80',
              'https://images.pexels.com/photos/14589344/pexels-photo-14589344.jpeg?w=80',
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80',
            ].map((a, i) => (
              <img key={i} src={a} className="w-8 h-8 rounded-full border-2 border-[#0F3D2E] object-cover" alt="" />
            ))}
          </div>
          <span>⭐ 4.8/5 · 5,187 reviews</span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewKnockout</span>
            </Link>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-600 mb-6">
            {isLogin ? 'Sign in to continue building your career.' : 'Start building your standout resume today.'}
          </p>

          {/* Sign In / Sign Up toggle */}
          <div className="mb-6 inline-flex rounded-full bg-slate-100 p-1 text-sm font-bold">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-full transition-colors ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-full transition-colors ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign Up
            </Link>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-slate-700 bg-white mb-5"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-500 uppercase tracking-wider font-bold">
                or {isLogin ? 'sign in' : 'sign up'} with email
              </span>
            </div>
          </div>

          <div className="space-y-4">

            {!isLogin && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-name"
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && form.password && (() => {
                const s = getPwStrength(form.password);
                return s ? (
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: s.width, background: s.color }} />
                    </div>
                    <p className="text-xs mt-1 font-semibold" style={{ color: s.color }}>{s.label} password</p>
                  </div>
                ) : null;
              })()}
            </div>

            {error && (
              <div role="alert" className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="text-sm text-[#0F3D2E] bg-[#E8F5F0] border border-[#BBE8D8] p-4 rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-[#FF6B47]/20 transition-colors"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link to={isLogin ? '/signup' : '/login'} className="text-[#0F3D2E] font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>

          <p className="text-center mt-4 text-xs text-slate-500">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-700">Terms</a> and{' '}
            <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
