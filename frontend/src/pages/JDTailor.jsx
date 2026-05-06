import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { usePayment } from '../context/PaymentContext';
import { CheckCircle2, FileText, ArrowRight, Sparkles, Target, Zap, Clock, ShieldCheck, BarChart2, PenLine, Search } from 'lucide-react';
import { ease } from '../lib/animations';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = (d = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: d } } });

const steps = [
  { step: '01', title: 'Share Your Resume + Job Description', desc: 'After your consultation call, paste the JD you are applying to alongside your resume. Works for any role, any company.' },
  { step: '02', title: 'JD Keyword Mapping', desc: 'We extract every requirement, skill, and keyword from the JD — including hidden requirements recruiters look for but don\'t always list explicitly.' },
  { step: '03', title: 'Gap Analysis & Match Score', desc: 'We score how well your current resume matches the JD and identify every section that needs to be upgraded to get you past screening.' },
  { step: '04', title: 'Expert Resume Rewrite', desc: 'Our specialist rewrites your resume to align perfectly with the JD — same tone, same keywords, same priorities the hiring team has listed.' },
  { step: '05', title: 'Tailored Resume Delivered', desc: 'You receive your JD-tailored resume within 24–48 hours — ready to apply with confidence, knowing you match exactly what they are looking for.' },
];

const deliverables = [
  'JD match score before and after tailoring',
  'Full list of JD keywords added to your resume',
  'Professional Summary rewritten to mirror the JD',
  'Skills section re-ordered and expanded to match requirements',
  'Experience bullets rewritten to reflect JD priorities',
  'Tone aligned to the company culture from the JD',
  'Cover letter talking points (bonus)',
  'Tailored resume delivered as .docx',
];

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    originalPrice: '₹699',
    desc: 'ATS Score + JD Tailoring + 15–20 curated job matches',
    features: ['Full ATS Score Report', 'Expert Resume Rewrite', 'JD Tailoring for 1 Job Description', '15–20 Curated Job Matches', '24–48 hr Delivery', 'Priority Support'],
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
    features: ['Everything in Pro', '30–40 Curated Job Matches', 'Deeper Company & Recruiter Research', 'Priority 24hr Delivery', 'Direct Recruiter Outreach Tips', 'Dedicated Support'],
    cta: 'Get Premium',
    highlighted: true,
    badge: 'Best Value',
  },
];

const JDTailor = () => {
  const { openPayment } = usePayment();
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-14 pb-14 bg-gradient-to-b from-[#EEF4FF] via-[#F8FAFF] to-white">
        <motion.div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variants={stagger(0.09)} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#4F8EF7] text-xs font-bold uppercase tracking-wider mb-6">
            <PenLine className="w-3.5 h-3.5" /> Done-For-You JD Tailoring
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            Generic resumes don't get interviews.
            <span className="text-[#4F8EF7]"> Tailored ones do.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every job description is different. Recruiters spend an average of 7 seconds scanning your resume — if it doesn't mirror their exact language and priorities, it goes in the bin. We make sure yours doesn't.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            {[['1 JD', 'Per Tailoring Session'], ['24–48 hrs', 'Delivery Time'], ['95%+', 'Keyword Match Rate'], ['7 sec', 'Average Recruiter Scan']].map(([v, l]) => (
              <div key={l} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
                <span className="font-extrabold text-[#4F8EF7] text-sm">{v}</span>
                <span className="text-slate-600 text-sm">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why Tailoring Matters */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Why a tailored resume is a different league</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Hiring managers read hundreds of applications. A resume that speaks their language stands out immediately.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-6" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: BarChart2, color: '#4F8EF7', bg: '#EEF4FF', title: 'Higher match score', desc: 'Tailored resumes score 40–60% higher in ATS matching algorithms because they use the exact language from the JD.' },
              { icon: Target, color: '#FF6B47', bg: '#FFF3EE', title: 'Recruiter reads yours first', desc: 'A resume that reflects the JD\'s tone and priorities signals you\'ve done your research — and shows you actually want this specific role.' },
              { icon: Search, color: '#0D6B4F', bg: '#E8F5F0', title: 'Beats the competition fast', desc: 'Most candidates send the same resume everywhere. A tailored one is rare — and it shows in the interview call rate immediately.' },
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
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">How we tailor your resume</h2>
            <p className="text-slate-500 text-lg">Done by a human expert — not auto-generated filler</p>
          </motion.div>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07, ease }}
                className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#4F8EF7] text-white flex items-center justify-center font-extrabold text-sm">{step}</div>
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
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Your resume, perfectly matched to the job</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">We don't just swap keywords. We rewrite your resume so it reads like it was built for that specific role — because it was.</p>
              <div className="space-y-3">
                {deliverables.map(d => (
                  <div key={d} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4F8EF7] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-slate-700 text-sm font-medium">{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="bg-gradient-to-br from-[#1e3a6e] to-[#2d5aad] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-8 h-8 text-[#FF6B47]" />
                <div>
                  <div className="font-extrabold text-lg">What makes us different</div>
                  <div className="text-white/60 text-sm">Expert eyes on every word</div>
                </div>
              </div>
              {[
                ['Real human rewrite, not a template swap', 'We don\'t just paste keywords in. We restructure your experience to tell the story the JD is looking for.'],
                ['Tone and culture alignment', 'Startup JD vs enterprise JD sound completely different. We match the company\'s language style.'],
                ['Hidden requirements uncovered', 'We read between the lines and surface skills the hiring manager wants but didn\'t explicitly write.'],
                ['Before + after match score', 'You see exactly how much your match score improved — so you know the work was done.'],
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
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Included in every plan</h2>
            <p className="text-slate-500 text-lg">JD Tailoring comes with both Pro and Premium — one-time payment</p>
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
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${plan.highlighted ? 'text-white/50' : 'text-slate-400'}`}>One-Time Payment · No Subscription</div>
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-white/75' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
                <button
                  onClick={() => openPayment(plan.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold mb-6 transition-colors ${plan.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-[#0F3D2E] hover:bg-[#1a5c45] text-white'}`}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </button>
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

export default JDTailor;
