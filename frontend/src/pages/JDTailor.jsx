import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { mockJDTailorResult, mockSampleJD } from '../mock';
import { FileText, Target, Briefcase, Sparkles, ArrowRight, Check, Download, RotateCw, X, Edit3, Zap } from 'lucide-react';

function MatchRing({ score, size = 100 }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#0D6B4F' : score >= 75 ? '#4F8EF7' : '#F59E0B';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#F1F5F9" strokeWidth="6" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
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

const JDTailor = () => {
  const [jd, setJd] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [tailored, setTailored] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const data = mockJDTailorResult;

  const handleTailor = () => {
    if (jd.trim().length < 50) return;
    setTailoring(true);
    setTimeout(() => { setTailoring(false); setTailored(true); setActiveTab(0); }, 2400);
  };

  const loadSample = () => setJd(mockSampleJD);
  const reset = () => { setTailored(false); setJd(''); };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[480px_1fr] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-3.5 h-3.5" /> JD Tailoring
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              Tailor resume to <span className="text-[#FF6B47]">job description</span>
            </h1>
            <p className="text-slate-600 mb-6">AI aligns your ATS resume to the exact JD — keywords, skills, tone, and priorities matched automatically.</p>

            {/* Resume Loaded Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] text-white flex items-center justify-center font-extrabold">N</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0D6B4F]" strokeWidth={3} />
                  <span className="font-bold text-slate-900 text-sm">ATS Resume Loaded</span>
                </div>
                <div className="text-xs text-slate-500 truncate">Nithin_ATS_Optimized.docx · Score: 88/100</div>
              </div>
              <div className="px-2 py-1 rounded-full bg-[#E8F5F0] text-[#0D6B4F] text-[10px] font-bold">Phase 1 ✓</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4">
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
                placeholder="Paste the full job description here...\n\nInclude requirements, responsibilities, and qualifications for best results."
                rows={12}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B47] focus:ring-2 focus:ring-[#FF6B47]/10 resize-none transition"
              />
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>{jd.length} characters</span>
                <span className={jd.length >= 50 ? 'text-[#0D6B4F] font-bold' : ''}>
                  {jd.length >= 50 ? '✓ Ready to tailor' : `Need ${50 - jd.length} more chars`}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {!tailored ? (
                <button disabled={jd.length < 50 || tailoring} onClick={handleTailor} className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                  {tailoring ? 'Tailoring your resume...' : (<><Sparkles className="w-4 h-4" /> Tailor Resume Now</>)}
                </button>
              ) : (
                <button onClick={reset} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <RotateCw className="w-4 h-4" /> Try Different JD
                </button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          {tailored ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tailored For</div>
                  <div className="font-bold text-slate-900 mt-0.5">Senior Generative AI Engineer</div>
                  <div className="text-xs text-slate-500">Pfizer Digital · Healthcare AI</div>
                </div>
                <MatchRing score={data.matchScore} />
              </div>
              <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                {tabs.map((t, i) => (
                  <button key={t} onClick={() => setActiveTab(i)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === i ? 'bg-white text-[#FF6B47] shadow' : 'text-slate-500'}`}>{t}</button>
                ))}
              </div>

              {activeTab === 0 && (
                <div>
                  <div className="p-4 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8] mb-5">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#0D6B4F] flex-shrink-0 mt-0.5" strokeWidth={3} />
                      <div>
                        <div className="font-bold text-[#0D6B4F] text-sm mb-1">Excellent Match — 94% alignment</div>
                        <div className="text-xs text-slate-700">Your resume is strongly aligned with this JD. All critical keywords, skills, and responsibilities have been addressed.</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-xl bg-[#FFF3EE] border border-[#FF6B47]/20">
                      <div className="text-xs font-bold text-[#FF6B47] mb-2">➕ KEYWORDS ADDED ({data.keywordsAdded.length})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.keywordsAdded.map(k => <span key={k} className="px-2 py-1 rounded-md bg-white text-[#FF6B47] text-xs font-semibold border border-[#FF6B47]/30">{k}</span>)}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8]">
                      <div className="text-xs font-bold text-[#0D6B4F] mb-2">✓ ALREADY PRESENT ({data.keywordsPresent.length})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.keywordsPresent.map(k => <span key={k} className="px-2 py-1 rounded-md bg-white text-[#0D6B4F] text-xs font-semibold border border-[#BBE8D8]">{k}</span>)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab(1)} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold flex items-center justify-center gap-2">
                    View Changes Made <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">✏️ Sections Updated ({data.sectionsUpdated.length})</div>
                  {data.sectionsUpdated.map((s, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 hover:border-[#FF6B47]/30 transition">
                      <div className="flex items-center gap-2 mb-2">
                        <Edit3 className="w-4 h-4 text-[#FF6B47]" />
                        <span className="font-bold text-slate-900 text-sm">{s.section}</span>
                      </div>
                      <div className="text-sm text-slate-700">{s.change}</div>
                    </div>
                  ))}
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-6 mb-2">✓ Preserved ({data.unchangedSections.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {data.unchangedSections.map(s => (
                      <div key={s} className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-100">{s}</div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab(2)} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold flex items-center justify-center gap-2">
                    Preview Resume <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    <div className="text-xs font-bold text-slate-600 uppercase mb-3">Resume Preview</div>
                    <div className="bg-white rounded-lg shadow-sm p-5 text-xs leading-relaxed">
                      <div className="border-b-2 border-[#0F3D2E] pb-2 mb-3">
                        <div className="text-lg font-extrabold text-slate-900">Nithin Chakka</div>
                        <div className="text-[#0F3D2E] font-bold">Senior Generative AI Engineer · Healthcare AI</div>
                        <div className="text-slate-500 mt-1">nithin@example.com · Bangalore, India · linkedin.com/in/nithin · github.com/nithin</div>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold text-[#0F3D2E] mb-1">PROFESSIONAL SUMMARY</div>
                        <p className="text-slate-700">Senior AI Engineer with 4+ years building production-grade LLM and multi-agent systems for healthcare AI and clinical document automation. Deep expertise in RAG, Vector Databases, LangGraph, AWS Bedrock, and Azure OpenAI. Strong knowledge of CDISC standards, eCRF/eCOA workflows, and regulatory compliance for pharma clients.</p>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold text-[#0F3D2E] mb-1">KEY SKILLS</div>
                        <p className="text-slate-700">Python · LangGraph · LangChain · RAG · Vector Databases (Pinecone, Chroma) · AWS Bedrock · Azure OpenAI · FastAPI · Neo4j · Multi-agent systems · Docker · CI/CD · CDISC · eCRF · eCOA</p>
                      </div>
                      <div>
                        <div className="font-bold text-[#0F3D2E] mb-1">EXPERIENCE</div>
                        <div className="mb-2">
                          <div className="font-bold text-slate-900">GenAI Developer · TechCorp</div>
                          <div className="text-slate-500 italic">2022 — Present</div>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                            <li>Built eCOA AI pipeline processing 500+ clinical documents/batch with CDISC compliance</li>
                            <li>Reduced manual localization effort by 70% via automated 3-stage QC with LangGraph</li>
                            <li>Implemented RAG-based eCRF parser for Medidata Rave integration — 94% accuracy</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab(3)} className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] text-white font-bold flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Go to Download
                  </button>
                </div>
              )}

              {activeTab === 3 && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E8F5F0] mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-9 h-9 text-[#0D6B4F]" strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Tailored Resume Ready!</h3>
                  <p className="text-sm text-slate-600 mb-5">Your resume is tailored for Senior Generative AI Engineer at Pfizer Digital. Match score: {data.matchScore}%</p>
                  <div className="space-y-2 mb-5">
                    <button className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] text-white font-bold flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Tailored Resume (.docx)
                    </button>
                    <button className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download as PDF
                    </button>
                  </div>
                  <a href="/jobs" className="text-sm text-[#0F3D2E] font-semibold hover:underline">Next → Find matching jobs</a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-5">
                <Briefcase className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Your tailored resume will appear here</h3>
              <p className="text-sm text-slate-500 max-w-sm">Paste a job description on the left and click “Tailor Resume” to see AI-powered alignment with keywords, skills, and priorities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDTailor;
