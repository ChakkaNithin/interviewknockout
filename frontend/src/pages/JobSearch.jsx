import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { mockJobs } from '../mock';
import { jobsApi } from '../lib/api';
import { MapPin, Briefcase, Clock, DollarSign, TrendingUp, Home, Star, Download, ArrowRight, LayoutGrid, List, Search, Check, Loader2, User, Edit3, Mail, Filter, Globe, Calendar, Zap, Users, Plus, X, ChevronDown, Settings } from 'lucide-react';

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

const DEFAULT_PROFILE = {
  name: 'Your Name',
  email: 'you@example.com',
  yearsExperience: 2,
  seniorityLevel: 'Mid Level',
  currentTitle: 'Software Engineer',
  targetJobTitles: ['Software Engineer', 'Full Stack Developer'],
  skills: ['Python', 'JavaScript', 'React', 'FastAPI', 'SQL'],
  technologies: ['Python', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  preferredLocation: 'Unknown',
  remotePreference: 'Unknown',
};

const DEFAULT_FILTERS = {
  specificLocations: [],
  country: 'India',
  postedWithin: 'Last 7 days',
  customDays: 7,
  remote: 'any',
  easyApply: 'any',
  reportsToRole: 'any',
};

const POSTED_OPTIONS = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 12 months', 'Last 2 years'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore'];

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

const TagPill = ({ children, onRemove, color = '#4F8EF7' }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: color + '15', color: color, border: `1px solid ${color}30` }}>
    {children}
    {onRemove && (
      <button onClick={onRemove} className="hover:opacity-60">
        <X className="w-3 h-3" />
      </button>
    )}
  </span>
);

const ProfileField = ({ icon: Icon, label, value, editing, onChange, type = 'text' }) => (
  <div>
    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
      {Icon && <Icon className="w-3.5 h-3.5" />}{label}
    </div>
    {editing ? (
      <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
    ) : (
      <div className="text-sm font-semibold text-slate-900">{value || <span className="text-slate-400">Not set</span>}</div>
    )}
  </div>
);

const TagEditor = ({ tags, onChange, placeholder, color }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) {
      onChange([...tags, v]);
      setInput('');
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(t => (
          <TagPill key={t} color={color} onRemove={() => onChange(tags.filter(x => x !== t))}>{t}</TagPill>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={placeholder} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
        <button onClick={add} className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"><Plus className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const Accordion = ({ title, icon: Icon, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          {Icon && <Icon className="w-4 h-4 text-slate-500" />} {title}
          {badge && <span className="px-2 py-0.5 rounded-full bg-[#4F8EF7] text-white text-[10px] font-bold uppercase">{badge}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const JobSearch = () => {
  const [activeMainTab, setActiveMainTab] = useState('configure');
  const [profileEditing, setProfileEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem('covera_profile');
      return s ? JSON.parse(s) : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [locationInput, setLocationInput] = useState('');

  const [siteFilter, setSiteFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState(mockJobs);
  const [isDemoData, setIsDemoData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('covera_profile', JSON.stringify(profile));
  }, [profile]);

  const saveProfile = () => setProfileEditing(false);

  const hoursFromPosted = () => {
    const m = { 'Last 24 hours': 24, 'Last 7 days': 168, 'Last 30 days': 720, 'Last 3 months': 2160, 'Last 12 months': 8760, 'Last 2 years': 17520 };
    return m[filters.postedWithin] || 168;
  };

  const runSearch = async () => {
    const searchTerm = profile.targetJobTitles[0] || profile.currentTitle || 'Software Engineer';
    const loc = filters.specificLocations[0] || filters.country;
    setLoading(true);
    setError('');
    try {
      const resp = await jobsApi.search({
        search_term: searchTerm,
        location: loc,
        sites: ['linkedin', 'indeed', 'naukri', 'google'],
        hours_old: hoursFromPosted(),
        is_remote: filters.remote === 'yes' ? true : filters.remote === 'no' ? false : null,
        results_per_site: 10,
        use_serpapi: true,
        resume_skills: profile.skills,
      });
      if (resp.jobs && resp.jobs.length > 0) {
        setJobs(resp.jobs);
        setIsDemoData(false);
        setActiveMainTab('matches');
      } else {
        setError('No jobs found. Showing demo results.');
        setJobs(mockJobs);
        setIsDemoData(true);
        setActiveMainTab('matches');
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Search failed. Showing demo results.');
      setJobs(mockJobs);
      setIsDemoData(true);
      setActiveMainTab('matches');
    } finally {
      setLoading(false);
    }
  };

  const sites = ['all', 'linkedin', 'naukri', 'indeed', 'google'];
  const filtered = jobs.filter(j => {
    const matchesSite = siteFilter === 'all' || j.site === siteFilter;
    const matchesSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSite && matchesSearch;
  });
  const counts = { all: jobs.length };
  sites.forEach(s => { if (s !== 'all') counts[s] = jobs.filter(j => j.site === s).length; });
  const excellent = jobs.filter(j => j.priority === 'EXCELLENT').length;
  const good = jobs.filter(j => j.priority === 'GOOD').length;
  const fair = jobs.filter(j => j.priority === 'FAIR').length;

  const toggleSave = (id) => {
    const s = new Set(savedJobs);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSavedJobs(s);
  };

  const addLocation = () => {
    const v = locationInput.trim();
    if (v && !filters.specificLocations.includes(v)) {
      setFilters({ ...filters, specificLocations: [...filters.specificLocations, v] });
      setLocationInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6B47]/20 blur-3xl"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">AI-Powered Job Search</h1>
              <p className="text-white/80 mt-1 text-sm">Configure your profile & filters, then let JobSpy + SerpApi find your perfect match.</p>
            </div>
            <button onClick={runSearch} disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B47] hover:bg-[#ff5630] disabled:opacity-60 text-white rounded-full font-bold shadow-lg transition-all">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching Live Jobs...</> : <><Search className="w-4 h-4" /> Search Jobs Now</>}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-slate-100 border-b-0 px-5 flex items-center gap-6">
          {[
            { id: 'configure', label: 'Configure', icon: Settings, badge: 1 },
            { id: 'matches', label: 'Job Matches', icon: Briefcase, badge: jobs.length },
          ].map(t => {
            const active = activeMainTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveMainTab(t.id)} className={`py-4 px-1 relative flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${active ? 'border-[#FF6B47] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${active ? 'bg-[#FF6B47] text-white' : 'bg-slate-100 text-slate-600'}`}>{t.badge}</span>
              </button>
            );
          })}
        </div>

        {activeMainTab === 'configure' && (
          <div className="bg-white rounded-b-2xl border border-slate-100 p-6 grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Candidate Profile */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#4F8EF7]" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Candidate Profile</h2>
                </div>
                {profileEditing ? (
                  <button onClick={saveProfile} className="px-4 py-2 bg-[#0D6B4F] hover:bg-[#0a5a42] text-white rounded-lg text-sm font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                ) : (
                  <button onClick={() => setProfileEditing(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5 mb-6">
                <ProfileField icon={User} label="Candidate Name" value={profile.name} editing={profileEditing} onChange={(v) => setProfile({ ...profile, name: v })} />
                <ProfileField icon={Mail} label="Email" value={profile.email} editing={profileEditing} onChange={(v) => setProfile({ ...profile, email: v })} />
                <ProfileField icon={Briefcase} label="Years of Experience" value={profile.yearsExperience} editing={profileEditing} onChange={(v) => setProfile({ ...profile, yearsExperience: v })} type="number" />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Seniority Level
                  </div>
                  {profileEditing ? (
                    <select value={profile.seniorityLevel} onChange={(e) => setProfile({ ...profile, seniorityLevel: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]">
                      {['Entry Level', 'Mid Level', 'Senior Level', 'Staff', 'Principal', 'Director', 'Executive'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  ) : (
                    <div className="text-sm font-semibold text-slate-900">{profile.seniorityLevel}</div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <ProfileField label="Current Title" value={profile.currentTitle} editing={profileEditing} onChange={(v) => setProfile({ ...profile, currentTitle: v })} />
              </div>

              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Job Titles</div>
                {profileEditing ? (
                  <TagEditor tags={profile.targetJobTitles} onChange={(v) => setProfile({ ...profile, targetJobTitles: v })} placeholder="Add a job title..." color="#4F8EF7" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.targetJobTitles.length ? profile.targetJobTitles.map(t => <TagPill key={t} color="#4F8EF7">{t}</TagPill>) : <span className="text-sm text-slate-400">No target titles set</span>}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills</div>
                {profileEditing ? (
                  <TagEditor tags={profile.skills} onChange={(v) => setProfile({ ...profile, skills: v })} placeholder="Add a skill..." color="#0D6B4F" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length ? profile.skills.map(s => <TagPill key={s} color="#0D6B4F">{s}</TagPill>) : <span className="text-sm text-slate-400">No skills set</span>}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies</div>
                {profileEditing ? (
                  <TagEditor tags={profile.technologies} onChange={(v) => setProfile({ ...profile, technologies: v })} placeholder="Add a technology..." color="#7C3AED" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.technologies.length ? profile.technologies.map(s => <TagPill key={s} color="#7C3AED">{s}</TagPill>) : <span className="text-sm text-slate-400">No technologies set</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <ProfileField icon={MapPin} label="Preferred Location" value={profile.preferredLocation} editing={profileEditing} onChange={(v) => setProfile({ ...profile, preferredLocation: v })} />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Home className="w-3.5 h-3.5" /> Remote Preference
                  </div>
                  {profileEditing ? (
                    <select value={profile.remotePreference} onChange={(e) => setProfile({ ...profile, remotePreference: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]">
                      {['Unknown', 'Remote Only', 'Hybrid', 'On-site', 'Flexible'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  ) : (
                    <div className="text-sm font-semibold text-slate-900">{profile.remotePreference}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Filters */}
            <div className="bg-slate-50 rounded-2xl p-5 h-fit lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#FF6B47]" />
                <h2 className="text-lg font-extrabold text-slate-900">Search Filters</h2>
              </div>

              <Accordion title="Specific Locations" icon={Globe}>
                <div className="flex gap-2 mb-3">
                  <input value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())} placeholder="Search cities, countries..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#FF6B47]" />
                  <button onClick={addLocation} className="w-9 h-9 rounded-lg bg-[#4F8EF7] text-white flex items-center justify-center hover:bg-[#3b7be0]"><Search className="w-4 h-4" /></button>
                </div>
                <div className="text-[11px] text-slate-500 mb-2">Search for specific cities, states, or regions</div>
                <div className="flex flex-wrap gap-1.5">
                  {filters.specificLocations.map(l => (
                    <TagPill key={l} color="#4F8EF7" onRemove={() => setFilters({ ...filters, specificLocations: filters.specificLocations.filter(x => x !== l) })}>{l}</TagPill>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Country" icon={MapPin} badge={filters.country ? filters.country.substring(0,2).toUpperCase() : null}>
                <div className="text-xs text-slate-500 mb-2">Selected:</div>
                <div className="mb-2">
                  <TagPill color="#4F8EF7" onRemove={() => setFilters({ ...filters, country: '' })}>{filters.country}</TagPill>
                </div>
                <div className="text-[11px] text-slate-500 mb-2">Change country:</div>
                <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#FF6B47]">
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Accordion>

              <Accordion title={`Posted Within`} icon={Calendar} defaultOpen={true}>
                <div className="space-y-1">
                  {POSTED_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => setFilters({ ...filters, postedWithin: opt })} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${filters.postedWithin === opt ? 'bg-[#4F8EF7] text-white font-bold' : 'hover:bg-white text-slate-700'}`}>
                      <span>{opt}</span>
                      {filters.postedWithin === opt && <Check className="w-4 h-4" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Remote" icon={Home}>
                <div className="grid grid-cols-3 gap-2">
                  {[['any', 'Any'], ['yes', 'Yes'], ['no', 'No']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilters({ ...filters, remote: v })} className={`py-2 rounded-lg text-sm font-bold border transition ${filters.remote === v ? 'bg-[#4F8EF7] text-white border-[#4F8EF7]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#4F8EF7]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Is Easy Apply" icon={Zap}>
                <div className="grid grid-cols-3 gap-2">
                  {[['any', 'Any'], ['yes', 'Yes'], ['no', 'No']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilters({ ...filters, easyApply: v })} className={`py-2 rounded-lg text-sm font-bold border transition ${filters.easyApply === v ? 'bg-[#4F8EF7] text-white border-[#4F8EF7]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#4F8EF7]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Includes Reports To Role" icon={Users} defaultOpen={false}>
                <div className="grid grid-cols-3 gap-2">
                  {[['any', 'Any'], ['yes', 'Yes'], ['no', 'No']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilters({ ...filters, reportsToRole: v })} className={`py-2 rounded-lg text-sm font-bold border transition ${filters.reportsToRole === v ? 'bg-[#4F8EF7] text-white border-[#4F8EF7]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#4F8EF7]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </Accordion>

              <button onClick={runSearch} disabled={loading} className="w-full mt-5 py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</> : <><Search className="w-4 h-4" /> Apply Filters & Search</>}
              </button>
              {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
            </div>
          </div>
        )}

        {activeMainTab === 'matches' && (
          <div className="bg-white rounded-b-2xl border border-slate-100 p-6">
            {/* Status */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" /> {isDemoData ? 'Demo results' : 'Live via JobSpy + SerpApi'}
                </div>
                <div className="text-sm text-slate-600 mt-1">{jobs.length} jobs · {profile.targetJobTitles[0] || 'Target role'} · {filters.country}</div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[[excellent, 'Excellent Match', '#0D6B4F', '#E8F5F0'], [good, 'Good Match', '#4F8EF7', '#EFF6FF'], [fair, 'Fair Match', '#F59E0B', '#FFFBEB'], [jobs.length, 'Total Jobs', '#0F3D2E', '#F1F5F9']].map(([v, l, c, bg]) => (
                <div key={l} className="rounded-xl p-3" style={{ background: bg, borderLeft: `3px solid ${c}` }}>
                  <div className="text-2xl font-extrabold" style={{ color: c }}>{v}</div>
                  <div className="text-xs font-semibold text-slate-600">{l}</div>
                </div>
              ))}
            </div>

            {/* Filter bar */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-5">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by title or company..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B47] focus:ring-2 focus:ring-[#FF6B47]/10" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {sites.map(s => {
                  const cfg = s === 'all' ? { color: '#0F3D2E', label: 'All' } : siteCfg[s];
                  const active = siteFilter === s;
                  return (
                    <button key={s} onClick={() => setSiteFilter(s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all" style={{ borderColor: active ? cfg.color : '#E2E8F0', background: active ? cfg.color + '15' : 'white', color: active ? cfg.color : '#64748B' }}>
                      {s !== 'all' && <div className="w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-extrabold text-white" style={{ background: siteCfg[s].color }}>{siteCfg[s].short}</div>}
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

            {/* Jobs list */}
            <div className="space-y-3">
              {filtered.map((job, idx) => {
                const cfg = priorityCfg[job.priority] || priorityCfg.GOOD;
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
                            {job.is_remote && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[10px] font-bold uppercase"><Home className="w-3 h-3" /> Remote</span>}
                          </div>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="font-bold text-slate-800">{job.company}</div>
                            <StarRating rating={job.company_rating || 4.0} />
                            <SourceBadge site={job.site} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 mb-3">
                            <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</div>
                            <div className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.job_type || 'Full-time'}</div>
                            <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.date_posted}</div>
                            {job.min_amount && <div className="flex items-center gap-1 font-bold text-[#0D6B4F]"><DollarSign className="w-3.5 h-3.5" /> {job.min_amount}-{job.max_amount} {job.currency}</div>}
                          </div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            {(job.skills || []).map(s => <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">{s}</span>)}
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <a href={job.job_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90" style={{ background: siteCfg[job.site]?.color || '#64748B' }}>
                              Apply on {siteCfg[job.site]?.label || job.site} <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                            <button onClick={e => { e.stopPropagation(); toggleSave(job.id); }} className={`px-4 py-2 rounded-lg border text-sm font-bold transition ${saved ? 'bg-[#FFF3EE] border-[#FF6B47] text-[#FF6B47]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                              {saved ? '★ Saved' : '☆ Save'}
                            </button>
                            <button onClick={e => e.stopPropagation()} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50">Tailor Resume</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!filtered.length && (
              <div className="p-12 text-center text-slate-500">
                <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                No jobs found. Adjust filters and search again.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
