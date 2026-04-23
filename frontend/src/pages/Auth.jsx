import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

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

  // Load Google Identity Services script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError('Please fill all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('Google Sign-In requires a Google Client ID to be configured. Please contact support or use email/password login.');
    // To enable Google login:
    // 1. Get Google OAuth Client ID from https://console.cloud.google.com/
    // 2. Add REACT_APP_GOOGLE_CLIENT_ID to frontend/.env
    // 3. Uncomment the code below and remove this error message
    
    /* 
    if (!window.google) {
      setError('Google Sign-In is loading. Please try again in a moment.');
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: async (response) => {
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
      }
    });
    
    window.google.accounts.id.prompt();
    */
  };

  const benefits = [
    'Unlimited resume downloads',
    'AI-powered content suggestions',
    'ATS-optimized templates',
    'One-click JD tailoring',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B47]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
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
            {['https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80','https://images.pexels.com/photos/14589344/pexels-photo-14589344.jpeg?w=80','https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80'].map((a,i) => (
              <img key={i} src={a} className="w-8 h-8 rounded-full border-2 border-[#0F3D2E] object-cover" alt="" />
            ))}
          </div>
          <div>⭐ 4.8/5 · 5,187 reviews</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewKnockout</span>
            </Link>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-600 mb-8">
            {isLogin ? 'Sign in to continue building your career.' : 'Start building your standout resume today.'}
          </p>

          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold text-slate-700 transition-colors mb-5 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-slate-500 uppercase tracking-wider font-bold">or {isLogin ? 'sign in' : 'sign up'} with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" autoComplete="name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" autoComplete="email" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="At least 6 characters" autoComplete={isLogin ? "current-password" : "new-password"} className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-[#FF6B47]/20 transition-all">
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[#0F3D2E] font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="text-center mt-8 text-xs text-slate-500">
            By continuing, you agree to our <a href="#" className="underline hover:text-slate-700">Terms</a> and <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
