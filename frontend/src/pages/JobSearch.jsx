import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { CheckCircle2, Briefcase, ArrowRight, Zap, Clock, ShieldCheck, Search, Filter, Building2, TrendingUp, Star } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

const steps = [
  { step: '01', title: 'Share Your Resume & Preferences', desc: 'Tell us your target role, preferred locations, industry, and salary range. We do the rest — no job board sign-ups, no endless scrolling.' },
  { step: '02', title: 'We Search 50+ Sources', desc: 'We scan LinkedIn, Naukri, Indeed, company career pages, and exclusive recruiter networks — sources most candidates don\'t even know exist.' },
  { step: '03', title: 'Deep Compatibility Matching', desc: 'Every job is matched against your skills, experience level, and ATS score to estimate your probability of getting a call — we only include strong matches.' },
  { step: '04', title: 'Curated List Delivered', desc: 'You receive a shortlist of 15–40 curated jobs (depending on your plan) with direct application links, match reasoning, and our ATS score prediction for each.' },
];

const deliverables = [
  'Curated job list tailored to your profile (15–40 roles)',
  'Direct application links — no redirects',
  'Why you\'re a match — per job explanation',
  'Estimated ATS score for your resume vs. each JD',
  'Company size, funding stage & culture notes',
  'Recruiter contact details where available',
  'Best time to apply recommendations',
  'Jobs delivered as a clean spreadsheet or PDF',
];

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    originalPrice: '₹699',
    jobs: '15–20',
    desc: 'ATS Score + JD Tailoring + 15–20 curated job matches',
    features: ['Full ATS Score Report', 'Expert Resume Rewrite', 'JD Tailoring for 1 Job Description', '15–20 Curated Job Matches', 'Direct Application Links', '24–48 hr Delivery', 'Priority Support'],
    cta: 'Get Pro',
    highlighted: false,
    badge: 'Limited Offer',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹899',
    originalPrice: '₹1,299',
    jobs: '30–40',
    desc: 'Everything in Pro — more jobs, deeper recruiter research',
    features: ['Everything in Pro', '30–40 Curated Job Matches', 'Recruiter Contact Details', 'Company Deep-Dive Research', 'Priority 24hr Delivery', 'Direct Recruiter Outreach Tips', 'Dedicated Support'],
    cta: 'Get Premium',
    highlighted: true,
    badge: 'Best Value',
  },
];

const JobSearch = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-14 pb-14 bg-gradient-to-b from-[#EEFAF4] via-[#F6FDF9] to-white">
        <motion.div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variants={stagger(0.09)} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-6">
            <Search className="w-3.5 h-3.5" /> Done-For-You Job Search
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            Stop applying everywhere and
            <span className="text-[#0D6B4F]"> getting nowhere.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The average job seeker spends 11 hours a week searching job boards — and still misses the best opportunities. We search 50+ sources, filter for genuine fit, and hand you a curated shortlist of roles you're actually qualified for.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            {[['50+', 'Sources Searched'], ['15–40', 'Curated Matches'], ['24–48 hrs', 'Delivery Time'], ['11 hrs', 'Saved Per Week']].map(([v, l]) => (
              <div key={l} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
                <span className="font-extrabold text-[#0D6B4F] text-sm">{v}</span>
                <span className="text-slate-600 text-sm">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why Our Search is Different */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Why we find jobs you can't find yourself</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Most job boards show the same listings. We go deeper — including roles that aren't publicly posted yet.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-6" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: Filter, color: '#0D6B4F', bg: '#E8F5F0', title: 'Quality over quantity', desc: 'We don\'t dump 200 listings on you. Every role we send is verified, active, and matched to your specific skills and experience level.' },
              { icon: Building2, color: '#4F8EF7', bg: '#EEF4FF', title: 'Hidden market access', desc: 'Up to 70% of jobs are never posted publicly. We tap into recruiter networks and company career pages before listings go live.' },
              { icon: TrendingUp, color: '#FF6B47', bg: '#FFF3EE', title: 'Better application odds', desc: 'With fewer, better-matched applications, candidates using our service get 4× more callbacks than mass-applying on their own.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="p-6 rounded-2xl border border-slate-100" style={{ background: bg }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: color + '22' }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="font-extrabold text-slate-900 text-lg mb-2">{title}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">How we find your next role</h2>
            <p className="text-slate-500 text-lg">A hands-on search — done for you by our team</p>
          </motion.div>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07, ease }}
                className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0D6B4F] text-white flex items-center justify-center font-extrabold text-sm">{step}</div>
                <div className="pt-1">
                  <div className="font-bold text-slate-900 mb-1">{title}</div>
                  <div className="text-slate-500 text-sm leading-relaxed">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Jobs that fit you — ready to apply</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                No more hours lost on job boards. No more applying to roles you're not right for. Just a focused list of genuine opportunities delivered straight to you.
              </p>
              <div className="space-y-3">
                {deliverables.map(d => (
                  <div key={d} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0D6B4F] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-slate-700 text-sm font-medium">{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="bg-gradient-to-br from-[#0F3D2E] to-[#1a5c45] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-8 h-8 text-[#FF6B47]" />
                <div>
                  <div className="font-extrabold text-lg">Pro vs Premium</div>
                  <div className="text-white/60 text-sm">Choose your match volume</div>
                </div>
              </div>
              {[
                { plan: 'Pro', jobs: '15–20 jobs', color: '#4F8EF7', detail: 'High-quality curated matches from top job boards and company career pages. Best for focused, targeted applications.' },
                { plan: 'Premium', jobs: '30–40 jobs', color: '#FF6B47', detail: 'Wider search including hidden market roles, recruiter contacts, and deep company research. Best for comprehensive campaigns.' },
              ].map(({ plan, jobs, color, detail }) => (
                <div key={plan} className="mb-6 last:mb-0 p-4 rounded-xl bg-white/10 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4" style={{ color }} />
                    <span className="font-bold text-sm">{plan}</span>
                    <span className="ml-auto font-extrabold text-sm" style={{ color }}>{jobs}</span>
                  </div>
                  <div className="text-white/65 text-xs leading-relaxed">{detail}</div>
                </div>
              ))}
              <div className="mt-6 pl-4 border-l-2 border-[#FF6B47]/50">
                <div className="font-bold text-sm mb-1">Both plans include</div>
                <div className="text-white/65 text-xs leading-relaxed">Direct links, match reasoning, ATS score prediction per role, and company insights — so every application you send is a confident one.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Start your search today</h2>
            <p className="text-slate-500 text-lg">One-time payment · More jobs with Premium</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-6" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {plans.map(plan => (
              <motion.div key={plan.id} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: plan.highlighted ? '0 24px 60px rgba(15,61,46,0.25)' : '0 20px 48px rgba(0,0,0,0.09)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`relative rounded-3xl p-8 border-2 ${plan.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-xl' : 'bg-white border-slate-100'}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow">{plan.badge}</div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[#FF6B47]">{plan.name}</div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-base font-semibold line-through ${plan.highlighted ? 'text-white/35' : 'text-slate-300'}`}>{plan.originalPrice}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${plan.highlighted ? 'bg-[#FF6B47]/20 text-[#FF6B47]' : 'bg-[#0D6B4F]/10 text-[#0D6B4F]'}`}>{plan.jobs} jobs</span>
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${plan.highlighted ? 'text-white/50' : 'text-slate-400'}`}>One-Time Payment · No Subscription</div>
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-white/75' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
                <Link to="/pricing"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold mb-6 transition-colors ${plan.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-[#0F3D2E] hover:bg-[#1a5c45] text-white'}`}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#FF6B47]' : 'text-[#0D6B4F]'}`} strokeWidth={2.5} />
                      <span className={plan.highlighted ? 'text-white/88' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0D6B4F]" /> Secure payment</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF6B47]" /> 24–48 hr delivery</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#7C3AED]" /> Book your call instantly</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JobSearch;
