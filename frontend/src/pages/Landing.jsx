import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockTemplates, mockStats, mockFeatures, mockTestimonials, mockPricing, mockFaqs, trustedCompanies } from '../mock';
import { ArrowRight, Star, Check, Sparkles, Target, ShieldCheck, LayoutGrid, SpellCheck, ChevronDown, FileText, Zap, Award, Users, TrendingUp } from 'lucide-react';

const iconMap = { SpellCheck, Target, LayoutGrid, ShieldCheck };

// CSS-rendered Resume Thumbnail
const ResumeThumbnail = ({ template, index }) => {
  const variant = index % 4;
  return (
    <div className="relative w-full aspect-[0.77] bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
      {variant === 0 && (
        <div className="flex h-full">
          <div className="w-1/3 p-3" style={{ background: template.color }}>
            <div className="w-10 h-10 rounded-full bg-white/30 mb-3"></div>
            <div className="h-1.5 bg-white/70 rounded mb-1.5 w-full"></div>
            <div className="h-1 bg-white/50 rounded mb-3 w-3/4"></div>
            <div className="space-y-1 mt-4">
              <div className="h-1 bg-white/40 rounded w-full"></div>
              <div className="h-1 bg-white/40 rounded w-5/6"></div>
              <div className="h-1 bg-white/40 rounded w-4/6"></div>
            </div>
          </div>
          <div className="flex-1 p-3">
            <div className="h-2 bg-slate-800 rounded mb-1 w-2/3"></div>
            <div className="h-1 bg-slate-400 rounded mb-3 w-1/2"></div>
            <div className="space-y-1.5">
              {[1,2,3,4].map(i=>(
                <div key={i}>
                  <div className="h-1 bg-slate-700 rounded w-1/2 mb-1"></div>
                  <div className="h-0.5 bg-slate-300 rounded w-full mb-0.5"></div>
                  <div className="h-0.5 bg-slate-300 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {variant === 1 && (
        <div className="p-4 h-full">
          <div className="text-center mb-3 pb-2 border-b-2" style={{ borderColor: template.color }}>
            <div className="h-2.5 bg-slate-900 rounded mb-1.5 w-1/2 mx-auto"></div>
            <div className="h-1 bg-slate-400 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="space-y-2.5">
            {[1,2,3].map(i => (
              <div key={i}>
                <div className="h-1.5 rounded w-1/4 mb-1" style={{ background: template.color }}></div>
                <div className="h-0.5 bg-slate-300 rounded w-full mb-0.5"></div>
                <div className="h-0.5 bg-slate-300 rounded w-11/12 mb-0.5"></div>
                <div className="h-0.5 bg-slate-300 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {variant === 2 && (
        <div className="p-3 h-full">
          <div className="h-8 rounded mb-3 flex items-center px-3" style={{ background: template.color }}>
            <div className="h-1.5 w-1/3 bg-white/80 rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <div className="h-1.5 rounded w-3/4" style={{ background: template.color }}></div>
              <div className="h-0.5 bg-slate-300 rounded w-full"></div>
              <div className="h-0.5 bg-slate-300 rounded w-5/6"></div>
              <div className="h-0.5 bg-slate-300 rounded w-4/6"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded w-3/4" style={{ background: template.color }}></div>
              <div className="h-0.5 bg-slate-300 rounded w-full"></div>
              <div className="h-0.5 bg-slate-300 rounded w-5/6"></div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="h-0.5 bg-slate-300 rounded w-full"></div>
            <div className="h-0.5 bg-slate-300 rounded w-11/12"></div>
            <div className="h-0.5 bg-slate-300 rounded w-10/12"></div>
          </div>
        </div>
      )}
      {variant === 3 && (
        <div className="p-4 h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full" style={{ background: template.color }}></div>
            <div className="flex-1">
              <div className="h-2 bg-slate-900 rounded w-2/3 mb-1"></div>
              <div className="h-1 bg-slate-400 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[1,2,3].map(i => (
              <div key={i} className="pl-3 border-l-2" style={{ borderColor: template.color }}>
                <div className="h-1.5 bg-slate-700 rounded w-1/2 mb-1"></div>
                <div className="h-0.5 bg-slate-300 rounded w-full mb-0.5"></div>
                <div className="h-0.5 bg-slate-300 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
        <Link to="/signup" className="px-4 py-2 bg-[#FF6B47] text-white rounded-full text-xs font-bold hover:bg-[#ff5630] flex items-center gap-1">
          Use Template <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF3EE] via-[#FFFBF7] to-white pt-16 pb-20">
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#FF6B47]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 left-0 w-96 h-96 rounded-full bg-[#0F3D2E]/5 blur-3xl pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <div className="flex -space-x-1">
                {mockTestimonials.slice(0,4).map(t => (
                  <img key={t.name} src={t.avatar} alt={t.name} className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">⭐ 4.8 · 5,187 Reviews</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-5">
              Land more interviews with <span className="relative inline-block"><span className="relative z-10">ResumeFlow's</span><span className="absolute bottom-1 left-0 w-full h-3 bg-[#FF6B47]/30 -z-0"></span></span> Resume Builder
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-7 max-w-xl">
              ATS Check, AI Writer, and One-Click Job Tailoring make your resume stand out to recruiters. Build a professional resume in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg shadow-[#FF6B47]/20 hover:shadow-xl hover:shadow-[#FF6B47]/30 transition-all">
                Build Your Resume <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/ats-checker" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-bold border-2 border-slate-200 hover:border-slate-300 transition-all">
                <Target className="w-4 h-4" /> Get Resume Score
              </Link>
            </div>
            <div className="flex items-center gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#0D6B4F]" strokeWidth={3} /> Free to start</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#0D6B4F]" strokeWidth={3} /> No credit card</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#0D6B4F]" strokeWidth={3} /> ATS ready</div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F3D2E] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">28,452 users</div>
                <div className="text-xs text-slate-500">landed interviews last month</div>
              </div>
            </div>
          </div>
          {/* Hero Visual: Resume Preview Cluster */}
          <div className="relative h-[520px]">
            <div className="absolute top-4 left-4 w-56 transform -rotate-6 z-10">
              <ResumeThumbnail template={mockTemplates[0]} index={0} />
            </div>
            <div className="absolute top-0 right-8 w-56 transform rotate-3 z-20">
              <ResumeThumbnail template={mockTemplates[4]} index={2} />
            </div>
            <div className="absolute bottom-4 left-16 w-56 transform rotate-2 z-30">
              <ResumeThumbnail template={mockTemplates[5]} index={3} />
            </div>
            <div className="absolute bottom-8 right-0 w-56 transform -rotate-3 z-20">
              <ResumeThumbnail template={mockTemplates[2]} index={1} />
            </div>
            {/* Floating Score Badge */}
            <div className="absolute top-52 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-slate-100">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90"><circle cx="28" cy="28" r="24" stroke="#E2E8F0" strokeWidth="4" fill="none"/><circle cx="28" cy="28" r="24" stroke="#0D6B4F" strokeWidth="4" fill="none" strokeDasharray={`${2*Math.PI*24}`} strokeDashoffset={`${2*Math.PI*24*(1-0.92)}`} strokeLinecap="round"/></svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900">92</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D6B4F]">ATS SCORE</div>
                <div className="text-sm font-semibold text-slate-900">Excellent Match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-10 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Our users have landed jobs at
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {trustedCompanies.map(c => (
              <div key={c} className="text-2xl font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-default">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Templates
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Pick a template and build your resume in minutes
            </h2>
            <p className="text-lg text-slate-600">
              ATS-friendly, professionally designed resumes with customizable sections, fonts, colors, and layouts.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockTemplates.slice(0,8).map((t, i) => (
              <Link key={t.id} to="/signup" className="group cursor-pointer">
                <ResumeThumbnail template={t} index={i} />
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t.tag}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold transition-colors">
              Browse All Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0F3D2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,71,0.15),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">Chosen by 10 million job applicants worldwide</h2>
            <p className="text-white/70 max-w-2xl mx-auto">ResumeFlow is a modern resume builder helping job seekers at every step with ATS-friendly templates and AI-powered tools.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockStats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-extrabold text-[#FF6B47] mb-1">{s.value}</div>
                <div className="text-sm text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Section */}
      <section className="py-20 bg-white" id="ats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> ATS Optimized
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
              Resumes optimized for Applicant Tracking Systems
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              All ResumeFlow templates are tested with top Applicant Tracking Systems (ATS) to guarantee full compatibility. Clean layouts, readable fonts, and standard section titles — nothing gets lost.
            </p>
            <ul className="space-y-3 mb-8">
              {['Readable contact information parsing', 'Full experience section parsing', 'Optimized skills section', 'Tested with Workday, Taleo, Greenhouse, Lever'].map(item => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#0D6B4F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/ats-checker" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3D2E] hover:bg-[#0b2e23] text-white rounded-full font-bold transition-colors">
              Try ATS Checker <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#E8F5F0] to-white rounded-3xl p-8 border border-slate-100 shadow-xl">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">ATS Report</div>
                    <div className="text-lg font-black text-slate-900">Your Resume</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-[#0D6B4F]">92</div>
                    <div className="text-xs font-bold text-[#0D6B4F]">EXCELLENT</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[['Keywords Match', 88, '#0D6B4F'],['ATS Parse', 95, '#0D6B4F'],['Skills Section', 90, '#0D6B4F'],['Work Experience', 85, '#4F8EF7'],['Quantifiable Impact', 78, '#4F8EF7']].map(([l,v,c]) => (
                    <div key={l}>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{l}</span><span>{v}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${v}%`, background: c }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#0F3D2E] text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" /> AI Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Fully equipped for the age of AI
            </h2>
            <p className="text-lg text-slate-600">
              The AI Resume Builder helps you create resumes faster and smarter. Start with a job title, description, or custom prompt — get high-quality text tailored to the role.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockFeatures.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <div key={f.id} className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF3EE] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#FF6B47]" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-600 mb-4">{f.description}</p>
                  <ul className="space-y-2">
                    {f.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-[#0D6B4F] flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i=>(<Star key={i} className="w-5 h-5 fill-[#FF6B47] text-[#FF6B47]" />))}</div>
              <span className="text-sm font-bold text-slate-700">4.8/5 · 5,187 Reviews</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Trusted by professionals worldwide
            </h2>
            <p className="text-lg text-slate-600">Join millions of job seekers who've built standout resumes with ResumeFlow.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockTestimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5 mb-3">{[...Array(t.rating)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-[#FF6B47] text-[#FF6B47]" />))}</div>
                <p className="text-slate-700 leading-relaxed mb-5">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role} · {t.daysAgo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 bg-gradient-to-b from-[#FFF3EE]/40 to-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FF6B47]/20">
              <Award className="w-3.5 h-3.5" /> Pricing
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">Start free. Upgrade when you're ready to land interviews faster.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mockPricing.map(p => (
              <div key={p.id} className={`relative rounded-3xl p-8 border-2 transition-all hover:-translate-y-1 ${p.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider">{p.badge}</div>
                )}
                <div className="mb-5">
                  <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${p.highlighted ? 'text-[#FF6B47]' : 'text-[#FF6B47]'}`}>{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">${p.price}</span>
                    <span className={`text-sm ${p.highlighted ? 'text-white/70' : 'text-slate-500'}`}>/{p.period}</span>
                  </div>
                  <p className={`text-sm mt-2 ${p.highlighted ? 'text-white/80' : 'text-slate-600'}`}>{p.description}</p>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.slice(0,5).map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[#FF6B47]' : 'text-[#0D6B4F]'}`} strokeWidth={3} />
                      <span className={p.highlighted ? 'text-white/90' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block text-center py-3 rounded-full font-bold transition-all ${p.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] inline-flex items-center gap-1">
              Compare all plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {mockFaqs.map((f, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-900">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B47]/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-12 h-12 text-[#FF6B47] mx-auto mb-4" />
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Your resume is an extension of yourself — make one that's truly you
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join 15M+ professionals who've built standout resumes with ResumeFlow.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold text-lg shadow-2xl shadow-[#FF6B47]/30 transition-all">
            Build Your Resume Now <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-white/70">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i=>(<Star key={i} className="w-4 h-4 fill-[#FF6B47] text-[#FF6B47]" />))}</div>
            <span className="font-bold">5,187 Reviews</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
