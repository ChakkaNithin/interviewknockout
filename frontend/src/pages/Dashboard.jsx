import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { resumeApi } from '../lib/api';
import { mockTemplates } from '../mock';
import { Plus, FileText, Target, Briefcase, Search, Sparkles, TrendingUp, Clock, Download, Copy, Trash2, MoreVertical, Zap, Award, Check, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumes');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await resumeApi.list();
        setResumes(data);
      } catch (e) {
        console.error('Failed to load resumes', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tools = [
    { name: 'ATS Checker', path: '/ats-checker', icon: Target, color: '#0D6B4F', bg: '#E8F5F0', desc: 'Score your resume against ATS systems' },
    { name: 'JD Tailor', path: '/jd-tailor', icon: Briefcase, color: '#FF6B47', bg: '#FFF3EE', desc: 'Tailor resume to any job description' },
    { name: 'Job Search', path: '/jobs', icon: Search, color: '#4F8EF7', bg: '#EFF6FF', desc: 'Find jobs matched to your profile' },
    { name: 'AI Builder', path: '/builder', icon: Sparkles, color: '#7C3AED', bg: '#F3E8FF', desc: 'Build resume with AI assistance' },
  ];

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumeApi.delete(id);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const duplicateResume = async (id) => {
    const original = resumes.find(r => r.id === id);
    if (!original) return;
    try {
      const copy = await resumeApi.create({
        title: original.title + ' (Copy)',
        template: original.template,
        target_role: original.target_role || '',
        data: original.data,
      });
      setResumes([copy, ...resumes]);
    } catch (e) {
      alert('Failed to duplicate');
    }
  };

  const createNew = async () => {
    try {
      const r = await resumeApi.create({
        title: 'Untitled Resume',
        template: 'double-column',
        target_role: '',
        data: {},
      });
      navigate('/builder');
    } catch (e) {
      navigate('/builder');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-slate-600 mt-1">Let's land your next interview. Pick up where you left off.</p>
          </div>
          <Link to="/builder" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg shadow-[#FF6B47]/20 transition-all">
            <Plus className="w-4 h-4" /> New Resume
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Resumes', value: resumes.length, icon: FileText, color: '#0F3D2E', bg: '#E8F5F0' },
            { label: 'Avg ATS Score', value: resumes.length ? Math.round(resumes.reduce((a,r) => a+(r.ats_score||0),0)/resumes.length) : 0, icon: Target, color: '#FF6B47', bg: '#FFF3EE', suffix: '%' },
            { label: 'Applications', value: 23, icon: Briefcase, color: '#4F8EF7', bg: '#EFF6FF' },
            { label: 'Interviews', value: 4, icon: Award, color: '#7C3AED', bg: '#F3E8FF' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-slate-600">{s.label}</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{s.value}{s.suffix || ''}</div>
            </div>
          ))}
        </div>

        {/* Quick tools */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FF6B47]" /> Quick Tools
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map(t => (
              <Link key={t.path} to={t.path} className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: t.bg }}>
                  <t.icon className="w-5 h-5" style={{ color: t.color }} strokeWidth={2} />
                </div>
                <div className="font-bold text-slate-900 mb-1">{t.name}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center border-b border-slate-100 px-5">
            {['resumes', 'templates'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-4 text-sm font-bold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-[#FF6B47] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {tab === 'resumes' ? 'My Resumes' : 'Templates'}
              </button>
            ))}
          </div>
          <div className="p-5">
            {activeTab === 'resumes' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Create new card */}
                <Link to="/builder" className="flex flex-col items-center justify-center min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#FF6B47] hover:bg-[#FFF3EE]/30 transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-[#FF6B47] flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="font-bold text-slate-700 group-hover:text-[#FF6B47] transition-colors">Create New Resume</div>
                  <div className="text-xs text-slate-500 mt-1">Start from scratch or AI</div>
                </Link>
                {resumes.map(r => {
                  const tpl = mockTemplates.find(t => t.id === r.template) || mockTemplates[0];
                  const score = r.ats_score || 0;
                  const scoreColor = score >= 80 ? '#0D6B4F' : score >= 60 ? '#4F8EF7' : '#F59E0B';
                  const lastEdited = r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'just now';
                  return (
                    <div key={r.id} className="bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden">
                      <div className="relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center">
                        <div className="w-32 bg-white rounded shadow aspect-[0.77] p-2">
                          <div className="h-1.5 rounded mb-1" style={{ background: tpl.color }}></div>
                          <div className="h-1 bg-slate-300 rounded mb-2 w-3/4"></div>
                          <div className="space-y-0.5">{[1,2,3,4].map(i => <div key={i} className="h-0.5 bg-slate-200 rounded" style={{width: `${90 - i*8}%`}}></div>)}</div>
                          <div className="mt-2 h-1 rounded w-1/3" style={{ background: tpl.color }}></div>
                          <div className="space-y-0.5 mt-1">{[1,2,3].map(i => <div key={i} className="h-0.5 bg-slate-200 rounded" style={{width: `${85 - i*5}%`}}></div>)}</div>
                        </div>
                        {score > 0 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow">
                            <div className="w-2 h-2 rounded-full" style={{ background: scoreColor }}></div>
                            <span className="text-xs font-bold" style={{ color: scoreColor }}>{score}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-slate-900 mb-1 truncate">{r.title}</div>
                        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {lastEdited}{r.target_role ? ` · ${r.target_role}` : ''}</div>
                        <div className="flex items-center gap-2">
                          <Link to="/builder" className="flex-1 text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors">Edit</Link>
                          <button onClick={() => duplicateResume(r.id)} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" title="Duplicate"><Copy className="w-4 h-4" /></button>
                          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" title="Download"><Download className="w-4 h-4" /></button>
                          <button onClick={() => deleteResume(r.id)} className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockTemplates.map((t, i) => (
                  <Link key={t.id} to="/builder" className="group">
                    <div className="aspect-[0.77] bg-white rounded-xl shadow border border-slate-100 p-3 hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden">
                      <div className="h-4 rounded mb-2 flex items-center px-1.5" style={{ background: t.color }}>
                        <div className="text-[6px] text-white font-bold">SARAH JOHNSON</div>
                      </div>
                      <div className="text-[5px] font-bold mb-1.5" style={{ color: t.color }}>SENIOR ENGINEER · 8 YEARS</div>
                      <div className="text-[5px] font-bold mb-0.5" style={{ color: t.color }}>EXPERIENCE</div>
                      <div className="text-[4px] text-slate-700 leading-tight mb-0.5 font-semibold">Senior Engineer · Google</div>
                      <div className="text-[4px] text-slate-500 mb-1">• Built microservices for 10M+ users</div>
                      <div className="text-[4px] text-slate-500 mb-1">• Reduced latency by 40% via caching</div>
                      <div className="text-[4px] text-slate-700 leading-tight mb-0.5 font-semibold">Software Engineer · Meta</div>
                      <div className="text-[4px] text-slate-500 mb-1">• Led team of 8 engineers on ML</div>
                      <div className="text-[4px] text-slate-500 mb-2">• Shipped real-time ranking system</div>
                      <div className="text-[5px] font-bold mb-0.5" style={{ color: t.color }}>SKILLS</div>
                      <div className="text-[4px] text-slate-700 leading-tight">Python · React · AWS · TypeScript · Docker · PostgreSQL</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{t.tag}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
