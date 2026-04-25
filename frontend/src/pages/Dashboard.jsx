import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { resumeApi } from '../lib/api';
import { mockTemplates } from '../mock';
import { Plus, FileText, Target, Briefcase, Search, Sparkles, Clock, Download, Copy, Trash2, Zap, Loader2 } from 'lucide-react';

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
      navigate(`/builder/${r.id}`);
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
                          <Link to={`/builder/${r.id}`} className="flex-1 text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors">Edit</Link>
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
                {mockTemplates.map((t, i) => {
                  const personas = [
                    {
                      name: 'SARAH JOHNSON', title: 'Sr. Product Engineer', years: '9+ YRS',
                      contact: 'sarah.j@email.com · (415) 555-0102 · San Francisco, CA',
                      summary: 'Senior Product Engineer with 9+ years scaling consumer products from 0→10M users at Google, Meta & Stripe. Expert in distributed systems and leading cross-functional teams of 8–12 engineers.',
                      exp: [
                        { role: 'Senior Engineer · Google', period: '2022—Now', bullets: ['Led TPU migration of Search ranking pipeline, saving $4.2M/yr in infra costs', 'Mentored 8 engineers; promoted 3 to senior within 18 months', 'Shipped personalization system serving 2B queries/day at p99 < 50ms', 'Reduced on-call incidents by 40% via automated runbook tooling'] },
                        { role: 'Software Engineer · Meta', period: '2019—22', bullets: ['Built News Feed ranking reaching 800M DAU; +12% engagement', 'Owned A/B testing infra; cut experiment setup time 70%', 'Migrated legacy PHP service to Golang; latency improved 3×'] },
                        { role: 'Software Engineer · Stripe', period: '2016—19', bullets: ['Shipped dispute automation saving merchants $85M/yr', 'Built fraud detection model with 94% precision at 1M txns/day'] },
                      ],
                      projects: [
                        { name: 'Distributed Cache Layer', desc: 'Designed Redis-based caching across 12 microservices; cut DB load 60%, p99 latency 320ms→45ms. Adopted by 4 other teams within 2 quarters.' },
                        { name: 'Real-time Event Pipeline', desc: 'Built Kafka + Flink streaming pipeline processing 50M events/day enabling personalisation for 800M users. Reduced data staleness from 15min to under 3 seconds.' },
                        { name: 'Internal Dev Platform', desc: 'Created self-serve deployment portal used by 200+ engineers; reduced mean time to deploy from 45 min to 8 min. Won Google internal hackathon 2023.' },
                      ],
                      skills: 'Python · Go · TypeScript · React · Next.js · PostgreSQL · Kafka · Redis · AWS · Kubernetes · Terraform · Grafana',
                      edu: 'B.S. Computer Science · Stanford University, 2016 · GPA 3.9/4.0',
                      certs: 'AWS Solutions Architect · Kubernetes CKA · Google Cloud Professional',
                    },
                    {
                      name: 'MICHAEL CHEN', title: 'Director of Product', years: '10+ YRS',
                      contact: 'mchen@email.com · (212) 555-0134 · New York, NY',
                      summary: 'Product leader with 10+ years driving growth at Airbnb, Uber & Dropbox. Led products generating $180M+ ARR with teams of 25+ designers, engineers, and PMs. MBA from Wharton.',
                      exp: [
                        { role: 'Director of Product · Airbnb', period: '2021—Now', bullets: ['Own Hosts product line ($3.2B GMV); grew host supply 40% YoY', 'Built "Host Insights" analytics suite adopted by 2.4M hosts globally', 'Scaled team from 6 to 22 across product, design & data', 'Launched dynamic pricing feature; +$180M incremental GMV in Year 1'] },
                        { role: 'Senior PM · Uber', period: '2018—21', bullets: ['Launched Uber Reserve in 38 cities; $420M run-rate in Year 1', 'Reduced driver churn 18% via data-driven incentive redesign', 'Defined 0→1 roadmap for Uber for Business; 12K enterprise clients'] },
                        { role: 'Product Manager · Dropbox', period: '2015—18', bullets: ['Shipped Dropbox Paper to 600M users; 10M MAU in 14 months', 'Increased B2B conversion 22% via redesigned onboarding flow'] },
                      ],
                      projects: [
                        { name: 'Host Insights Dashboard', desc: 'Zero-to-one B2B analytics product for 2.4M Airbnb hosts. Became top-requested host feature within 6 months. Reduced host churn by 14% in markets where adopted.' },
                        { name: 'Uber Reserve Global Rollout', desc: 'Built city launch playbook scaled to 38 markets in 4 months. Coordinated across legal, ops, and engineering teams in 12 countries to hit $420M ARR run-rate by Year 1 end.' },
                        { name: 'Dropbox Paper Launch', desc: 'Led cross-functional team of 18 to ship collaborative doc editor to 600M users. Grew to 10M MAU in 14 months; recognised as Product Hunt #1 Product of the Day.' },
                      ],
                      skills: 'Product Strategy · Roadmapping · SQL · A/B Testing · User Research · Jira · Amplitude · Figma · OKRs · Looker · Mixpanel',
                      edu: 'MBA · The Wharton School, 2015 · B.S. Economics · UC Berkeley, 2012',
                      certs: 'Pragmatic Product Management · Reforge Growth Series',
                    },
                    {
                      name: 'PRIYA PATEL', title: 'Lead UX Designer', years: '8+ YRS',
                      contact: 'ppatel@email.com · (310) 555-0189 · Los Angeles, CA',
                      summary: 'Lead UX Designer with 8+ years shaping digital products used by 500M+ people. Design systems expert spanning Spotify, Uber, and Airbnb. RGD-certified & DBR Design Award winner 2023.',
                      exp: [
                        { role: 'Lead Designer · Spotify', period: '2022—Now', bullets: ['Redesigned checkout flow: +22% conversion, $68M incremental ARR', 'Built Encore Design System used by 180+ designers across 40 products', 'Led WCAG 2.2 AA accessibility audit across all mobile surfaces', 'Managed 5-person design team; introduced weekly design critique culture'] },
                        { role: 'Senior Designer · Uber', period: '2019—22', bullets: ['Owned Rider onboarding in 65+ markets; cut drop-off rate 31%', 'Prototyped safety features shipped to 130M+ monthly active users', 'Ran 14 usability studies; translated findings into 3 product pivots'] },
                        { role: 'Product Designer · Airbnb', period: '2016—19', bullets: ['Designed Experiences launch product; grew bookings 4× in 18 months', 'Created host photography guidelines adopted in 22 countries'] },
                      ],
                      projects: [
                        { name: 'Encore Design System', desc: 'Built Spotify\'s unified design system from scratch — tokens, components, patterns. Adopted by 180+ designers across 40 products, saving an estimated 1,200 design-hours per quarter.' },
                        { name: 'Rider Safety UX Overhaul', desc: 'End-to-end safety UX redesign at Uber shipped to 130M+ MAU globally. Reduced safety-incident reports by 22% and increased SOS feature discoverability by 3.4×.' },
                        { name: 'Airbnb Experiences Launch', desc: 'Designed the 0→1 UX for Airbnb Experiences across iOS, Android and web. Product grew bookings 4× in 18 months and expanded to 1,000+ cities worldwide.' },
                      ],
                      skills: 'Figma · Sketch · Framer · Adobe XD · Principle · Prototyping · User Research · Design Systems · HTML/CSS · Storybook',
                      edu: 'BFA Graphic Design · Rhode Island School of Design, 2016',
                      certs: 'NN/g UX Certification · IDEO Design Thinking · Google UX Certificate',
                    },
                    {
                      name: 'ALEX RIVERA', title: 'Sr. Data Scientist', years: '7+ YRS',
                      contact: 'arivera@email.com · (206) 555-0127 · Seattle, WA',
                      summary: 'Senior Data Scientist with 7+ years building ML systems at Netflix & Lyft. PhD in Statistics from MIT. Built recommendation engines serving 230M users. Published 6 papers at NeurIPS & ICML.',
                      exp: [
                        { role: 'Sr. Data Scientist · Netflix', period: '2021—Now', bullets: ['Owned Top-10 Rows recommender: +14% watch time for 230M subscribers', 'Shipped causal inference framework adopted across 40+ experiments/yr', 'Led ML infra migration to Ray; training time cut from 16h → 2h', 'Mentored 4 junior scientists; 2 promoted to senior within 18 months'] },
                        { role: 'Data Scientist · Lyft', period: '2018—21', bullets: ['Built ETA model: 18% more accurate; $31M driver-partner savings/yr', 'Launched surge-pricing optimisation lifting GM by $46M annually', 'Designed driver-acceptance model reducing no-shows by 11%'] },
                        { role: 'ML Engineer · Zillow', period: '2016—18', bullets: ['Productionised Zestimate v3: median error 4.5%→2.1% in 14 months', 'Built MLOps pipeline cutting model deployment from 3 weeks to 2 days'] },
                      ],
                      projects: [
                        { name: 'Top-10 Rows Recommender (Netflix)', desc: 'Deep-learning recommendation model serving 230M subscribers globally. Achieved +14% watch time — estimated $200M+ annual revenue impact. Model runs 4B daily inferences with <80ms latency.' },
                        { name: 'Causal Inference Toolkit', desc: 'Open-sourced internal experimentation framework; adopted by 12+ Netflix teams running 40+ causal studies/year. Reduced analyst setup time from 2 weeks to 3 days per study.' },
                        { name: 'Lyft ETA Model v2', desc: 'Rebuilt ETA prediction from gradient boosting to deep neural network. 18% accuracy improvement = $31M in annual driver-partner earnings recovered. Deployed in 650+ cities across US and Canada.' },
                      ],
                      skills: 'Python · PyTorch · TensorFlow · Scikit-learn · Ray · Spark · SQL · Snowflake · Airflow · Kubeflow · dbt · Databricks',
                      edu: 'Ph.D. Statistics · MIT, 2016 · B.S. Mathematics · Caltech, 2011',
                      certs: 'NeurIPS 2023 Best Paper Award · Kaggle Grandmaster (Top 0.1%)',
                    },
                  ];
                  const p = personas[i % 4];
                  return (
                    <Link key={t.id} to="/builder" className="group">
                      <div className="aspect-[0.77] bg-white rounded-xl shadow border border-slate-100 p-2.5 hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden">
                        <div className="pb-1.5 mb-1.5 border-b-2" style={{ borderColor: t.color }}>
                          <div className="font-extrabold text-[7px] text-slate-900 tracking-wide">{p.name}</div>
                          <div className="text-[4px] font-bold mt-0.5" style={{ color: t.color }}>{p.title.toUpperCase()} · {p.years}</div>
                          <div className="text-slate-500 text-[3.5px] mt-0.5">{p.contact}</div>
                        </div>
                        <div className="text-[5px] font-extrabold mb-0.5" style={{ color: t.color }}>SUMMARY</div>
                        <div className="text-[3.5px] text-slate-600 leading-[1.35] mb-1.5">{p.summary}</div>
                        <div className="text-[5px] font-extrabold mb-0.5" style={{ color: t.color }}>EXPERIENCE</div>
                        {p.exp.map((e, j) => (
                          <div key={j} className="mb-1">
                            <div className="flex justify-between items-baseline">
                              <div className="font-bold text-[3.8px] text-slate-900">{e.role}</div>
                              <div className="text-[3.2px] text-slate-500">{e.period}</div>
                            </div>
                            {e.bullets.map((b, k) => (
                              <div key={k} className="text-[3.4px] text-slate-600 leading-[1.3]">• {b}</div>
                            ))}
                          </div>
                        ))}
                        <div className="text-[5px] font-extrabold mb-0.5 mt-1" style={{ color: t.color }}>KEY PROJECTS</div>
                        {p.projects.map((pr, j) => (
                          <div key={j} className="mb-1">
                            <div className="font-bold text-[3.8px] text-slate-900">{pr.name}</div>
                            <div className="text-[3.4px] text-slate-600 leading-[1.3]">{pr.desc}</div>
                          </div>
                        ))}
                        <div className="text-[5px] font-extrabold mb-0.5 mt-1" style={{ color: t.color }}>SKILLS</div>
                        <div className="text-[3.5px] text-slate-600 leading-[1.3] mb-1">{p.skills}</div>
                        <div className="text-[5px] font-extrabold mb-0.5" style={{ color: t.color }}>EDUCATION</div>
                        <div className="text-[3.5px] text-slate-600 leading-[1.3] mb-1">{p.edu}</div>
                        <div className="text-[5px] font-extrabold mb-0.5" style={{ color: t.color }}>CERTIFICATIONS</div>
                        <div className="text-[3.5px] text-slate-600 leading-[1.3]">{p.certs}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{t.tag}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
