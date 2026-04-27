import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { mockSampleJD } from '../mock';
import { jdApi } from '../lib/api';
import { FileText, Target, Briefcase, Sparkles, ArrowRight, Check, Download, RotateCw, X, Edit3, Zap, Upload, Lock } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const stagger = (d = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: d } },
});

function MatchRing({ score, size = 100 }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#0D6B4F' : score >= 75 ? '#4F8EF7' : '#F59E0B';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#F1F5F9" strokeWidth="6" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[9px] font-bold tracking-wider text-slate-500">JD MATCH</div>
        <div className="text-2xl font-black" style={{ color }}>{score}%</div>
        <div className="text-[9px] font-bold" style={{ color }}>EXCELLENT</div>
      </div>
    </div>
  );
}

const tabs = ['JD Match', 'Changes Made', 'Preview', 'Download'];

const JD_SESSION_KEY = 'ik_jd_session';

const JDTailor = () => {
  const { user } = useAuth();
  const isPro = user && (user.plan === 'pro' || user.plan === 'premium');

  const saved = (() => { try { return JSON.parse(sessionStorage.getItem(JD_SESSION_KEY) || 'null'); } catch { return null; } })();

  const [jd, setJd] = useState(saved?.jd || '');
  const [tailoring, setTailoring] = useState(false);
  const [tailored, setTailored] = useState(!!saved?.data);
  const [activeTab, setActiveTab] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(saved?.resumeFileName || null);
  const [data, setData] = useState(saved?.data || null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleTailor = async () => {
    if (jd.trim().length < 50) return;
    if (!resumeFile) { setError('Please upload your resume first'); return; }
    setTailoring(true);
    setError('');
    try {
      const result = await jdApi.tailorFile(resumeFile, jd);
      const normalized = {
        candidateName: result.candidate_name || 'Your Name',
        matchScore: result.match_score || result.matchScore || 0,
        keywordsAdded: result.keywords_added || result.keywordsAdded || [],
        keywordsPresent: result.keywords_present || result.keywordsPresent || [],
        sectionsUpdated: result.sections_updated || result.sectionsUpdated || [],
        unchangedSections: result.unchanged_sections || result.unchangedSections || [],
        tailoredSummary: result.tailored_summary || '',
        tailoredSkills: result.tailored_skills || [],
        jobTitle: result.job_title || 'Job Title',
        company: result.company || '',
        originalResumeText: result.original_resume_text || '',
      };
      setData(normalized);
      setTailored(true);
      setActiveTab(0);
      sessionStorage.setItem(JD_SESSION_KEY, JSON.stringify({ data: normalized, jd, resumeFileName: resumeFile.name }));
    } catch (e) {
      if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
        setError('Analysis timed out. The AI is under heavy load — please try again in a moment.');
      } else {
        const detail = e.response?.data?.detail || '';
        setError(detail || 'Tailoring failed. Please try again.');
      }
    } finally {
      setTailoring(false);
    }
  };

  const loadSample = () => setJd(mockSampleJD);
  const reset = () => {
    setTailored(false);
    setJd('');
    setData(null);
    setError('');
    setResumeFileName(null);
    sessionStorage.removeItem(JD_SESSION_KEY);
  };

  const SKIP_SECTIONS = new Set([
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'CAREER OBJECTIVE',
    'KEY SKILLS', 'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'CORE SKILLS',
  ]);

  const parseOriginalSections = (text) => {
    const lines = (text || '').split('\n');
    const sections = [];
    let currentTitle = null;
    let currentLines = [];
    lines.forEach(line => {
      const t = line.trim();
      if (!t) return;
      const isHeader = t === t.toUpperCase() && t.length >= 3 && t.length <= 60 && /^[A-Z]/.test(t) && t.replace(/[\s\-\/]/g, '').length > 2;
      if (isHeader) {
        if (currentTitle) sections.push({ title: currentTitle, content: currentLines.join('\n') });
        currentTitle = t;
        currentLines = [];
      } else {
        currentLines.push(t);
      }
    });
    if (currentTitle) sections.push({ title: currentTitle, content: currentLines.join('\n') });
    return sections;
  };

  const downloadDocx = async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const { default: api } = await import('../lib/api');
      const res = await api.post('/jd/download-docx', {
        candidate_name: data.candidateName,
        job_title: data.jobTitle,
        company: data.company,
        tailored_summary: data.tailoredSummary,
        tailored_skills: data.tailoredSkills,
        original_resume_text: data.originalResumeText,
      }, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data.jobTitle || 'tailored-resume').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isPro) {
    return (
      <div className="min-h-screen bg-slate-50 overflow-hidden">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div
            className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-[#FFF3EE] flex items-center justify-center mx-auto mb-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock className="w-9 h-9 text-[#FF6B47]" />
            </motion.div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              Pro Feature
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">JD Tailoring</h1>
            <p className="text-slate-600 mb-2">AI rewrites your resume to match any job description — keywords, skills, tone, and priorities aligned automatically.</p>
            <p className="text-slate-500 text-sm mb-8">This feature is available on the <span className="font-bold text-[#FF6B47]">Pro plan</span> and above.</p>
            <motion.div
              variants={stagger(0.07)} initial="hidden" animate="show"
              className="grid grid-cols-2 gap-4 mb-8 text-left"
            >
              {['Keyword alignment', 'Section-by-section rewrites', 'JD match score', 'Download tailored resume'].map(f => (
                <motion.div key={f} variants={fadeUp} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#FFF3EE] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#FF6B47]" strokeWidth={3} />
                  </div>
                  {f}
                </motion.div>
              ))}
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6B47] hover:bg-[#ff5630] text-white rounded-full font-bold shadow-lg shadow-[#FF6B47]/25 transition-colors">
                Upgrade to Pro <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="mt-4">
              <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 font-medium">← Back to Dashboard</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[480px_1fr] gap-6">

          {/* LEFT PANEL */}
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-3.5 h-3.5" /> JD Tailoring
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              Tailor resume to <span className="text-[#FF6B47]">job description</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-600 mb-6">
              AI aligns your ATS resume to the exact JD — keywords, skills, tone, and priorities matched automatically.
            </motion.p>

            {/* Resume Upload */}
            <motion.div variants={fadeUp}>
              <input id="resumeFileInput" type="file" accept=".docx" hidden onChange={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) { setError('File too large. Maximum size is 5MB.'); return; }
                if (!f.name.match(/\.docx$/i)) { setError('Only .docx files are supported. Please upload a Word document.'); return; }
                setResumeFile(f);
                setResumeFileName(f.name);
                setError('');
              }} />
              <motion.div
                onClick={() => !tailored && document.getElementById('resumeFileInput').click()}
                whileHover={{ borderColor: resumeFileName ? '#0D6B4F' : '#FF6B47' }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl border-2 ${resumeFileName ? 'border-[#0D6B4F]' : 'border-dashed border-slate-200'} p-4 mb-4 flex items-center gap-3 cursor-pointer`}
              >
                <motion.div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold ${resumeFileName ? 'bg-[#0D6B4F]' : 'bg-slate-300'}`}
                  animate={resumeFileName ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {resumeFileName ? <Check className="w-5 h-5" strokeWidth={3} /> : <Upload className="w-5 h-5" />}
                </motion.div>
                <div className="flex-1 min-w-0">
                  {resumeFileName ? (
                    <>
                      <div className="font-bold text-slate-900 text-sm truncate">{resumeFileName}</div>
                      <div className="text-xs text-slate-500">{resumeFile ? 'Ready to tailor' : 'Saved — re-upload to re-analyze'}</div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-slate-700 text-sm">Upload Your Resume</div>
                      <div className="text-xs text-slate-500">Word document (.docx)</div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Paste Job Description
                </label>
                {!jd && (
                  <button onClick={loadSample} className="text-xs text-[#FF6B47] font-semibold hover:underline">Load sample JD</button>
                )}
              </div>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder={"Paste the full job description here...\n\nInclude requirements, responsibilities, and qualifications for best results."}
                rows={12}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B47] focus:ring-2 focus:ring-[#FF6B47]/10 resize-none transition"
              />
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>{jd.length} characters</span>
                <span className={jd.length >= 50 ? 'text-[#0D6B4F] font-bold' : ''}>
                  {jd.length >= 50 ? '✓ Ready to tailor' : `Need ${50 - jd.length} more chars`}
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4">
              {!tailored ? (
                <motion.button
                  disabled={jd.length < 50 || !resumeFile || tailoring}
                  onClick={handleTailor}
                  whileHover={jd.length >= 50 && resumeFile && !tailoring ? { scale: 1.02, boxShadow: '0 12px 28px rgba(255,107,71,0.28)' } : {}}
                  whileTap={jd.length >= 50 && resumeFile && !tailoring ? { scale: 0.97 } : {}}
                  className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {tailoring ? 'Tailoring your resume...' : (<><Sparkles className="w-4 h-4" /> Tailor Resume Now</>)}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" /> Try Different JD
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
              <AnimatePresence>
                {tailoring && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-2 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-slate-200 border-t-[#FF6B47] rounded-full animate-spin"></div>
                    AI is tailoring your resume to this JD...
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL */}
          <AnimatePresence mode="wait">
            {tailored && data ? (
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
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tailored For</div>
                    <div className="font-bold text-slate-900 mt-0.5">{data.jobTitle}</div>
                    <div className="text-xs text-slate-500">{data.company || 'Matched to your job description'}</div>
                  </div>
                  <MatchRing score={data.matchScore} />
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
                          layoutId="jd-tab-bg"
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
                    <motion.div key="t0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
                      <div className={`p-4 rounded-xl border mb-5 ${data.matchScore >= 85 ? 'bg-[#E8F5F0] border-[#BBE8D8]' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex items-start gap-2">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${data.matchScore >= 85 ? 'text-[#0D6B4F]' : 'text-blue-600'}`} strokeWidth={3} />
                          <div>
                            <div className={`font-bold text-sm mb-1 ${data.matchScore >= 85 ? 'text-[#0D6B4F]' : 'text-blue-900'}`}>
                              {data.matchScore >= 85 ? 'Excellent Match' : data.matchScore >= 65 ? 'Good Match' : 'Partial Match'} — {data.matchScore}% alignment
                            </div>
                            <div className="text-xs text-slate-700">
                              Your resume has been aligned with this JD. {data.keywordsAdded.length} new keywords added, {data.sectionsUpdated.length} sections updated.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-[#FFF3EE] border border-[#FF6B47]/20">
                          <div className="text-xs font-bold text-[#FF6B47] mb-2">➕ KEYWORDS ADDED ({data.keywordsAdded.length})</div>
                          <div className="flex flex-wrap gap-1.5">
                            {data.keywordsAdded.map((k, i) => (
                              <motion.span key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                                className="px-2 py-1 rounded-md bg-white text-[#FF6B47] text-xs font-semibold border border-[#FF6B47]/30">{k}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8]">
                          <div className="text-xs font-bold text-[#0D6B4F] mb-2">✓ ALREADY PRESENT ({data.keywordsPresent.length})</div>
                          <div className="flex flex-wrap gap-1.5">
                            {data.keywordsPresent.map((k, i) => (
                              <motion.span key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                                className="px-2 py-1 rounded-md bg-white text-[#0D6B4F] text-xs font-semibold border border-[#BBE8D8]">{k}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(1)}
                        className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                        View Changes Made <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div key="t1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}
                      className="space-y-3">
                      <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">✏️ Sections Updated ({data.sectionsUpdated.length})</div>
                      <motion.div variants={stagger(0.07)} initial="hidden" animate="show">
                        {data.sectionsUpdated.map((s, i) => (
                          <motion.div key={i}
                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } } }}
                            whileHover={{ borderColor: '#FF6B47', borderOpacity: 0.4 }}
                            className="p-4 rounded-xl bg-white border border-slate-100 transition-colors mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Edit3 className="w-4 h-4 text-[#FF6B47]" />
                              <span className="font-bold text-slate-900 text-sm">{s.section}</span>
                            </div>
                            <div className="text-sm text-slate-700">{s.change}</div>
                          </motion.div>
                        ))}
                      </motion.div>
                      <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-6 mb-2">✓ Preserved ({data.unchangedSections.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {data.unchangedSections.map((s, i) => (
                          <motion.div key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, type: 'spring', stiffness: 400 }}
                            className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-100">{s}
                          </motion.div>
                        ))}
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(2)}
                        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                        Preview Resume <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div key="t2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tailored Resume Preview</div>
                      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-sm leading-relaxed max-h-[520px] overflow-y-auto">
                        {/* Name + title */}
                        <div className="border-b-2 border-[#0F3D2E] pb-3 mb-4">
                          <div className="text-xl font-extrabold text-slate-900">{data.candidateName}</div>
                          {data.jobTitle && (
                            <div className="text-sm font-bold text-[#0F3D2E] mt-0.5">
                              {data.jobTitle}{data.company ? ` · ${data.company}` : ''}
                            </div>
                          )}
                        </div>
                        {/* Tailored summary */}
                        <div className="mb-4">
                          <div className="text-xs font-extrabold text-[#0F3D2E] uppercase tracking-wider mb-1.5">Professional Summary</div>
                          <p className="text-slate-700 leading-relaxed">{data.tailoredSummary}</p>
                        </div>
                        {/* Tailored skills */}
                        <div className="mb-4">
                          <div className="text-xs font-extrabold text-[#0F3D2E] uppercase tracking-wider mb-1.5">Key Skills</div>
                          <p className="text-slate-700">{(data.tailoredSkills || []).join(' · ')}</p>
                        </div>
                        {/* All other original sections */}
                        {parseOriginalSections(data.originalResumeText)
                          .filter(s => !SKIP_SECTIONS.has(s.title))
                          .map((s, i) => (
                            <div key={i} className="mb-4">
                              <div className="text-xs font-extrabold text-[#0F3D2E] uppercase tracking-wider mb-1.5">{s.title}</div>
                              <div className="text-slate-700 whitespace-pre-line">{s.content}</div>
                            </div>
                          ))
                        }
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(3)}
                        className="w-full mt-4 py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] text-white font-bold flex items-center justify-center gap-2 transition-colors">
                        <Download className="w-4 h-4" /> Go to Download
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === 3 && (
                    <motion.div key="t3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}
                      className="text-center">
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-[#E8F5F0] mx-auto mb-4 flex items-center justify-center"
                      >
                        <Check className="w-9 h-9 text-[#0D6B4F]" strokeWidth={3} />
                      </motion.div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">Tailored Resume Ready!</h3>
                      <p className="text-sm text-slate-600 mb-1">Tailored for <span className="font-bold text-slate-800">{data.jobTitle}</span>{data.company ? ` at ${data.company}` : ''}</p>
                      <p className="text-sm text-slate-500 mb-6">Match score: <span className="font-bold text-[#0D6B4F]">{data.matchScore}%</span></p>
                      <div className="bg-slate-50 rounded-xl p-4 mb-5 text-left text-xs text-slate-600 space-y-1.5">
                        <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0D6B4F]" strokeWidth={3} /> Professional Summary tailored to JD</div>
                        <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0D6B4F]" strokeWidth={3} /> Key Skills reordered & updated</div>
                        <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0D6B4F]" strokeWidth={3} /> {data.keywordsAdded.length} new keywords added</div>
                        <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0D6B4F]" strokeWidth={3} /> All other sections preserved as-is</div>
                      </div>
                      <motion.button
                        whileHover={!downloading ? { scale: 1.02, boxShadow: '0 12px 28px rgba(255,107,71,0.28)' } : {}}
                        whileTap={!downloading ? { scale: 0.97 } : {}}
                        onClick={downloadDocx}
                        disabled={downloading}
                        className="w-full py-3.5 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-300 text-white font-bold flex items-center justify-center gap-2 transition-colors mb-4"
                      >
                        <Download className="w-4 h-4" />
                        {downloading ? 'Generating .docx...' : 'Download Tailored Resume (.docx)'}
                      </motion.button>
                      <a href="/jobs" className="text-sm text-[#0F3D2E] font-semibold hover:underline">Next → Find matching jobs</a>
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
                  <Briefcase className="w-9 h-9 text-slate-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Your tailored resume will appear here</h3>
                <p className="text-sm text-slate-500 max-w-sm">Paste a job description on the left and click "Tailor Resume" to see AI-powered alignment with keywords, skills, and priorities.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JDTailor;
