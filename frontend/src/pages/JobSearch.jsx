import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { mockJobs } from '../mock';
import { MapPin, Briefcase, Clock, DollarSign, TrendingUp, Home, Star, Download, ArrowRight, LayoutGrid, List, Search, Check } from 'lucide-react';

const siteCfg = {
  linkedin: { color: '#0A66C2', label: 'LinkedIn', short: 'in', bg: '#E8F0FB' },
  naukri: { color: '#2867B2', label: 'Naukri', short: 'N', bg: '#E8EEF8' },
  indeed: { color: '#2164F3', label: 'Indeed', short: 'IN', bg: '#E8EFFE' },
  google: { color: '#EA4335', label: 'Google', short: 'G', bg: '#FDE8E8' },
};

const priorityCfg = {
  EXCELLENT: { color: '#0D6B4F', bg: '#E8F5F0', border: '#BBE8D8' },
  GOOD: { color: '#4F8EF7', bg: '#EFF6FF', border: '#BFDBFE' },
  FAIR: { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  LOW: { color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' },
};

const StarRating = ({ rating }) => (
  <div className="inline-flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
    ))}
    <span className="text-xs font-bold text-slate-600 ml-1">{rating}</span>
  </div>
);

const SourceBadge = ({ site }) => {
  const cfg = siteCfg[site] || { color: '#64748B', label: site, short: '?', bg: '#F1F5F9' };
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <div className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: cfg.color }}>{cfg.short}</div>
      via {cfg.label}
    </div>
  );
};

const JobSearch = () => {
  const [siteFilter, setSiteFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const sites = ['all', 'linkedin', 'naukri', 'indeed', 'google'];
  const filtered = mockJobs.filter(j => {
    const matchesSite = siteFilter === 'all' || j.site === siteFilter;
    const matchesSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const counts = { all: mockJobs.length };
  sites.forEach(s => { if (s !== 'all') counts[s] = mockJobs.filter(j => j.site === s).length; });

  const excellent = mockJobs.filter(j => j.priority === 'EXCELLENT').length;
  const good = mockJobs.filter(j => j.priority === 'GOOD').length;
  const fair = mockJobs.filter(j => j.priority === 'FAIR').length;

  const toggleSave = (id) => {
    const s = new Set(savedJobs);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSavedJobs(s);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-3">
              <Check className="w-3.5 h-3.5" /> JobSpy — Free · No API Key
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Job Matches — Nithin Chakka</h1>
            <p className="text-slate-600 mt-1">{mockJobs.length} jobs · AI Engineer · India · Last 7 days</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Excel
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            [excellent, 'Excellent Match', '#0D6B4F', '#E8F5F0'],
            [good, 'Good Match', '#4F8EF7', '#EFF6FF'],
            [fair, 'Fair Match', '#F59E0B', '#FFFBEB'],
            [mockJobs.length, 'Total Jobs', '#0F3D2E', '#F1F5F9'],
          ].map(([v, l, c, bg]) => (
            <div key={l} className="bg-white rounded-2xl p-4 border border-slate-100" style={{ borderLeftWidth: 4, borderLeftColor: c }}>
              <div className="text-3xl font-extrabold" style={{ color: c }}>{v}</div>
              <div className="text-xs font-semibold text-slate-600">{l}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title or company..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B47] focus:ring-2 focus:ring-[#FF6B47]/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">SOURCE:</span>
              {sites.map(s => {
                const cfg = s === 'all' ? { color: '#0F3D2E', label: 'All' } : siteCfg[s];
                const active = siteFilter === s;
                return (
                  <button key={s} onClick={() => setSiteFilter(s)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all`} style={{ borderColor: active ? cfg.color : '#E2E8F0', background: active ? cfg.color + '15' : 'white', color: active ? cfg.color : '#64748B' }}>
                    {s !== 'all' && (
                      <div className="w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-extrabold text-white" style={{ background: siteCfg[s].color }}>{siteCfg[s].short}</div>
                    )}
                    {cfg.label}
                    <span className="ml-0.5 px-1.5 py-0 rounded-full bg-white/50 text-[10px]">{counts[s]}</span>
                  </button>
                );
              })}
              <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-2">
                {[['cards', LayoutGrid], ['table', List]].map(([m, Icon]) => (
                  <button key={m} onClick={() => setViewMode(m)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${viewMode === m ? 'bg-[#FFF3EE] border-[#FF6B47] text-[#FF6B47]' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs */}
        {viewMode === 'cards' ? (
          <div className="space-y-3">
            {filtered.map((job, idx) => {
              const cfg = priorityCfg[job.priority];
              const exp = expanded === job.id;
              const saved = savedJobs.has(job.id);
              return (
                <div key={job.id} onClick={() => setExpanded(exp ? null : job.id)} className="bg-white rounded-2xl border border-slate-100 cursor-pointer transition-all hover:shadow-md" style={{ borderLeft: `4px solid ${cfg.color}` }}>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: cfg.bg, color: cfg.color }}>{job.priority}</span>
                          {job.is_remote && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[10px] font-bold uppercase">
                              <Home className="w-3 h-3" /> Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="font-bold text-slate-800">{job.company}</div>
                          <StarRating rating={job.company_rating} />
                          <SourceBadge site={job.site} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 mb-3">
                          <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</div>
                          <div className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.job_type}</div>
                          <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.date_posted}</div>
                          <div className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-slate-400" /> {job.experience_range}</div>
                          <div className="flex items-center gap-1 font-bold text-[#0D6B4F]"><DollarSign className="w-3.5 h-3.5" /> ₹{job.min_amount}-{job.max_amount} {job.currency}</div>
                        </div>
                        <div className="flex items-center flex-wrap gap-1.5">
                          {job.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">{s}</span>
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1">✓ matched</span>
                        </div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-3xl font-black" style={{ color: cfg.color }}>{job.score}%</div>
                        <div className="text-[10px] font-bold" style={{ color: cfg.color }}>MATCH</div>
                      </div>
                    </div>
                    {exp && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">{job.description}</p>
                        <div className="flex items-center gap-2">
                          <a href={job.job_url} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90" style={{ background: siteCfg[job.site]?.color }}>
                            Apply on {siteCfg[job.site]?.label} <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                          <button onClick={e => { e.stopPropagation(); toggleSave(job.id); }} className={`px-4 py-2 rounded-lg border text-sm font-bold transition ${saved ? 'bg-[#FFF3EE] border-[#FF6B47] text-[#FF6B47]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                            {saved ? '★ Saved' : '☆ Save'}
                          </button>
                          <button onClick={e => e.stopPropagation()} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50">
                            Tailor Resume
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {['#', 'Match', 'Source', 'Title', 'Company', 'Rating', 'Salary', 'Location', 'Posted'].map(h => (
                    <th key={h} className="text-left p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => {
                  const cfg = priorityCfg[job.priority];
                  return (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="p-3 text-sm text-slate-500 font-semibold">{i + 1}</td>
                      <td className="p-3">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>{job.score}%</div>
                      </td>
                      <td className="p-3"><SourceBadge site={job.site} /></td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                        <div className="text-[10px] font-bold mt-0.5" style={{ color: cfg.color }}>{job.priority}</div>
                      </td>
                      <td className="p-3 text-sm font-semibold text-slate-700">{job.company}</td>
                      <td className="p-3"><StarRating rating={job.company_rating} /></td>
                      <td className="p-3 text-sm font-bold text-[#0D6B4F]">₹{job.min_amount}-{job.max_amount}</td>
                      <td className="p-3 text-xs text-slate-600">{job.location}</td>
                      <td className="p-3 text-xs text-slate-500">{job.date_posted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">{filtered.length}</span> jobs
            {siteFilter !== 'all' && <span> from <span className="font-bold">{siteCfg[siteFilter]?.label}</span></span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold">Sources:</span>
            {Object.entries(siteCfg).map(([key, cfg]) => (
              <div key={key} className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: cfg.color }} title={cfg.label}>{cfg.short}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
