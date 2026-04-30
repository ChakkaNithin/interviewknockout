import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockFaqs } from '../mock';
import { Check, X, ArrowRight, Sparkles, Shield, Zap, Award, ChevronDown, Loader2, CheckCircle2, Clock, ShieldCheck, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger = (d = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: d } },
});

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const plans = [
  {
    id: 'free',
    name: 'Basic',
    price: 'Free',
    originalPrice: null,
    rawPrice: 0,
    description: 'Build and download your resume at no cost — forever',
    features: [
      'Resume Builder (unlimited)',
      'All Templates',
      'Download as Word (.docx)',
      'Custom Sections',
    ],
    cta: 'Start Free',
    highlighted: false,
    badge: '',
    isFree: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    originalPrice: '₹699',
    rawPrice: 499,
    description: 'Done-for-you ATS Score, JD Tailoring & curated job matches',
    features: [
      'Full ATS Score Report',
      'Expert Resume Rewrite',
      'JD Tailoring for 1 Job Description',
      '15–20 Curated Job Matches',
      'Direct Application Links',
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
    rawPrice: 899,
    description: 'Everything in Pro — more jobs, deeper recruiter research',
    features: [
      'Everything in Pro',
      '30–40 Curated Job Matches',
      'Recruiter Contact Details',
      'Deeper Company Research',
      'Priority 24hr Delivery',
      'Direct Recruiter Outreach Tips',
      'Dedicated Support',
    ],
    cta: 'Get Premium',
    highlighted: true,
    badge: 'Best Value',
  },
];

const comparison = [
  { feature: 'Resume Builder',          basic: true,         pro: true,         premium: true },
  { feature: 'All Templates',           basic: true,         pro: true,         premium: true },
  { feature: 'Word (.docx) Download',   basic: true,         pro: true,         premium: true },
  { feature: 'ATS Score Report',        basic: false,        pro: true,         premium: true },
  { feature: 'Expert Resume Rewrite',   basic: false,        pro: true,         premium: true },
  { feature: 'JD Tailoring',            basic: false,        pro: true,         premium: true },
  { feature: 'Curated Job Matches',     basic: false,        pro: '15–20',      premium: '30–40' },
  { feature: 'Direct Application Links',basic: false,        pro: true,         premium: true },
  { feature: 'Recruiter Contacts',      basic: false,        pro: false,        premium: true },
  { feature: 'Delivery Time',           basic: '—',          pro: '24–48 hrs',  premium: 'Priority 24 hrs' },
  { feature: 'Dedicated Support',       basic: false,        pro: false,        premium: true },
];

const Pricing = () => {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [paying, setPaying] = useState(null);
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState('');

  const handleUpgrade = async (plan) => {
    if (plan.isFree) return navigate(user ? '/builder' : '/signup');
    if (!user) return navigate('/signup', { state: { from: { pathname: '/pricing' } } });
    setPayError('');
    setPaySuccess('');
    setPaying(plan.id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment gateway. Check your internet connection.');
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: plan.rawPrice * 100,
        currency: 'INR',
        name: 'InterviewKnockout',
        description: `${plan.name} Plan — One-Time`,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#0F3D2E' },
        handler: async (response) => {
          try {
            await updatePlan(plan.id);
            setPaySuccess('Payment successful! Redirecting you to book your 15-minute consultation call...');
            setTimeout(() => window.open('https://cal.com/interviewknockout/interviewknockout-consultation', '_blank'), 1800);
          } catch {
            const pid = response?.razorpay_payment_id ? ` (Payment ID: ${response.razorpay_payment_id})` : '';
            setPayError(`Payment received but plan update failed. Please contact support@interviewknockout.in${pid}`);
          } finally {
            setPaying(null);
          }
        },
        modal: { ondismiss: () => setPaying(null) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setPayError(resp.error?.description || 'Payment failed. Please try again.');
        setPaying(null);
      });
      rzp.open();
    } catch (err) {
      setPayError(err.message || 'Could not start payment. Please try again.');
      setPaying(null);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FFF3EE] via-[#FFFBF7] to-white">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={stagger(0.09)} initial="hidden" animate="show"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-5">
            <Award className="w-3.5 h-3.5" /> Simple, One-Time Pricing
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
            Pay once. <span className="text-[#FF6B47]">Land the interview.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            No subscriptions. No monthly fees. One payment gets you a done-for-you ATS review, JD-tailored resume, and curated job list — delivered within 48 hours.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-600">
            {[
              [ShieldCheck, 'Secure payment', '#0D6B4F'],
              [Clock, '24–48 hr delivery', '#FF6B47'],
              [CalendarDays, '15-min consultation call included', '#7C3AED'],
            ].map(([Icon, text, color]) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color }} />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {payError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 max-w-xl mx-auto px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
                {payError}
              </motion.div>
            )}
            {paySuccess && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 max-w-xl mx-auto px-4 py-4 bg-[#E8F5F0] border border-[#BBE8D8] rounded-xl text-sm text-[#0F3D2E] text-center font-semibold">
                ✅ {paySuccess}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="grid md:grid-cols-3 gap-6 items-start"
            variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          >
            {plans.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: p.highlighted ? '0 24px 60px rgba(15,61,46,0.28)' : '0 24px 48px rgba(0,0,0,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`relative rounded-3xl p-7 border-2 ${p.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100'}`}
              >
                {p.badge && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.3 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow"
                  >
                    {p.badge}
                  </motion.div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[#FF6B47]">{p.name}</div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    {p.originalPrice && (
                      <span className={`text-base font-semibold line-through ${p.highlighted ? 'text-white/35' : 'text-slate-300'}`}>{p.originalPrice}</span>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${p.highlighted ? 'text-white/50' : 'text-slate-400'}`}>
                    {p.isFree ? 'No credit card required' : 'One-Time Payment · No Subscription'}
                  </div>
                  <p className={`text-sm leading-relaxed ${p.highlighted ? 'text-white/80' : 'text-slate-600'}`}>{p.description}</p>
                </div>

                {p.isFree ? (
                  <Link
                    to={user ? '/builder' : '/signup'}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-colors mb-6 bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    {p.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <motion.button
                    onClick={() => handleUpgrade(p)}
                    disabled={paying === p.id || (user && user.plan === p.id)}
                    whileHover={!(paying === p.id || (user && user.plan === p.id)) ? { scale: 1.03 } : {}}
                    whileTap={!(paying === p.id || (user && user.plan === p.id)) ? { scale: 0.97 } : {}}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-colors mb-6 disabled:opacity-60 disabled:cursor-not-allowed ${p.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-[#0F3D2E] hover:bg-[#1a5c45] text-white'}`}
                  >
                    {paying === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {user && user.plan === p.id ? 'Current Plan' : p.cta}
                    {!(user && user.plan === p.id) && paying !== p.id && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                )}

                <motion.ul
                  variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="space-y-2.5"
                >
                  {p.features.map(f => (
                    <motion.li
                      key={f}
                      variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease } } }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[#FF6B47]' : 'text-[#0D6B4F]'}`} strokeWidth={2.5} />
                      <span className={p.highlighted ? 'text-white/90' : 'text-slate-700'}>{f}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8 p-5 bg-[#E8F5F0] border border-[#BBE8D8] rounded-2xl max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2 text-[#0F3D2E] font-bold mb-1">
              <CalendarDays className="w-5 h-5" /> After payment — book your 15-minute call
            </div>
            <p className="text-sm text-slate-600">Once your payment is confirmed, you'll be redirected to schedule a free 15-minute consultation. Our team will collect your resume and preferences, then deliver results within 24–48 hours.</p>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-10"
          >
            Compare plans
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                  <th className="text-center p-4 text-sm font-bold text-slate-500">Basic · Free</th>
                  <th className="text-center p-4 text-sm font-bold text-[#FF6B47]">Pro · ₹499</th>
                  <th className="text-center p-4 text-sm font-bold text-[#0F3D2E]">Premium · ₹899</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-4 text-sm font-semibold text-slate-700">{row.feature}</td>
                    {['basic', 'pro', 'premium'].map(key => (
                      <td key={key} className="text-center p-4">
                        {typeof row[key] === 'boolean' ? (
                          row[key]
                            ? <Check className="w-5 h-5 text-[#0D6B4F] mx-auto" strokeWidth={3} />
                            : <X className="w-5 h-5 text-slate-300 mx-auto" strokeWidth={2} />
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">{row[key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-10"
          >
            Pricing FAQs
          </motion.h2>
          <motion.div variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3">
            {[
              { q: 'Is this really a one-time payment?', a: 'Yes. You pay once and we deliver your ATS report, optimised resume, JD tailoring, and curated job list. No subscriptions, no hidden renewals.' },
              { q: 'What happens after I pay?', a: 'You\'ll be redirected to book a free 15-minute consultation call. On that call, we collect your resume and preferences. Results are delivered within 24–48 hours.' },
              { q: 'What\'s the difference between Pro and Premium?', a: 'Both plans include ATS Score, JD Tailoring, and expert resume rewrite. Premium gives you 30–40 job matches (vs 15–20 in Pro), plus recruiter contact details, deeper company research, and priority delivery.' },
              { q: 'Can I upgrade from Pro to Premium later?', a: 'Yes. If you start with Pro and want the Premium job search volume, contact our team and we\'ll upgrade your order at the difference in price.' },
              { q: 'Is my resume and data secure?', a: 'Yes. Your resume and personal information are fully encrypted and only used to deliver your service. We never sell or share your data.' },
              ...mockFaqs.slice(2, 4),
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{f.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25, ease }}>
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease }} style={{ overflow: 'hidden' }}>
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0F3D2E] to-[#14543F] relative overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          animate={{ scale: [1, 1.06, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 60% 50%, #FF6B47, transparent 65%)' }}
        />
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Ready to land your next interview?</h2>
          <p className="text-white/80 mb-8">One payment. Expert review. Results in 48 hours.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to={user ? '/builder' : '/signup'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#0F3D2E] rounded-full font-bold shadow-lg transition-colors">
                Build My Resume Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button onClick={() => handleUpgrade(plans[1])}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg transition-colors">
                Get Pro — ₹499 <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
