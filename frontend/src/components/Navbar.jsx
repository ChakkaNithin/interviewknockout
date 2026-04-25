import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Menu, X, ChevronDown, LogOut, User, Briefcase, Target, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAppPage = ['/dashboard', '/builder', '/ats-checker', '/jd-tailor', '/jobs'].some(p => location.pathname.startsWith(p));

  const tools = [
    { name: 'ATS Checker', icon: Target, path: '/ats-checker', desc: 'Score your resume against ATS systems' },
    { name: 'JD Tailor', icon: Briefcase, path: '/jd-tailor', desc: 'Tailor your resume to any job description' },
    { name: 'Job Search', icon: Search, path: '/jobs', desc: 'Find jobs matched to your profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">InterviewKnockout</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to={user ? '/builder' : '/'} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
              Resume Builder
            </Link>
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] transition-colors">
                AI Tools <ChevronDown className="w-4 h-4" />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 pt-2 w-80">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                    {tools.map(t => (
                      <Link key={t.path} to={t.path} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-[#FFF3EE] flex items-center justify-center flex-shrink-0">
                          <t.icon className="w-5 h-5 text-[#FF6B47]" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
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
              <div className="relative">
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
            {tools.map(t => (
              <Link key={t.path} to={t.path} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">{t.name}</Link>
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
