import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { CheckCircle2, Target, FileSearch, TrendingUp, Award, Clock, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

const steps = [
  { step: '01', title: 'Submit Your Resume & Target Role', desc: 'After booking your 15-minute consultation, share your resume and the role you are targeting. That\'s all we need to get started.' },
  { step: '02', title: 'Deep ATS Simulation', desc: 'We run your resume through 15+ real ATS platforms — Workday, Taleo, Greenhouse, Lever, iCIMS — and identify every point of failure.' },
  { step: '03', title: 'Keyword Gap & Score Analysis', desc: 'We map your resume against 500+ role-specific keywords and generate a section-by-section score across formatting, skills, experience, education, and impact.' },
  { step: '04', title: 'Expert Rewrite by Our Specialist', desc: 'A senior resume expert personally rewrites weak sections — adding missing keywords, upgrading bullets with strong action verbs and measurable impact, and fixing formatting.' },
  { step: '05', title: 'Delivery: Score Report + Optimised Resume', desc: 'You receive a full ATS score report and your upgraded resume (.docx) delivered within 24–48 hours of your call. Ready to send.' },
];

const deliverables = [
  'Full ATS compatibility score (0–100)',
  'Section-by-section metric breakdown (6 categories)',
  'High-value missing keywords identified for your role',
  'Formatting & parse-ability issues fixed',
  'Professional Summary rewritten to pass ATS filters',
  'Bullet points upgraded — action verbs + quantified impact',
  'Skills section expanded with role-relevant keywords',
  'Final ATS-optimised resume delivered as .docx',
];

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    originalPrice: '₹699',
    desc: 'ATS Score + JD Tailoring + 15–20 curated job matches',
    features: [
      'Full ATS Score Report',
      'Expert Resume Rewrite',
      'JD Tailoring for 1 Job Description',
      '15–20 Curated Job Matches',
      '24–48 hr Delivery',
      'Priority Support',
    ],
    cta: 'Get Pro',
    highlighted: false,
    badge: 'Limited Offer',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹899',
    originalPrice: '₹1,299',
    desc: 'Everything in Pro — more job matches, deeper search',
    features: [
      'Everything in Pro',
      '30–40 Curated Job Matches',
      'Deeper Company & Recruiter Research',
      'Priority 24hr Delivery',
      'Direct Recruiter Outreach Tips',
      'Dedicated Support',
    ],
    cta: 'Get Premium',
    highlighted: true,
    badge: 'Best Value',
  },
];

const ATSChecker = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-14 pb-14 bg-gradient-to-b from-[#FFF3EE] via-[#FFFBF7] to-white">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={stagger(0.09)} initial="hidden" animate="show"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Done-For-You ATS Optimisation
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            90% of resumes are rejected<br className="hidden sm:block" />
            <span className="text-[#FF6B47]"> before a human ever sees them.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Applicant Tracking Systems silently filter out most candidates — even qualified ones. Our experts manually audit your resume against real ATS platforms and deliver a fully optimised version that passes the bots and impresses the hiring manager.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            {[['15+', 'ATS Platforms Tested'], ['24–48 hrs', 'Delivery Time'], ['500+', 'Keywords Analysed'], ['3×', 'More Interview Calls']].map(([v, l]) => (
              <div key={l} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
                <span className="font-extrabold text-[#FF6B47] text-sm">{v}</span>
                <span className="text-slate-600 text-sm">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why ATS Matters */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Why ATS optimisation is non-negotiable</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">The hiring process has changed. Most companies filter 200+ applications before a recruiter reads a single one.</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {[
              { icon: Target, color: '#EF4444', bg: '#FEF2F2', title: '75% of resumes', desc: 'are automatically rejected by ATS before any human reviews them — even from qualified candidates with years of experience.' },
              { icon: FileSearch, color: '#F59E0B', bg: '#FFFBEB', title: 'One missing keyword', desc: 'can drop your score below the recruiter\'s cut-off threshold. The ATS doesn\'t know you\'re perfect for the role — it only sees text.' },
              { icon: TrendingUp, color: '#0D6B4F', bg: '#E8F5F0', title: '3× more interviews', desc: 'Candidates with ATS-optimised resumes consistently get 3× more interview calls compared to those with unoptimised ones.' },
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
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">How we optimise your resume</h2>
            <p className="text-slate-500 text-lg">A fully done-for-you service — handled by our expert, not a bot</p>
          </motion.div>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease }}
                className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0F3D2E] text-white flex items-center justify-center font-extrabold text-sm">
                  {step}
                </div>
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
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Everything delivered to your inbox
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                No dashboards to navigate. No guesswork. We send you a complete, ready-to-use package within 24–48 hours of your consultation call.
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
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="bg-gradient-to-br from-[#0F3D2E] to-[#1a5c45] rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-8">
                <Award className="w-8 h-8 text-[#FF6B47]" />
                <div>
                  <div className="font-extrabold text-lg">Our Promise</div>
                  <div className="text-white/60 text-sm">Results you can measure</div>
                </div>
              </div>
              {[
                ['Measurable ATS score improvement', 'Every resume we handle sees a significant score jump — or we revise until it does.'],
                ['Real ATS platform testing', 'We test on the actual software recruiters use — not generic simulators.'],
                ['Human expert, not just AI', 'Our specialist personally reviews and rewrites your resume. AI assists; humans decide.'],
                ['Interview-ready in 48 hours', 'Book your call today and receive your upgraded resume tomorrow.'],
              ].map(([title, desc]) => (
                <div key={title} className="mb-6 last:mb-0 pl-4 border-l-2 border-[#FF6B47]/50">
                  <div className="font-bold text-sm mb-1">{title}</div>
                  <div className="text-white/65 text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Get started today</h2>
            <p className="text-slate-500 text-lg">One-time payment · Includes ATS Score, JD Tailoring & Job Search</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: plan.highlighted ? '0 24px 60px rgba(15,61,46,0.25)' : '0 20px 48px rgba(0,0,0,0.09)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`relative rounded-3xl p-8 border-2 ${plan.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-xl' : 'bg-white border-slate-100'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[#FF6B47]">{plan.name}</div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-base font-semibold line-through ${plan.highlighted ? 'text-white/35' : 'text-slate-300'}`}>{plan.originalPrice}</span>
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${plan.highlighted ? 'text-white/50' : 'text-slate-400'}`}>
                    One-Time Payment · No Subscription
                  </div>
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-white/75' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
                <Link
                  to="/pricing"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold mb-6 transition-colors ${plan.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-[#0F3D2E] hover:bg-[#1a5c45] text-white'}`}
                >
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
          <motion.div
            className="text-center mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0D6B4F]" /> Secure payment</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF6B47]" /> 24–48 hr delivery</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#7C3AED]" /> Book your call instantly</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ATSChecker;
