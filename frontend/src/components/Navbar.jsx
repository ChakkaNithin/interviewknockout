import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, User, Target, PenLine, Search } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const tools = [
    { label: 'ATS Score', desc: 'Check resume compatibility', to: '/ats-checker', icon: Target, color: '#FF6B47' },
    { label: 'JD Tailoring', desc: 'Match resume to job description', to: '/jd-tailor', icon: PenLine, color: '#4F8EF7' },
    { label: 'Job Search', desc: 'Curated job matches for you', to: '/jobs', icon: Search, color: '#0D6B4F' },
  ];

  const isAppPage = ['/dashboard', '/builder'].some(p => location.pathname.startsWith(p));
  const isToolsPage = ['/ats-checker', '/jd-tailor', '/jobs'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="InterviewKnockout"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to={user ? '/builder' : '/'} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
              Resume Builder
            </Link>

            {/* AI Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors ${isToolsPage ? 'text-[#0F3D2E]' : 'text-slate-700 hover:text-[#0F3D2E]'}`}
              >
                AI Tools <ChevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  {tools.map(({ label, desc, to, icon: Icon, color }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{label}</div>
                        <div className="text-xs text-slate-500">{desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
              Pricing
            </Link>
            <a href="/#features" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
              Features
            </a>
          </div>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-[10px] font-bold uppercase">
                        {user.plan} Plan
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2.5 text-sm font-bold bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full shadow-sm hover:shadow-md transition-all">
                  Build Your Resume
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to={user ? '/builder' : '/'} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">Resume Builder</Link>
            <div className="px-3 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Tools</div>
            {tools.map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">
                <Icon className="w-4 h-4" style={{ color }} /> {label}
              </Link>
            ))}
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">Pricing</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="w-full text-left block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg bg-[#FF6B47] text-white text-center text-sm font-bold">Build Your Resume</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
