import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockTemplates, mockStats, mockFeatures, mockTestimonials, mockPricing, mockFaqs, trustedCompanies } from '../mock';
import { ArrowRight, Star, Check, Sparkles, Target, ShieldCheck, LayoutGrid, SpellCheck, ChevronDown, FileText, Zap, Award, Users, TrendingUp, Search, Upload, CheckCircle2, Mail, ScanText, BriefcaseBusiness, Send, Lock } from 'lucide-react';
import { ease } from '../lib/animations';

const iconMap = { SpellCheck, Target, LayoutGrid, ShieldCheck };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger = (d = 0.1, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: d, delayChildren: delay } },
});

// ─── Animated ATS progress bar ────────────────────────────────────────────────
function AtsBar({ label, value, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : undefined}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ─── Resume data ───────────────────────────────────────────────────────────────
const RESUME_DATA = [
  {
    name: 'SARAH JOHNSON', title: 'Senior Product Engineer', years: '9+ years',
    contact: 'sarah.johnson@email.com · (415) 555-0102 · San Francisco, CA',
    links: 'linkedin.com/in/sjohnson · github.com/sjohnson',
    summary: 'Senior Product Engineer with 9+ years scaling consumer products from 0→10M users at Google, Meta & Stripe. Expert in distributed systems, React ecosystem, and leading cross-functional teams of 8-12 engineers.',
    experiences: [
      { role: 'Senior Software Engineer', company: 'Google', period: '2022 — Present', bullets: ['Led migration of Search ranking pipeline to TPUs, reducing infra cost by $4.2M/yr', 'Mentored team of 8 engineers; promoted 3 to senior roles within 18 months', 'Shipped real-time personalization system serving 2B queries/day at p99 < 50ms'] },
      { role: 'Software Engineer', company: 'Meta', period: '2019 — 2022', bullets: ['Built News Feed ranking feature reaching 800M DAU; +12% engagement', 'Owned end-to-end A/B testing infra; cut experiment setup time 70%'] },
      { role: 'Software Engineer', company: 'Stripe', period: '2016 — 2019', bullets: ['Shipped dispute automation saving merchants $85M annually in chargebacks'] },
    ],
    projects: [
      { name: 'Distributed Cache Layer', desc: 'Designed Redis-based caching layer across 12 microservices; reduced DB load by 60% and p99 latency from 320ms → 45ms.' },
      { name: 'Real-time Event Pipeline', desc: 'Built Kafka + Flink streaming pipeline processing 50M events/day; enabled personalization features for 800M users.' },
    ],
    skills: 'Python · Go · TypeScript · React · Next.js · PostgreSQL · Kafka · Redis · AWS · Kubernetes · Terraform',
    edu: 'B.S. Computer Science · Stanford University, 2016 · GPA 3.9/4.0',
    certs: 'AWS Solutions Architect · Kubernetes CKA · Google Cloud Professional',
  },
  {
    name: 'MICHAEL CHEN', title: 'Director of Product Management', years: '10+ years',
    contact: 'michael.chen@email.com · (212) 555-0134 · New York, NY',
    links: 'linkedin.com/in/mchen · michaelchen.io',
    summary: 'Product leader with 10+ years driving growth at Airbnb, Uber & Dropbox. Led products generating $180M+ ARR with teams of 25+ designers, engineers, and PMs. MBA from Wharton.',
    experiences: [
      { role: 'Director of Product', company: 'Airbnb', period: '2021 — Present', bullets: ['Own Hosts product line ($3.2B GMV); grew host supply 40% YoY', 'Built "Host Insights" analytics suite adopted by 2.4M hosts globally', 'Scaled team from 6 to 22 across product, design & data'] },
      { role: 'Senior PM', company: 'Uber', period: '2018 — 2021', bullets: ['Launched Uber Reserve in 38 cities; $420M run-rate in Year 1', 'Reduced driver churn by 18% via data-driven incentive redesign'] },
      { role: 'Product Manager', company: 'Dropbox', period: '2015 — 2018', bullets: ['Shipped Dropbox Paper to 600M users; reached 10M MAU in 14 months'] },
    ],
    projects: [
      { name: 'Host Insights Dashboard', desc: 'Zero-to-one B2B analytics product for 2.4M Airbnb hosts; became top-requested host feature within 6 months of launch.' },
      { name: 'Uber Reserve Global Rollout', desc: 'Built launch playbook scaled to 38 cities in 4 months; $420M ARR run-rate by end of Year 1.' },
    ],
    skills: 'Product Strategy · Roadmapping · SQL · A/B Testing · User Research · Jira · Amplitude · Figma · OKRs',
    edu: 'MBA · The Wharton School, 2015 · B.S. Economics · UC Berkeley, 2012',
    certs: 'Pragmatic Product Management · Reforge Growth Series',
  },
  {
    name: 'PRIYA PATEL', title: 'Lead UX Designer', years: '8+ years',
    contact: 'priya.patel@email.com · (310) 555-0189 · Los Angeles, CA',
    links: 'linkedin.com/in/ppatel · dribbble.com/ppatel · priyapatel.design',
    summary: 'Lead UX Designer with 8+ years shaping digital products used by 500M+ people. Design systems expert with portfolio spanning Spotify, Uber, and Airbnb. RGD-certified & DBR Design Award winner 2023.',
    experiences: [
      { role: 'Lead Product Designer', company: 'Spotify', period: '2022 — Present', bullets: ['Redesigned Spotify checkout: +22% conversion, $68M incremental ARR', 'Built Encore Design System used by 180+ designers across 40 products', 'Led accessibility audit achieving WCAG 2.2 AA across mobile apps'] },
      { role: 'Senior Designer', company: 'Uber', period: '2019 — 2022', bullets: ['Owned Rider onboarding in 65+ markets; cut drop-off rate 31%', 'Prototyped safety features shipped to 130M+ monthly active users'] },
      { role: 'Product Designer', company: 'Airbnb', period: '2016 — 2019', bullets: ['Designed Experiences launch product; grew bookings 4x in 18 months'] },
    ],
    projects: [
      { name: 'Encore Design System', desc: 'Built Spotify\'s unified design system from scratch; adopted by 180+ designers across 40 products, saving ~1,200 design-hours/quarter.' },
      { name: 'Rider Safety Redesign', desc: 'End-to-end safety UX overhaul at Uber; shipped to 130M+ MAU, reduced safety-incident reports by 22%.' },
    ],
    skills: 'Figma · Sketch · Framer · Adobe XD · Principle · User Research · Design Systems · Prototyping · HTML/CSS',
    edu: 'BFA Graphic Design · Rhode Island School of Design, 2016',
    certs: 'NN/g UX Certification · IDEO Design Thinking',
  },
  {
    name: 'ALEX RIVERA', title: 'Senior Data Scientist', years: '7+ years',
    contact: 'alex.rivera@email.com · (206) 555-0127 · Seattle, WA',
    links: 'linkedin.com/in/arivera · github.com/arivera · medium.com/@arivera',
    summary: 'Senior Data Scientist with 7+ years building ML systems at Netflix & Lyft. PhD in Statistics from MIT. Built recommendation engines serving 230M users. Published 6 papers at NeurIPS & ICML.',
    experiences: [
      { role: 'Senior Data Scientist', company: 'Netflix', period: '2021 — Present', bullets: ['Owned Top-10 Rows recommender: +14% watch time for 230M subscribers', 'Shipped causal inference framework adopted across 40+ experiments/yr', 'Lead ML infra migration to Ray, cutting training time from 16h → 2h'] },
      { role: 'Data Scientist', company: 'Lyft', period: '2018 — 2021', bullets: ['Built ETA model: 18% more accurate than incumbent; $31M savings/yr', 'Launched surge-pricing optimization lifting GM by $46M annually'] },
      { role: 'ML Engineer', company: 'Zillow', period: '2016 — 2018', bullets: ['Productionized Zestimate v3: median error 4.5% → 2.1% in 14 months'] },
    ],
    projects: [
      { name: 'Top-10 Rows Recommender', desc: 'Built deep-learning recommendation model serving 230M Netflix subscribers; +14% watch time = ~$200M estimated revenue impact.' },
      { name: 'Causal Inference Framework', desc: 'Open-sourced internal experimentation toolkit; adopted by 12+ Netflix teams, running 40+ causal studies per year.' },
    ],
    skills: 'Python · PyTorch · TensorFlow · Scikit-learn · Ray · Spark · SQL · Snowflake · Airflow · Kubeflow · dbt',
    edu: 'Ph.D. Statistics · MIT, 2016 · B.S. Mathematics · Caltech, 2011',
    certs: 'NeurIPS 2023 Best Paper · Kaggle Grandmaster (Top 0.1%)',
  },
];

// ─── Resume Thumbnail ─────────────────────────────────────────────────────────
const ResumeThumbnail = ({ template, index }) => {
  const { user } = useAuth();
  const variant = index % 4;
  const d = RESUME_DATA[index % 4];
  const initials = d.name.split(' ').map(n => n.charAt(0)).join('');

  return (
    <div className="relative w-full aspect-[0.77] bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
      {variant === 0 && (
        <div className="flex h-full text-[4.5px] leading-[1.3]">
          <div className="w-[38%] p-2" style={{ background: template.color }}>
            <div className="w-9 h-9 rounded-full bg-white/25 mb-1.5 flex items-center justify-center text-white text-[8px] font-extrabold">{initials}</div>
            <div className="text-white font-extrabold text-[6px] leading-tight mb-0.5">{d.name}</div>
            <div className="text-white/80 text-[4px] mb-2 leading-tight">{d.title}</div>
            <div className="text-white/70 text-[3.5px] space-y-0.5 mb-2">
              <div>✉ {d.contact.split(' · ')[0]}</div>
              <div>📞 {d.contact.split(' · ')[1]}</div>
              <div>📍 {d.contact.split(' · ')[2]}</div>
              <div>🔗 {d.links.split(' · ')[0]}</div>
            </div>
            <div className="text-white font-bold text-[4.5px] border-t border-white/30 pt-1 mb-0.5">TECHNICAL SKILLS</div>
            <div className="text-white/80 text-[3.5px] leading-tight mb-2">{d.skills}</div>
            <div className="text-white font-bold text-[4.5px] border-t border-white/30 pt-1 mb-0.5">EDUCATION</div>
            <div className="text-white/80 text-[3.5px] leading-tight mb-2">{d.edu}</div>
            <div className="text-white font-bold text-[4.5px] border-t border-white/30 pt-1 mb-0.5">CERTIFICATIONS</div>
            <div className="text-white/80 text-[3.5px] leading-tight">{d.certs}</div>
          </div>
          <div className="flex-1 p-2 text-slate-800">
            <div className="font-extrabold text-[5.5px] mb-0.5" style={{ color: template.color }}>PROFESSIONAL SUMMARY</div>
            <div className="text-slate-700 text-[3.8px] leading-[1.4] mb-2">{d.summary}</div>
            <div className="font-extrabold text-[5.5px] mb-1" style={{ color: template.color }}>PROFESSIONAL EXPERIENCE</div>
            {d.experiences.map((e, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[4.5px] text-slate-900">{e.role}</div>
                  <div className="text-[3.5px] text-slate-500 font-semibold">{e.period}</div>
                </div>
                <div className="text-[4px] italic mb-0.5" style={{ color: template.color }}>{e.company}</div>
                {e.bullets.map((b, j) => <div key={j} className="text-slate-700 text-[3.8px] leading-[1.3] pl-1.5">• {b}</div>)}
              </div>
            ))}
            <div className="font-extrabold text-[5.5px] mb-1 mt-1" style={{ color: template.color }}>KEY PROJECTS</div>
            {d.projects.map((p, i) => (
              <div key={i} className="mb-1">
                <div className="font-bold text-[4.2px] text-slate-900">{p.name}</div>
                <div className="text-slate-700 text-[3.7px] leading-[1.3]">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 1 && (
        <div className="p-3 h-full text-[4.5px] leading-[1.3] bg-white">
          <div className="text-center pb-2 mb-2 border-b-2" style={{ borderColor: template.color }}>
            <div className="font-extrabold text-[9px] text-slate-900 tracking-wider">{d.name}</div>
            <div className="font-bold text-[4.5px] mt-0.5 tracking-wide" style={{ color: template.color }}>{d.title.toUpperCase()} · {d.years.toUpperCase()}</div>
            <div className="text-slate-500 text-[3.5px] mt-0.5">{d.contact}</div>
            <div className="text-slate-500 text-[3.5px]">{d.links}</div>
          </div>
          <div className="mb-2">
            <div className="font-extrabold text-[5px] tracking-wider pb-0.5 mb-1 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>PROFESSIONAL SUMMARY</div>
            <div className="text-slate-700 text-[3.8px] leading-[1.45]">{d.summary}</div>
          </div>
          <div className="mb-2">
            <div className="font-extrabold text-[5px] tracking-wider pb-0.5 mb-1 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>EXPERIENCE</div>
            {d.experiences.map((e, i) => (
              <div key={i} className="mb-1">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[4.2px] text-slate-900">{e.role}, <span className="font-semibold italic" style={{ color: template.color }}>{e.company}</span></div>
                  <div className="text-[3.5px] text-slate-500 font-semibold">{e.period}</div>
                </div>
                {e.bullets.map((b, j) => <div key={j} className="text-slate-700 text-[3.8px] leading-[1.3] pl-1.5">• {b}</div>)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-1.5">
            <div>
              <div className="font-extrabold text-[5px] pb-0.5 mb-0.5 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>EDUCATION</div>
              <div className="text-slate-700 text-[3.8px] leading-[1.35]">{d.edu}</div>
            </div>
            <div>
              <div className="font-extrabold text-[5px] pb-0.5 mb-0.5 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>CERTIFICATIONS</div>
              <div className="text-slate-700 text-[3.8px] leading-[1.35]">{d.certs}</div>
            </div>
          </div>
          <div>
            <div className="font-extrabold text-[5px] pb-0.5 mb-0.5 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>TECHNICAL SKILLS</div>
            <div className="text-slate-700 text-[3.8px] leading-[1.35]">{d.skills}</div>
          </div>
          <div className="mt-1.5">
            <div className="font-extrabold text-[5px] pb-0.5 mb-0.5 border-b" style={{ color: template.color, borderColor: template.color + '40' }}>KEY PROJECTS</div>
            {d.projects.map((p, i) => (
              <div key={i} className="mb-0.5">
                <div className="font-bold text-[4px] text-slate-900">{p.name}</div>
                <div className="text-slate-600 text-[3.7px] leading-[1.3]">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 2 && (
        <div className="h-full text-[4.5px] leading-[1.3] bg-white">
          <div className="h-14 px-3 py-2 flex items-end" style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}dd)` }}>
            <div className="text-white">
              <div className="font-extrabold text-[10px] tracking-tight leading-tight">{d.name}</div>
              <div className="text-[5px] text-white/90 mt-0.5 font-semibold">{d.title} · {d.years} experience</div>
              <div className="text-[3.5px] text-white/80 mt-0.5">{d.contact}</div>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-[1fr_100px] gap-2 mb-2">
              <div>
                <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>SUMMARY</div>
                <div className="text-slate-700 text-[3.8px] leading-[1.4]">{d.summary}</div>
              </div>
              <div>
                <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>EDUCATION</div>
                <div className="text-slate-700 text-[3.5px] leading-[1.3] mb-1">{d.edu}</div>
                <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>CERTS</div>
                <div className="text-slate-700 text-[3.5px] leading-[1.3]">{d.certs}</div>
              </div>
            </div>
            <div className="font-extrabold text-[5px] mb-1" style={{ color: template.color }}>WORK EXPERIENCE</div>
            {d.experiences.map((e, i) => (
              <div key={i} className="mb-1.5 pl-2 border-l-2" style={{ borderColor: template.color + '50' }}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[4.5px] text-slate-900">{e.role} · <span style={{ color: template.color }}>{e.company}</span></div>
                  <div className="text-[3.5px] text-slate-500">{e.period}</div>
                </div>
                {e.bullets.map((b, j) => <div key={j} className="text-slate-700 text-[3.8px] leading-[1.3]">• {b}</div>)}
              </div>
            ))}
            <div className="font-extrabold text-[5px] mb-0.5 mt-1" style={{ color: template.color }}>TECHNICAL SKILLS</div>
            <div className="text-slate-700 text-[3.8px] leading-[1.35]">{d.skills}</div>
            <div className="font-extrabold text-[5px] mb-0.5 mt-1" style={{ color: template.color }}>KEY PROJECTS</div>
            {d.projects.map((p, i) => (
              <div key={i} className="mb-0.5 pl-1.5 border-l" style={{ borderColor: template.color + '50' }}>
                <div className="font-bold text-[4px] text-slate-900">{p.name}</div>
                <div className="text-slate-600 text-[3.7px] leading-[1.3]">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 3 && (
        <div className="p-2.5 h-full text-[4.5px] leading-[1.3] bg-white">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[8px] font-extrabold flex-shrink-0" style={{ background: template.color }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[7px] text-slate-900 leading-tight">{d.name}</div>
              <div className="font-bold text-[4.5px]" style={{ color: template.color }}>{d.title}</div>
              <div className="text-slate-500 text-[3.5px] truncate">{d.contact}</div>
            </div>
          </div>
          <div className="mb-1.5">
            <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>ABOUT</div>
            <div className="text-slate-700 text-[3.8px] leading-[1.4]">{d.summary}</div>
          </div>
          <div className="mb-1.5">
            <div className="font-extrabold text-[5px] mb-1" style={{ color: template.color }}>EXPERIENCE</div>
            {d.experiences.map((e, i) => (
              <div key={i} className="relative mb-1.5 pl-2.5">
                <div className="absolute left-0 top-0.5 w-1.5 h-1.5 rounded-full" style={{ background: template.color }} />
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[4.3px] text-slate-900">{e.role}</div>
                  <div className="text-[3.3px] text-slate-500">{e.period}</div>
                </div>
                <div className="text-[4px] italic mb-0.5" style={{ color: template.color }}>{e.company}</div>
                {e.bullets.map((b, j) => <div key={j} className="text-slate-700 text-[3.7px] leading-[1.3]">• {b}</div>)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <div>
              <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>SKILLS</div>
              <div className="text-slate-700 text-[3.5px] leading-[1.35]">{d.skills}</div>
              <div className="font-extrabold text-[5px] mb-0.5 mt-1" style={{ color: template.color }}>CERTIFICATIONS</div>
              <div className="text-slate-700 text-[3.5px] leading-[1.35]">{d.certs}</div>
            </div>
            <div>
              <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>EDUCATION</div>
              <div className="text-slate-700 text-[3.5px] leading-[1.35]">{d.edu}</div>
            </div>
          </div>
          <div className="mt-1.5 pt-1 border-t border-slate-100">
            <div className="font-extrabold text-[5px] mb-0.5" style={{ color: template.color }}>KEY PROJECTS</div>
            {d.projects.map((p, i) => (
              <div key={i} className="mb-0.5 flex gap-1 items-start">
                <div className="font-bold text-[4px] text-slate-900 flex-shrink-0">{p.name}:</div>
                <div className="text-slate-600 text-[3.7px] leading-[1.3]">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
        <Link to={user ? '/builder' : '/signup'} className="px-4 py-2 bg-[#FF6B47] text-white rounded-full text-xs font-bold hover:bg-[#ff5630] flex items-center gap-1">
          Use Template <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

// ─── Inline brand logos (no external API, full color) ────────────────────────
function BrandLogo({ name }) {
  switch (name) {
    case 'Google':
      return (
        <span className="flex items-center select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </span>
      );
    case 'Microsoft':
      return (
        <span className="flex items-center gap-1.5 select-none">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="0"  y="0"  width="10" height="10" fill="#F25022"/>
            <rect x="12" y="0"  width="10" height="10" fill="#7FBA00"/>
            <rect x="0"  y="12" width="10" height="10" fill="#00A4EF"/>
            <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
          </svg>
          <span style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 22, fontWeight: 400, color: '#737373', letterSpacing: -0.3 }}>Microsoft</span>
        </span>
      );
    case 'Amazon':
      return (
        <span className="flex flex-col items-start select-none leading-none">
          <span style={{ fontFamily: 'Amazon Ember, Arial, sans-serif', fontSize: 26, fontWeight: 700, color: '#232F3E', letterSpacing: -0.5 }}>amazon</span>
          <svg viewBox="0 0 120 16" width="84" height="11" style={{ marginTop: -2 }}>
            <path d="M6 8 Q60 20 114 8" stroke="#FF9900" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
            <polygon points="110,4 118,8 110,12" fill="#FF9900"/>
          </svg>
        </span>
      );
    case 'TCS':
      return (
        <span className="flex flex-col items-start select-none leading-none">
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 900, color: '#002D72', letterSpacing: 1 }}>tcs</span>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 7, fontWeight: 600, color: '#002D72', letterSpacing: 0.5, lineHeight: 1 }}>TATA CONSULTANCY SERVICES</span>
        </span>
      );
    case 'Adobe':
      return (
        <span className="flex items-center gap-1.5 select-none">
          <svg width="28" height="28" viewBox="0 0 100 100">
            <polygon points="0,100 50,0 100,100" fill="#FF0000"/>
            <polygon points="0,100 50,0 50,100" fill="#FF0000" opacity="0.6"/>
          </svg>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 700, color: '#FF0000', letterSpacing: -0.3 }}>Adobe</span>
        </span>
      );
    case 'Infosys':
      return (
        <span className="select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 700, color: '#007CC2', letterSpacing: -0.3 }}>
          Infosys
        </span>
      );
    case 'Walmart':
      return (
        <span className="flex items-center gap-1.5 select-none">
          <svg width="26" height="26" viewBox="0 0 100 100">
            {[0,60,120,180,240,300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 18 * Math.cos(rad);
              const y1 = 50 + 18 * Math.sin(rad);
              const x2 = 50 + 40 * Math.cos(rad);
              const y2 = 50 + 40 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFC220" strokeWidth="12" strokeLinecap="round"/>;
            })}
          </svg>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 700, color: '#007DC6', letterSpacing: -0.3 }}>Walmart</span>
        </span>
      );
    case 'Deloitte':
      return (
        <span className="flex items-center gap-0.5 select-none">
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 700, color: '#1B1B1B', letterSpacing: -0.3 }}>Deloitte</span>
          <span style={{ color: '#86BC25', fontSize: 26, lineHeight: 1, marginBottom: -4 }}>.</span>
        </span>
      );
    case 'JP Morgan':
      return (
        <span className="select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, color: '#003087', letterSpacing: -0.3 }}>
          JPMorgan
        </span>
      );
    case 'Meta':
      return (
        <span className="select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 700, color: '#0668E1', letterSpacing: -0.5 }}>
          Meta
        </span>
      );
    case 'Spotify':
      return (
        <span className="flex items-center gap-1.5 select-none">
          <svg width="24" height="24" viewBox="0 0 168 168">
            <circle cx="84" cy="84" r="84" fill="#1ED760"/>
            <path d="M120 117c-2 3-5 4-8 2-22-13-49-16-81-9-3 1-6-1-7-4s1-6 4-7c35-8 65-4 90 10 3 2 4 5 2 8zm10-23c-2 4-6 5-10 3-25-15-63-20-93-11-4 1-8-1-9-5s1-8 5-9c34-10 76-5 105 13 4 2 5 6 3 9zm1-24C103 55 61 54 33 62c-5 1-9-2-10-6s2-9 6-10c32-9 77-7 107 13 4 2 5 7 3 11-2 3-7 5-11 3z" fill="white"/>
          </svg>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 700, color: '#1B1B1B', letterSpacing: -0.3 }}>Spotify</span>
        </span>
      );
    case 'Oracle':
      return (
        <span className="select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 700, color: '#C74634', letterSpacing: -0.3 }}>
          ORACLE
        </span>
      );
    default:
      return <span className="font-bold text-slate-700 text-xl select-none">{name}</span>;
  }
}

const COMPANY_NAMES = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Adobe', 'Infosys', 'Walmart', 'Deloitte', 'JP Morgan', 'Meta', 'Spotify', 'Oracle'];

// ─── Resume Upload Section ────────────────────────────────────────────────────
const UPLOAD_LS_KEY = 'ik_resume_uploaded';

const ResumeUploadSection = ({ user }) => {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [error, setError] = useState('');
  const [needEmail, setNeedEmail] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  // On mount: check if this user already uploaded
  React.useEffect(() => {
    const check = async () => {
      if (user?.id) {
        // Logged-in: check Supabase Storage for existing file under their user ID
        const sb = (await import('../lib/supabase')).default;
        const { data } = await sb.storage.from('resumes').list(user.id);
        if (data?.length > 0) setAlreadyUploaded(true);
      } else {
        // Guest: check localStorage
        if (localStorage.getItem(UPLOAD_LS_KEY)) setAlreadyUploaded(true);
      }
    };
    check();
  }, [user]);

  const uploadToSupabase = async (file, folderKey, contactEmail) => {
    setUploading(true);
    setError('');
    try {
      const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_');
      const path = `${folderKey}/${Date.now()}_${safeName}`;
      const sb = (await import('../lib/supabase')).default;
      const { error: upErr } = await sb.storage.from('resumes').upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      if (!user?.id) localStorage.setItem(UPLOAD_LS_KEY, '1');
      setDone(true);
    } catch (e) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (user?.id) {
      // Logged-in: store under user.id so it's tied to their account
      uploadToSupabase(file, user.id, user.email);
    } else {
      setPendingFile(file);
      setNeedEmail(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNeedEmail(false);
    // Guest: store under their email as folder key
    uploadToSupabase(pendingFile, email.trim().replace(/[^a-z0-9@._-]/gi, '_'), email.trim());
  };

  const points = [
    { icon: ScanText,          color: '#4F8EF7', bg: '#EEF4FF', title: 'We read your resume like a recruiter', desc: 'Skills, experience, role, seniority — every detail picked up instantly.' },
    { icon: Target,            color: '#FF6B47', bg: '#FFF3EE', title: 'Matched to roles you\'re built for',   desc: 'Not random listings — jobs that genuinely fit your profile.' },
    { icon: BriefcaseBusiness, color: '#0D6B4F', bg: '#E8F5F0', title: 'Curated by our team, not a bot',      desc: 'Real humans shortlist your top 5–10 matches personally.' },
    { icon: Send,              color: '#7C3AED', bg: '#F3EEFF', title: 'Delivered straight to you',           desc: 'No job board signups, no endless scrolling — just your list.' },
    { icon: TrendingUp,        color: '#F59E0B', bg: '#FFFBEB', title: 'Your next opportunity is out there',  desc: 'Let us find it while you focus on preparing to win the interview.' },
  ];

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#4F8EF7] text-xs font-bold uppercase tracking-wider mb-4">
            <Search className="w-3.5 h-3.5" /> Job Match
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            Upload your resume and<br />
            <span className="text-[#4F8EF7]">we'll find your next job.</span>
          </motion.h2>
          <motion.ul variants={stagger(0.08)} className="space-y-3 mb-8">
            {points.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.li key={title} variants={fadeUp} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{title}</div>
                  <div className="text-slate-500 text-sm leading-relaxed">{desc}</div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <button
              onClick={() => document.getElementById('resume-upload-input')?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F8EF7] hover:bg-[#3a7de8] text-white rounded-full font-bold transition-colors"
            >
              Upload my resume <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease }}>
          <div className="relative bg-gradient-to-br from-[#EEF4FF] via-[#F3EEFF] to-white rounded-3xl p-8 border border-slate-100 shadow-xl">


            <div className="relative bg-white rounded-2xl shadow-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Match</div>
                  <div className="text-lg font-black text-slate-900">Upload Resume</div>
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-11 h-11 rounded-2xl bg-[#EEF4FF] flex items-center justify-center"
                >
                  <FileText className="w-5 h-5 text-[#4F8EF7]" />
                </motion.div>
              </div>

              {(done || alreadyUploaded) ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    className="w-16 h-16 rounded-full bg-[#E8F5F0] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#0D6B4F]" />
                  </motion.div>
                  <div className="font-extrabold text-slate-900 text-lg mb-2">
                    {alreadyUploaded && !done ? 'Resume already submitted!' : 'Resume received!'}
                  </div>
                  <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                    {alreadyUploaded && !done
                      ? 'We already have your resume. Our team is working on finding your best matches.'
                      : 'Our team will personally match your top job opportunities and reach out shortly.'}
                  </p>
                </div>
              ) : needEmail ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#4F8EF7]" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">One last step</div>
                      <div className="text-slate-500 text-xs">Where should we send your job matches?</div>
                    </div>
                  </div>
                  <input
                    type="email" required placeholder="your@email.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]/30 focus:border-[#4F8EF7]"
                  />
                  <button type="submit" disabled={uploading}
                    className="w-full py-3 rounded-full bg-[#4F8EF7] hover:bg-[#3a7de8] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    {uploading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</>
                      : <>Find my jobs <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              ) : (
                <>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl cursor-pointer transition-all border-2 border-dashed ${dragging ? 'border-[#4F8EF7] bg-[#EEF4FF]' : 'border-slate-200 hover:border-[#4F8EF7] hover:bg-[#F8FAFF]'}`}
                  >
                    <input id="resume-upload-input" ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                    <div className="flex flex-col items-center justify-center py-8 px-6 text-center gap-3">
                      {uploading ? (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] rounded-full animate-spin" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">Uploading your resume…</div>
                            <div className="text-slate-400 text-xs mt-0.5">Almost there</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={dragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-[#4F8EF7]' : 'bg-[#EEF4FF]'}`}
                          >
                            <Upload className={`w-5 h-5 ${dragging ? 'text-white' : 'text-[#4F8EF7]'}`} />
                          </motion.div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm mb-0.5">
                              {dragging ? 'Drop it right here' : 'Drag & drop or click to browse'}
                            </div>
                            <div className="text-slate-400 text-xs">{dragging ? "We've got it from here" : 'Any resume format accepted'}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
                </>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

// ─── Landing page ─────────────────────────────────────────────────────────────
const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openPayment } = usePayment();

  const roadmapSteps = [
    { step: '01', icon: Target,   color: '#0D6B4F', bg: '#E8F5F0', border: '#BBE8D8', title: 'ATS Score',          sub: 'Expert Review',     desc: 'Our experts analyse your resume against top ATS systems and give you a detailed compatibility report with actionable fixes.',  cta: 'See How It Works', href: '/ats-checker' },
    { step: '02', icon: FileText, color: '#FF6B47', bg: '#FFF3EE', border: '#FECACA', title: 'Tailor to JD',       sub: 'Expert Tailoring',  desc: 'We rewrite your summary, skills, and bullets to perfectly match any job description — increasing your callback rate.',          cta: 'See How It Works', href: '/jd-tailor' },
    { step: '03', icon: Search,   color: '#4F8EF7', bg: '#EFF6FF', border: '#BFDBFE', title: 'Find Jobs',          sub: 'Curated Job List',  desc: 'We hand-pick live roles matched to your skills, salary, and location — so you apply to the right jobs, not all of them.',     cta: 'See How It Works', href: '/jobs' },
    { step: '04', icon: Award,    color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', title: 'Get Interview Calls', sub: 'Your Goal',         desc: 'Your optimised, recruiter-ready resume gets noticed. More callbacks, more interviews, more offers.',                           cta: 'Get Started',      href: user ? '/builder' : '/signup' },
  ];

  // Hero visual card configs
  const heroCards = [
    { template: mockTemplates[0], index: 0, pos: { top: 16, left: 16 },    zIndex: 10, rotate: -6, delay: 0.30, floatY: [0, -10, 0], floatDur: 5.0 },
    { template: mockTemplates[4], index: 2, pos: { top: 0,  right: 32 },   zIndex: 20, rotate:  3, delay: 0.45, floatY: [0,  -8, 0], floatDur: 4.2 },
    { template: mockTemplates[3], index: 3, pos: { bottom: 16, left: 64 }, zIndex: 30, rotate:  2, delay: 0.60, floatY: [0, -12, 0], floatDur: 5.8 },
    { template: mockTemplates[2], index: 1, pos: { bottom: 32, right: 0 }, zIndex: 20, rotate: -3, delay: 0.75, floatY: [0,  -7, 0], floatDur: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF3EE] via-[#FFFBF7] to-white pt-16 pb-20">
        {/* Animated ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#FF6B47] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-40 left-0 w-96 h-96 rounded-full bg-[#0F3D2E] blur-3xl pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column — staggered entrance */}
          <motion.div variants={stagger(0.12, 0.05)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                <div className="flex -space-x-1">
                  {mockTestimonials.slice(0, 4).map(t => (
                    <img key={t.name} src={t.avatar} alt={t.name} className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">⭐ 4.8 · 5,187 Reviews</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-5">
              Applying everywhere{' '}
              <span className="relative inline-block">
                <span className="relative z-10">but not getting</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FF6B47]/30 -z-0" />
              </span>{' '}
              interviews?
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed mb-7 max-w-xl">
              We optimize your resume for ATS, tailor it to the right jobs, and find real opportunities — so you can get more interview calls.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to={user ? '/builder' : '/signup'} className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg shadow-[#FF6B47]/20 hover:shadow-xl hover:shadow-[#FF6B47]/30 transition-shadow">
                  <FileText className="w-4 h-4" /> Build Your Resume
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-5 text-sm text-slate-500">
              {['Free to start', 'No credit card', 'ATS ready'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#0D6B4F]" strokeWidth={3} /> {t}
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F3D2E] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">1,000+ candidates</div>
                <div className="text-xs text-slate-500">landed interviews with us</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column — floating resume cards */}
          <div className="relative h-[520px] hidden lg:block">
            {heroCards.map(({ template, index, pos, zIndex, rotate, delay, floatY, floatDur }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, rotate }}
                animate={{ opacity: 1, y: 0, rotate }}
                transition={{ delay, duration: 0.8, type: 'spring', stiffness: 65, damping: 14 }}
                style={{ position: 'absolute', width: 224, zIndex, ...pos }}
              >
                <motion.div
                  animate={{ y: floatY }}
                  transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ResumeThumbnail template={template} index={index} />
                </motion.div>
              </motion.div>
            ))}

            {/* Floating ATS score badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 18 }}
              className="absolute top-52 left-1/2 -translate-x-1/2 z-40"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-slate-100"
              >
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="#E2E8F0" strokeWidth="4" fill="none" />
                    <circle cx="28" cy="28" r="24" stroke="#0D6B4F" strokeWidth="4" fill="none"
                      strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - 0.92)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900">92</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0D6B4F]">ATS SCORE</div>
                  <div className="text-sm font-semibold text-slate-900">Excellent Match</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY — infinite marquee ─────────────────────────────────── */}
      <section className="py-10 border-y border-slate-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by job seekers at
          </div>
          <div className="overflow-hidden">
            <div className="animate-marquee items-center">
              {[...COMPANY_NAMES, ...COMPANY_NAMES].map((name, i) => (
                <div key={i} className="flex-shrink-0 mx-10 flex items-center justify-center" style={{ minWidth: 100 }}>
                  <BrandLogo name={name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F8FBF9] overflow-hidden" id="roadmap">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> Your Success Roadmap
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              From resume to interview — we handle it all
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">
              InterviewKnockout guides you through every stage of the job search — from resume to offer.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Animated connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
              style={{ transformOrigin: 'left center' }}
              className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#0D6B4F] via-[#FF6B47] to-[#F59E0B] z-0"
            />

            <motion.div
              variants={stagger(0.15, 0.35)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10"
            >
              {roadmapSteps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center">
                    {/* Hoverable circle with popup */}
                    <motion.div
                      className="relative mb-5 cursor-pointer"
                      whileHover="hovered"
                      initial="rest"
                      animate="rest"
                    >
                      {/* Popup card — appears on hover */}
                      <motion.div
                        variants={{
                          rest:    { opacity: 0, y: 12, scale: 0.9,  pointerEvents: 'none' },
                          hovered: { opacity: 1, y:  0, scale: 1,    pointerEvents: 'auto' },
                        }}
                        transition={{ duration: 0.22, ease }}
                        style={{ transformOrigin: 'bottom center', bottom: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)' }}
                        className="absolute w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                            <Icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={2} />
                          </div>
                          <div className="text-left">
                            <div className="font-extrabold text-slate-900 text-sm">{s.title}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.sub}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 text-left">{s.desc}</p>
                        <Link to={s.href} className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: s.color }}>
                          {s.cta} <ArrowRight className="w-3 h-3" />
                        </Link>
                        {/* Arrow pointer */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"
                          style={{ bottom: '-6px' }}
                        />
                      </motion.div>

                      {/* Step circle */}
                      <motion.div
                        variants={{
                          rest:    { scale: 1,    boxShadow: '0 4px 16px rgba(0,0,0,0.10)' },
                          hovered: { scale: 1.12, boxShadow: `0 20px 50px ${s.color}45`    },
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                        className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
                        style={{ background: s.bg, borderColor: s.border }}
                      >
                        <Icon className="w-9 h-9" style={{ color: s.color }} strokeWidth={2} />
                      </motion.div>

                      <div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md"
                        style={{ background: s.color }}
                      >
                        {s.step}
                      </div>
                    </motion.div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.sub}</div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 px-2">{s.desc}</p>
                    <Link to={s.href} className="inline-flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full transition-all hover:shadow-md" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {s.cta} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center mt-10 gap-2 lg:hidden">
            {[0, 1, 2, 3].map(i => <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-[#0D6B4F]' : 'w-3 bg-slate-200'}`} />)}
          </div>
        </div>
      </section>

      {/* ── ATS SECTION ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden" id="ats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> ATS Optimized
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
              Resumes that beat ATS and get you noticed
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed mb-6">
              90% of resumes are rejected before a human reads them. InterviewKnockout ensures yours gets through — optimized for every major ATS system used by top companies.
            </motion.p>
            <motion.ul variants={stagger(0.07)} className="space-y-3 mb-8">
              {['Detailed ATS compatibility report with expert recommendations', 'Our experts rewrite your resume with the right keywords for your target role', 'Tested against Workday, Taleo, Greenhouse, and Lever', 'Receive your ATS-optimised resume within 24–48 hours'].map(item => (
                <motion.li key={item} variants={fadeUp} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#0D6B4F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3D2E] hover:bg-[#0b2e23] text-white rounded-full font-bold transition-colors">
                  See Plans &amp; Pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease }}
          >
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
                  {[['Keywords Match', 88, '#0D6B4F'], ['ATS Parse', 95, '#0D6B4F'], ['Skills Section', 90, '#0D6B4F'], ['Work Experience', 85, '#4F8EF7'], ['Quantifiable Impact', 78, '#4F8EF7']].map(([l, v, c]) => (
                    <AtsBar key={l} label={l} value={v} color={c} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── UPLOAD RESUME ────────────────────────────────────────────────── */}
      <ResumeUploadSection user={user} />

      {/* ── GET DISCOVERED ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-[#F8FBF9] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-3.5 h-3.5" /> Our Recruiter Network
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Get discovered by top companies & recruiters
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">
              Your optimized resume reaches hiring managers at the world's leading companies — so opportunities find you.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-center gap-16 mb-14">
            {[{ value: '200+', label: 'Hiring Companies' }, { value: '500+', label: 'Active Recruiters' }].map(s => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold text-[#0D6B4F] mb-2">{s.value}</div>
                <div className="text-slate-600 font-semibold text-lg">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="overflow-hidden">
            <div className="animate-marquee items-center" style={{ animationDuration: '22s' }}>
              {['Google', 'Microsoft', 'Amazon', 'Deloitte', 'TCS', 'Adobe', 'Infosys', 'Google', 'Microsoft', 'Amazon', 'Deloitte', 'TCS', 'Adobe', 'Infosys'].map((name, i) => (
                <div key={i} className="flex-shrink-0 mx-12 flex items-center justify-center" style={{ minWidth: 100 }}>
                  <BrandLogo name={name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Templates
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Pick a template and build your resume in minutes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">
              ATS-friendly, professionally designed resumes with customizable sections, fonts, colors, and layouts.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {mockTemplates.map((t, i) => (
              <motion.div key={t.id} variants={fadeUp}>
                <div onClick={() => navigate(user ? '/builder' : '/signup')} className="group cursor-pointer block">
                  <ResumeThumbnail template={t} index={i} />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }} className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to={user ? '/builder' : '/signup'} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold transition-colors">
                Browse All Templates <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 overflow-hidden" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#0F3D2E] text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" /> AI Features
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Fully equipped for the age of AI</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">The AI Resume Builder helps you create resumes faster and smarter.</motion.p>
          </motion.div>
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 gap-6"
          >
            {mockFeatures.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <motion.div
                  key={f.id}
                  variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.09)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-white rounded-2xl p-8 border border-slate-100"
                >
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-[#FF6B47] text-[#FF6B47]" />)}</div>
              <span className="text-sm font-bold text-slate-700">4.8/5 · 5,187 Reviews</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Loved by job seekers worldwide</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">Thousands of candidates get more interview calls every week using InterviewKnockout.</motion.p>
          </motion.div>
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {mockTestimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex gap-0.5 mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FF6B47] text-[#FF6B47]" />)}</div>
                <p className="text-slate-700 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#1a5c45] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-extrabold text-base">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role} · {t.daysAgo}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-[#FFF3EE]/40 to-white overflow-hidden" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FF6B47]/20">
              <Award className="w-3.5 h-3.5" /> Pricing
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Simple, transparent pricing</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600">Start free. Upgrade when you're ready to land interviews faster.</motion.p>
          </motion.div>
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {mockPricing.map(p => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative rounded-3xl p-8 border-2 ${p.highlighted ? 'bg-[#0F3D2E] border-[#0F3D2E] text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100'}`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider">{p.badge}</div>
                )}
                <div className="mb-5">
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[#FF6B47]">{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">{p.price === 0 ? 'Free' : `₹${p.price}`}</span>
                    {p.originalPrice && (
                      <span className={`text-base font-semibold line-through ${p.highlighted ? 'text-white/35' : 'text-slate-300'}`}>₹{p.originalPrice}</span>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider mt-1 mb-2 ${p.highlighted ? 'text-white/50' : 'text-slate-400'}`}>
                    {p.price === 0 ? 'No credit card required' : 'One-Time Payment · No Subscription'}
                  </div>
                  <p className={`text-sm ${p.highlighted ? 'text-white/80' : 'text-slate-600'}`}>{p.description}</p>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.slice(0, 5).map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[#FF6B47]' : 'text-[#0D6B4F]'}`} strokeWidth={3} />
                      <span className={p.highlighted ? 'text-white/90' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.price === 0 ? (
                  <Link to={user ? '/builder' : '/signup'} className="block text-center py-3 rounded-full font-bold transition-all bg-slate-900 hover:bg-slate-800 text-white">
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => openPayment(p.id)}
                    className={`w-full py-3 rounded-full font-bold transition-all ${p.highlighted ? 'bg-[#FF6B47] hover:bg-[#ff5630] text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                  >
                    {p.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center mt-8">
            <Link to="/pricing" className="text-sm font-semibold text-slate-700 hover:text-[#0F3D2E] inline-flex items-center gap-1">
              Compare all plans <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0F3D2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,71,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-extrabold text-white mb-3">Helping millions of job seekers land interviews</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 max-w-2xl mx-auto">InterviewKnockout is a modern resume platform that optimizes resumes, matches jobs, and generates more interview calls with AI and human experts.</motion.p>
          </motion.div>
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {mockStats.map(s => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, scale: 0.5, y: 24 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } } }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-extrabold text-[#FF6B47] mb-1">{s.value}</div>
                <div className="text-sm text-white/80">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-10"
          >
            Frequently asked questions
          </motion.h2>
          <motion.div
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-3"
          >
            {mockFaqs.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{f.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#0F3D2E] via-[#14543F] to-[#0F3D2E] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6B47] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-4"
          >
            <TrendingUp className="w-12 h-12 text-[#FF6B47] mx-auto" />
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Stop applying blindly — start getting interview calls
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join 1,000+ candidates who landed interviews with InterviewKnockout's expert resume service.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link to={user ? '/builder' : '/signup'} className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold text-lg shadow-2xl shadow-[#FF6B47]/30 transition-colors">
              Build Your Resume <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-white/70">
            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-[#FF6B47] text-[#FF6B47]" />)}</div>
            <span className="font-bold">5,187 Reviews</span>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
