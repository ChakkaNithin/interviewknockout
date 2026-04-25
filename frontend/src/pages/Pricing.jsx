import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockPricing, mockFaqs } from '../mock';
import { Check, X, ArrowRight, Sparkles, Shield, Zap, Award, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentsApi } from '../lib/api';

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

const Pricing = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);
  const [paying, setPaying] = useState(null); // plan id being paid
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState('');

  const getPrice = (p) => {
    if (p.price === 0) return 0;
    if (billing === 'yearly') return (p.price * 0.6).toFixed(2);
    return p.price;
  };

  const handleUpgrade = async (plan) => {
    if (plan.id === 'free') return navigate('/signup');
    if (!user) return navigate('/signup', { state: { from: { pathname: '/pricing' } } });

    setPayError('');
    setPaySuccess('');
    setPaying(plan.id);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay. Check your internet connection.');

      const order = await paymentsApi.createOrder(plan.id, billing);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'InterviewKnockout',
        description: `${plan.name} Plan — ${billing === 'yearly' ? 'Annual' : 'Monthly'}`,
        order_id: order.order_id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#0F3D2E' },
        handler: async (response) => {
          try {
            const updatedUser = await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id,
              billing,
            });
            await refreshUser(updatedUser);
            setPaySuccess(`You're now on the ${plan.name} plan! Enjoy your new features.`);
          } catch {
            setPayError('Payment received but verification failed. Please contact support.');
          } finally {
            setPaying(null);
          }
        },
        modal: {
          ondismiss: () => setPaying(null),
        },
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

  const comparison = [
    { feature: 'Resumes', free: '1', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Templates', free: '3', pro: '20+', premium: '20+' },
    { feature: 'PDF Downloads', free: '3/mo', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'ATS Checker', free: 'Basic', pro: 'Advanced', premium: 'Advanced+' },
    { feature: 'AI Content Generation', free: false, pro: true, premium: true },
    { feature: 'JD Tailoring', free: false, pro: true, premium: true },
    { feature: 'Cover Letter Builder', free: false, pro: true, premium: true },
    { feature: 'Job Search', free: false, pro: false, premium: true },
    { feature: 'Expert Review', free: false, pro: false, premium: true },
    { feature: 'LinkedIn Optimizer', free: false, pro: false, premium: true },
    { feature: 'Priority Support', free: false, pro: true, premium: true },
    { feature: '24/7 Premium Support', free: false, pro: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FFF3EE] via-[#FFFBF7] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-5">
            <Award className="w-3.5 h-3.5" /> Simple Pricing
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
            Pricing built for every <span className="text-[#FF6B47]">job seeker</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">Start free. Upgrade when you're ready to land interviews faster. Cancel anytime.</p>
          <div className="inline-flex p-1 bg-white rounded-full border border-slate-200 shadow-sm">
            {[['monthly', 'Monthly'], ['yearly', 'Yearly']].map(([k, l]) => (
              <button key={k} onClick={() => setBilling(k)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${billing === k ? 'bg-[#0F3D2E] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>
                {l} {k === 'yearly' && <span className="ml-1 text-xs">Save 40%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {payError && (
            <div className="mb-6 max-w-xl mx-auto px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">{payError}</div>
          )}
          {paySuccess && (
            <div className="mb-6 max-w-xl mx-auto px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">{paySuccess}</div>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {mockPricing.map(p => (
              <div key={p.id} className={`relative rounded-3xl p-8 border-2 transition-all hover:-translate-y-1 ${p.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-2xl scale-[1.03]' : 'bg-white border-slate-100 hover:shadow-xl'}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow">{p.badge}</div>
                )}
                <div className="mb-6">
                  <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${'text-[#FF6B47]'}`}>{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">${getPrice(p)}</span>
                    <span className={`text-sm ${p.highlighted ? 'text-white/70' : 'text-slate-500'}`}>/{billing === 'yearly' ? 'mo (billed yearly)' : p.period}</span>
                  </div>
                  <p className={`text-sm mt-2 ${p.highlighted ? 'text-white/80' : 'text-slate-600'}`}>{p.description}</p>
                </div>
                <button
                  onClick={() => handleUpgrade(p)}
                  disabled={paying === p.id || (user && user.plan === p.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all mb-6 disabled:opacity-60 disabled:cursor-not-allowed ${p.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  {paying === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {user && user.plan === p.id ? 'Current Plan' : p.cta}
                </button>
                <ul className="space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[#FF6B47]' : 'text-[#0D6B4F]'}`} strokeWidth={3} />
                      <span className={p.highlighted ? 'text-white/90' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#0D6B4F]" /> 7-day money-back guarantee</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#FF6B47]" /> Cancel anytime</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#7C3AED]" /> No credit card for free plan</div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-10">Compare all features</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                  <th className="text-center p-4 text-sm font-bold text-slate-900">Free</th>
                  <th className="text-center p-4 text-sm font-bold text-[#FF6B47]">Pro</th>
                  <th className="text-center p-4 text-sm font-bold text-[#0F3D2E]">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-4 text-sm font-semibold text-slate-700">{row.feature}</td>
                    {['free', 'pro', 'premium'].map(key => (
                      <td key={key} className="text-center p-4">
                        {typeof row[key] === 'boolean' ? (
                          row[key] ? <Check className="w-5 h-5 text-[#0D6B4F] mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-slate-300 mx-auto" strokeWidth={2} />
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">{row[key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-10">Pricing FAQs</h2>
          <div className="space-y-3">
            {mockFaqs.slice(0, 5).map((f, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-900">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-slate-600 leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0F3D2E] to-[#14543F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Ready to land your dream job?</h2>
          <p className="text-white/80 mb-8">Join 15M+ professionals who've built standout resumes.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg transition-all">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
