import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CheckCircle2, X, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const PLANS = {
  pro: {
    id: 'pro',
    name: 'Pro',
    rawPrice: 499,
    price: '₹499',
    originalPrice: '₹699',
    description: 'ATS Score · JD Tailoring · 15–20 Curated Job Matches',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    rawPrice: 899,
    price: '₹899',
    originalPrice: '₹1,299',
    description: 'Everything in Pro · 30–40 Jobs · Recruiter Contacts',
  },
};

const BOOKING_URL = 'https://cal.com/interviewknockout/interviewknockout-consultation';

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    if (document.getElementById('rzp-script')) return resolve(false);
    const s = document.createElement('script');
    s.id = 'rzp-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null); // null | { ok: true, plan } | { ok: false, error, plan }

  const openPayment = useCallback(async (planId) => {
    const plan = PLANS[planId];
    if (!plan) return;

    if (!user) {
      navigate('/signup', { state: { from: { pathname: '/pricing' } } });
      return;
    }

    setPaying(true);
    setResult(null);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Payment gateway failed to load. Check your connection.');

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: plan.rawPrice * 100,
        currency: 'INR',
        name: 'InterviewKnockout',
        description: `${plan.name} Plan — One-Time Payment`,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#0F3D2E' },
        handler: async (response) => {
          try {
            await updatePlan(plan.id);
            setResult({ ok: true, plan, paymentId: response?.razorpay_payment_id });
          } catch {
            const pid = response?.razorpay_payment_id ? ` (Payment ID: ${response.razorpay_payment_id})` : '';
            setResult({ ok: false, plan, error: `Payment received but plan update failed. Contact hr@interviewknockout.in${pid}` });
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setResult({ ok: false, plan, error: resp.error?.description || 'Payment failed. Please try again.' });
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setResult({ ok: false, plan: PLANS[planId], error: err.message || 'Could not start payment. Please try again.' });
      setPaying(false);
    }
  }, [user, navigate, updatePlan]);

  const closeResult = () => setResult(null);

  return (
    <PaymentContext.Provider value={{ openPayment, paying }}>
      {children}

      {/* Loading overlay while Razorpay script loads */}
      {paying && !result && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(15,61,46,0.45)', backdropFilter: 'blur(3px)' }}>
          <div className="bg-white rounded-2xl px-8 py-6 flex items-center gap-3 shadow-xl">
            <Loader2 className="w-5 h-5 animate-spin text-[#0F3D2E]" />
            <span className="font-semibold text-slate-700">Opening payment gateway…</span>
          </div>
        </div>
      )}

      {/* Success / Error result modal */}
      {result && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,61,46,0.55)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeResult(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {result.ok ? (
              <>
                <div className="bg-gradient-to-r from-[#0F3D2E] to-[#1a5c45] px-8 py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-extrabold text-xl">Payment Successful!</div>
                  <div className="text-white/65 text-sm mt-1">{result.plan.name} Plan activated</div>
                </div>
                <div className="px-8 py-6 text-center">
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    Our expert team will contact you within 24 hours. Book your free 15-minute consultation call now to get started faster.
                  </p>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF6B47] hover:bg-[#ff5630] text-white font-bold transition-colors mb-3"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Your Consultation Call
                  </a>
                  <button onClick={closeResult} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-8 pt-8 pb-4 flex items-start justify-between">
                  <div className="text-base font-extrabold text-slate-900">Payment issue</div>
                  <button onClick={closeResult} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-8 pb-8">
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{result.error}</p>
                  <button
                    onClick={() => { closeResult(); openPayment(result.plan.id); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0F3D2E] hover:bg-[#1a5c45] text-white font-bold transition-colors"
                  >
                    Try Again <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
