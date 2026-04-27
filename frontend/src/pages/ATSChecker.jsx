import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { atsApi } from '../lib/api';
import { Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Sparkles, Download, RotateCw, ArrowRight, Target, Zap, TrendingUp, Check, X, Lock, Wand2 } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease } },
};

const stagger = (d = 0.07) => ({
  hidden: {},
  show:   { transition: { staggerChildren: d } },
});

function CircleScore({ score, size = 120 }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#0D6B4F' : score >= 60 ? '#4F8EF7' : '#F59E0B';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#F1F5F9" strokeWidth="8" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-bold tracking-wider text-slate-500">ATS SCORE</div>
        <div className="text-3xl font-black" style={{ color }}>{score}</div>
        <div className="text-[10px] font-bold" style={{ color }}>{score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : 'NEEDS WORK'}</div>
      </div>
    </div>
  );
}

const tabs = ['Score', 'Pros & Cons', 'Fixes'];

const ATS_SESSION_KEY = 'ik_ats_session';

const ATSChecker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPro = user && (user.plan === 'pro' || user.plan === 'premium');

  // Restore from sessionStorage on mount
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem(ATS_SESSION_KEY) || 'null'); } catch { return null; } })();

  const [file, setFile] = useState(saved?.file || null);
  const [fileObj, setFileObj] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(!!saved?.data);
  const [activeTab, setActiveTab] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [data, setData] = useState(saved?.data || null);
  const [error, setError] = useState('');
  const [targetRole, setTargetRole] = useState(saved?.targetRole || '');
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(saved?.finalTime || null);
  const [applyingFixes, setApplyingFixes] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleFileSelect = (f) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError('File too large. Maximum size is 5MB.'); return; }
    if (!f.name.match(/\.docx$/i)) { setError('Only .docx files are supported. Please upload a Word document.'); return; }
    setFileObj(f);
    setFile(f.name);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!fileObj) return;
    setAnalyzing(true);
    setElapsed(0);
    setFinalTime(null);
    setError('');
    const startRef = { t: Date.now() };
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.t) / 1000));
    }, 1000);
    try {
      const result = await atsApi.analyzeFile(fileObj, targetRole);
      const normalized = {
        ...result,
        score: Number.isFinite(Number(result.score)) ? Number(result.score) : 0,
        metrics: Array.isArray(result.metrics) ? result.metrics : [],
        keywords: Array.isArray(result.keywords) ? result.keywords : [],
        missingKeywords: result.missing_keywords || result.missingKeywords || [],
        pros: Array.isArray(result.pros) ? result.pros : [],
        cons: Array.isArray(result.cons) ? result.cons : [],
        fixes: Array.isArray(result.fixes) ? result.fixes : [],
      };
      const ft = Math.floor((Date.now() - startRef.t) / 1000);
      const originalResumeText = result.original_resume_text || '';
      setData(normalized);
      setAnalyzed(true);
      setActiveTab(0);
      setFinalTime(ft);
      sessionStorage.setItem(ATS_SESSION_KEY, JSON.stringify({ data: normalized, file: fileObj.name, targetRole, finalTime: ft, originalResumeText }));
    } catch (e) {
      if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
        setError('Analysis timed out. The AI is under heavy load — please try again in a moment.');
      } else {
        setError(e.response?.data?.detail || 'Analysis failed. Please try again.');
      }
    } finally {
      clearInterval(timerRef.current);
      setFinalTime(prev => prev ?? Math.floor((Date.now() - startRef.t) / 1000));
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalyzed(false);
    setFile(null);
    setFileObj(null);
    setData(null);
    setError('');
    setFinalTime(null);
    sessionStorage.removeItem(ATS_SESSION_KEY);
  };

  const handleApplyFixes = async () => {
    const session = (() => { try { return JSON.parse(sessionStorage.getItem(ATS_SESSION_KEY) || 'null'); } catch { return null; } })();
    const resumeText = session?.originalResumeText || '';
    if (!resumeText) {
      setError('Please re-analyze your resume once to enable this feature, then click Apply Fixes.');
      return;
    }
    setApplyingFixes(true);
    setError('');
    try {
      const result = await atsApi.applyFixes(resumeText, data.fixes, targetRole);
      sessionStorage.setItem('ik_ats_prefill', JSON.stringify({ resumeData: result, fromAts: true, score: data.score }));
      navigate('/builder');
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to apply fixes. Please try again.');
    } finally {
      setApplyingFixes(false);
    }
  };

  const priorityColor = (p) => p === 'HIGH' ? { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' } : p === 'MEDIUM' ? { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' } : { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
  const highCount = (data?.fixes || []).filter(f => f.priority === 'HIGH').length;
  const medCount  = (data?.fixes || []).filter(f => f.priority === 'MEDIUM').length;
  const lowCount  = (data?.fixes || []).filter(f => f.priority === 'LOW').length;

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[440px_1fr] gap-6">

          {/* LEFT PANEL */}
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Analysis
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              Check your resume's <span className="text-[#FF6B47]">ATS score</span> instantly
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-600 mb-6">
              Upload your resume and get a real ATS compatibility report with prioritized fixes — in seconds.
            </motion.p>

            {/* Upload zone */}
            <motion.div variants={fadeUp}>
              <motion.div
                animate={dragging ? { scale: 1.02, borderColor: '#FF6B47' } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFileSelect(f);
                }}
                onClick={() => !analyzed && document.getElementById('fileInput').click()}
                className={`rounded-2xl border-2 border-dashed p-7 text-center cursor-pointer transition-colors ${dragging ? 'border-[#FF6B47] bg-[#FFF3EE]' : file ? 'border-[#0D6B4F] bg-[#E8F5F0]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <input id="fileInput" type="file" accept=".docx" hidden onChange={(e) => handleFileSelect(e.target.files[0])} />
                <motion.div
                  className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${file ? 'bg-[#0D6B4F]' : 'bg-slate-100'}`}
                  animate={file ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {file ? <CheckCircle2 className="w-7 h-7 text-white" /> : <Upload className="w-6 h-6 text-slate-500" />}
                </motion.div>
                {file ? (
                  <>
                    <div className="font-bold text-slate-900 mb-1">{file}</div>
                    <div className="text-xs text-slate-500">{analyzed ? 'Analysis complete ✓' : 'Ready to analyze'}</div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-slate-900 mb-1">Drop resume here</div>
                    <div className="text-xs text-slate-500">or click to browse · Word document (.docx)</div>
                  </>
                )}
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4">
              {!analyzed ? (
                <>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Target role (optional) — e.g. Senior AI Engineer"
                    className="w-full px-4 py-2.5 mb-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B47] focus:ring-2 focus:ring-[#FF6B47]/10"
                  />
                  <motion.button
                    whileHover={fileObj && !analyzing ? { scale: 1.02, boxShadow: '0 12px 28px rgba(255,107,71,0.30)' } : {}}
                    whileTap={fileObj && !analyzing ? { scale: 0.97 } : {}}
                    disabled={!fileObj || analyzing}
                    onClick={handleAnalyze}
                    className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold transition-colors"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze My Resume →'}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" /> Analyze Different Resume
                </motion.button>
              )}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="mt-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-[#FF6B47] rounded-full animate-spin"></div>
                  AI is analyzing your resume...
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={stagger(0.06)} className="mt-5 grid grid-cols-3 gap-2">
              {[
                [analyzing ? `${elapsed}s` : finalTime !== null ? `${finalTime}s` : '—', 'Analysis Time'],
                ['20+', 'Feedback Points'],
                ['99%', 'Parse Success'],
              ].map(([v, l]) => (
                <motion.div
                  key={l}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                  className="bg-white rounded-xl border border-slate-100 p-3 text-center"
                >
                  <div className="text-xl font-extrabold text-[#FF6B47]">{v}</div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{l}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL */}
          <AnimatePresence mode="wait">
            {analyzed && data ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0,  scale: 1    }}
                exit={{    opacity: 0, x: 40, scale: 0.97 }}
                transition={{ duration: 0.45, ease }}
                className="bg-white rounded-2xl border border-slate-100 p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] text-white flex items-center justify-center font-extrabold">
                      {(file || 'R').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 truncate max-w-[220px]">{file || 'Your Resume'}</div>
                      <div className="text-xs text-slate-500">{targetRole || 'Target role not specified'}</div>
                    </div>
                  </div>
                  <CircleScore score={data.score} size={100} />
                </div>

                {/* Tab bar */}
                <div className="flex bg-slate-100 rounded-xl p-1 mb-6 relative">
                  {tabs.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(i)}
                      className={`relative flex-1 py-2 rounded-lg text-xs font-bold transition-colors z-10 ${activeTab === i ? 'text-[#FF6B47]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {activeTab === i && (
                        <motion.div
                          layoutId="ats-tab-bg"
                          className="absolute inset-0 bg-white rounded-lg shadow"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{t}</span>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div key="tab0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
                      <div className={`p-4 rounded-xl border mb-5 ${data.score >= 80 ? 'bg-[#E8F5F0] border-[#BBE8D8]' : data.score >= 60 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${data.score >= 80 ? 'text-[#0D6B4F]' : data.score >= 60 ? 'text-blue-600' : 'text-amber-600'}`} />
                          <div>
                            <div className={`font-bold text-sm mb-1 ${data.score >= 80 ? 'text-[#0D6B4F]' : data.score >= 60 ? 'text-blue-900' : 'text-amber-900'}`}>
                              {data.verdict || (data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : 'Needs Improvement')}
                            </div>
                            <div className="text-xs text-slate-700">{(data.cons && data.cons[0]) || 'Review your resume for optimization opportunities.'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Metric bars — animate width */}
                      <div className="space-y-3 mb-5">
                        {(data.metrics || []).map((m, idx) => (
                          <div key={m.label}>
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                              <span>{m.label}</span><span>{m.score}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${m.score}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.08, ease }}
                                style={{ background: m.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8]">
                          <div className="text-xs font-bold text-[#0D6B4F] mb-2">✅ KEYWORDS FOUND</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(data.keywords || []).map((k, i) => (
                              <motion.span key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                                className="px-2 py-1 rounded-md bg-white text-[#0D6B4F] text-xs font-semibold border border-[#BBE8D8]">{k}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                          <div className="text-xs font-bold text-red-600 mb-2">❌ MISSING HIGH-VALUE KEYWORDS</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(data.missingKeywords || data.missing_keywords || []).map((k, i) => (
                              <motion.span key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                                className="px-2 py-1 rounded-md bg-white text-red-600 text-xs font-semibold border border-red-100">{k}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(1)}
                        className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold hover:shadow-lg flex items-center justify-center gap-2 transition-shadow">
                        View Pros & Cons <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div key="tab1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}
                      className="space-y-5">
                      <div>
                        <div className="text-xs font-bold text-[#0D6B4F] mb-3">✅ STRENGTHS ({(data.pros || []).length})</div>
                        <motion.ul variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-2">
                          {(data.pros || []).map((p, i) => (
                            <motion.li key={i} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease } } }}
                              className="flex items-start gap-2 p-3 rounded-lg bg-[#E8F5F0]/50 border border-[#BBE8D8]/50 text-sm text-slate-700">
                              <Check className="w-4 h-4 text-[#0D6B4F] flex-shrink-0 mt-0.5" strokeWidth={3} />{p}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-red-600 mb-3">❌ ISSUES FOUND ({(data.cons || []).length})</div>
                        <motion.ul variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-2">
                          {(data.cons || []).map((c, i) => (
                            <motion.li key={i} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease } } }}
                              className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-slate-700">
                              <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={3} />{c}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(2)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold hover:shadow-lg flex items-center justify-center gap-2 transition-shadow">
                        See AI Fixes <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div key="tab2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {[[highCount, 'Critical', '#EF4444', '#FEF2F2'], [medCount, 'Medium', '#F59E0B', '#FFFBEB'], [lowCount, 'Low', '#64748B', '#F8FAFC']].map(([v, l, c, bg], i) => (
                          <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease }}
                            className="p-3 rounded-xl text-center border" style={{ background: bg, borderColor: c + '33' }}>
                            <div className="text-2xl font-extrabold" style={{ color: c }}>{v}</div>
                            <div className="text-[10px] font-bold uppercase" style={{ color: c }}>{l} Priority</div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div variants={stagger(0.05)} initial="hidden" animate="show" className="space-y-2.5 mb-5">
                        {(data.fixes || []).map((f, i) => {
                          const pc = priorityColor(f.priority);
                          return (
                            <motion.div key={i}
                              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } } }}
                              className="p-4 rounded-xl border" style={{ borderColor: pc.border, background: pc.bg }}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white" style={{ background: pc.text }}>{f.priority}</span>
                                <span className="text-xs font-bold text-slate-700">{f.section}</span>
                              </div>
                              <div className="text-sm text-slate-700">{f.fix}</div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                      {isPro ? (
                        (data?.fixes?.length > 0) ? (
                          <div className="p-4 rounded-2xl bg-[#E8F5F0] border border-[#BBE8D8]">
                            <div className="flex items-center gap-2 mb-1">
                              <Wand2 className="w-4 h-4 text-[#0D6B4F]" />
                              <div className="text-sm font-bold text-[#0F3D2E]">Apply All Fixes to Your Resume</div>
                            </div>
                            <p className="text-xs text-slate-600 mb-3">AI will apply every fix above — rewrite bullets, add keywords, improve summary — and open your upgraded resume in the builder.</p>
                            <motion.button
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={handleApplyFixes}
                              disabled={applyingFixes}
                              className="w-full py-2.5 rounded-xl bg-[#0F3D2E] hover:bg-[#1a5c45] disabled:bg-slate-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                              {applyingFixes ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying fixes...</>
                              ) : (
                                <><Wand2 className="w-4 h-4" /> Apply All {data?.fixes?.length} Fixes →</>
                              )}
                            </motion.button>
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-[#E8F5F0] border border-[#BBE8D8] text-center">
                            <div className="text-3xl mb-2">🎉</div>
                            <div className="font-bold text-[#0F3D2E] text-sm mb-1">Your resume is ATS-ready!</div>
                            <p className="text-xs text-slate-600">No fixes needed — your resume scored {data?.score}/100. It's already well-optimised for ATS systems.</p>
                          </div>
                        )
                      ) : (
                        <div className="p-5 rounded-2xl border-2 border-dashed border-[#FF6B47]/30 bg-[#FFF3EE]/50 text-center">
                          <div className="w-10 h-10 rounded-full bg-[#FFF3EE] flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-5 h-5 text-[#FF6B47]" />
                          </div>
                          <div className="font-bold text-slate-900 text-sm mb-1">Auto-Fix Requires Pro</div>
                          <p className="text-xs text-slate-500 mb-3">You can see all issues above — upgrade to Pro to auto-apply fixes with one click.</p>
                          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/pricing" className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#FF6B47] hover:bg-[#ff5630] text-white text-xs font-bold rounded-full transition-colors">
                              Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-5"
                >
                  <Target className="w-9 h-9 text-slate-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Your ATS report will appear here</h3>
                <p className="text-sm text-slate-500 max-w-sm">Upload your resume on the left and click "Analyze" to get a comprehensive report with prioritized fixes.</p>
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-md w-full">
                  {[{i:Target,t:'Score'},{i:Zap,t:'Fixes'},{i:TrendingUp,t:'Improve'}].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1, ease }}
                      className="p-3 rounded-xl bg-slate-50 text-center">
                      <s.i className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-slate-600">{s.t}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
