import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { mockATSResult } from '../mock';
import { Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Sparkles, Download, RotateCw, ArrowRight, Target, Zap, TrendingUp, Check, X } from 'lucide-react';

function CircleScore({ score, size = 120 }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#0D6B4F' : score >= 60 ? '#4F8EF7' : '#F59E0B';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#F1F5F9" strokeWidth="8" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-bold tracking-wider text-slate-500">ATS SCORE</div>
        <div className="text-3xl font-black" style={{ color }}>{score}</div>
        <div className="text-[10px] font-bold" style={{ color }}>{score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : 'NEEDS WORK'}</div>
      </div>
    </div>
  );
}

const tabs = ['Score', 'Pros & Cons', 'Fixes', 'Download'];

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [dragging, setDragging] = useState(false);

  const data = mockATSResult;

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setActiveTab(0);
    }, 2200);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setActiveTab(3);
    }, 2200);
  };

  const reset = () => {
    setAnalyzed(false);
    setGenerated(false);
    setFile(null);
  };

  const priorityColor = (p) => p === 'HIGH' ? { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' } : p === 'MEDIUM' ? { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' } : { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
  const highCount = data.fixes.filter(f => f.priority === 'HIGH').length;
  const medCount = data.fixes.filter(f => f.priority === 'MEDIUM').length;
  const lowCount = data.fixes.filter(f => f.priority === 'LOW').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[440px_1fr] gap-6">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Analysis
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              Check your resume's <span className="text-[#FF6B47]">ATS score</span> instantly
            </h1>
            <p className="text-slate-600 mb-6">Upload your resume and get a real ATS compatibility report with prioritized fixes — in seconds.</p>

            {/* Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) setFile(f.name);
              }}
              onClick={() => !analyzed && document.getElementById('fileInput').click()}
              className={`rounded-2xl border-2 border-dashed p-7 text-center cursor-pointer transition-all ${dragging ? 'border-[#FF6B47] bg-[#FFF3EE]' : file ? 'border-[#0D6B4F] bg-[#E8F5F0]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <input id="fileInput" type="file" accept=".pdf,.docx,.doc" hidden onChange={(e) => e.target.files[0] && setFile(e.target.files[0].name)} />
              <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${file ? 'bg-[#0D6B4F]' : 'bg-slate-100'}`}>
                {file ? <CheckCircle2 className="w-7 h-7 text-white" /> : <Upload className="w-6 h-6 text-slate-500" />}
              </div>
              {file ? (
                <>
                  <div className="font-bold text-slate-900 mb-1">{file}</div>
                  <div className="text-xs text-slate-500">{analyzed ? 'Analysis complete ✓' : 'Ready to analyze'}</div>
                </>
              ) : (
                <>
                  <div className="font-bold text-slate-900 mb-1">Drop resume here</div>
                  <div className="text-xs text-slate-500">or click to browse · .pdf or .docx</div>
                </>
              )}
            </div>

            <div className="mt-4">
              {!analyzed ? (
                <button disabled={!file || analyzing} onClick={handleAnalyze} className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold transition-all">
                  {analyzing ? 'Analyzing...' : 'Analyze My Resume →'}
                </button>
              ) : (
                <button onClick={reset} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <RotateCw className="w-4 h-4" /> Analyze Different Resume
                </button>
              )}
            </div>

            {analyzing && (
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-[#FF6B47] rounded-full animate-spin"></div>
                Scanning structure, keywords & ATS compatibility...
              </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[['3s', 'Analysis Time'], ['20+', 'Feedback Points'], ['99%', 'Parse Success']].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                  <div className="text-xl font-extrabold text-[#FF6B47]">{v}</div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          {analyzed ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-[fadeIn_0.4s_ease]">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F3D2E] to-[#1F6B4F] text-white flex items-center justify-center font-extrabold">N</div>
                  <div>
                    <div className="font-bold text-slate-900">Nithin Chakka</div>
                    <div className="text-xs text-slate-500">GenAI Developer</div>
                  </div>
                </div>
                <CircleScore score={data.score} size={100} />
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                {tabs.map((t, i) => (
                  <button key={t} onClick={() => setActiveTab(i)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === i ? 'bg-white text-[#FF6B47] shadow' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {activeTab === 0 && (
                <div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-900 text-sm mb-1">Needs Improvement</div>
                        <div className="text-xs text-amber-800">Strong technical content but critical ATS issues found — table-based layout, zero quantifiable metrics, and missing contact fields are hurting your score significantly.</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-5">
                    {data.metrics.map(m => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                          <span>{m.label}</span><span>{m.score}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${m.score}%`, background: m.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8]">
                      <div className="text-xs font-bold text-[#0D6B4F] mb-2">✅ KEYWORDS FOUND</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.keywords.map(k => <span key={k} className="px-2 py-1 rounded-md bg-white text-[#0D6B4F] text-xs font-semibold border border-[#BBE8D8]">{k}</span>)}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="text-xs font-bold text-red-600 mb-2">❌ MISSING HIGH-VALUE KEYWORDS</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.missingKeywords.map(k => <span key={k} className="px-2 py-1 rounded-md bg-white text-red-600 text-xs font-semibold border border-red-100">{k}</span>)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab(1)} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2">
                    View Pros & Cons <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-bold text-[#0D6B4F] mb-3">✅ STRENGTHS ({data.pros.length})</div>
                    <ul className="space-y-2">
                      {data.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#E8F5F0]/50 border border-[#BBE8D8]/50 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-[#0D6B4F] flex-shrink-0 mt-0.5" strokeWidth={3} />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-600 mb-3">❌ ISSUES FOUND ({data.cons.length})</div>
                    <ul className="space-y-2">
                      {data.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-slate-700">
                          <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={3} />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setActiveTab(2)} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white font-bold hover:shadow-lg flex items-center justify-center gap-2">
                    See AI Fixes <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[[highCount, 'Critical', '#EF4444', '#FEF2F2'], [medCount, 'Medium', '#F59E0B', '#FFFBEB'], [lowCount, 'Low', '#64748B', '#F8FAFC']].map(([v, l, c, bg]) => (
                      <div key={l} className="p-3 rounded-xl text-center border" style={{ background: bg, borderColor: c + '33' }}>
                        <div className="text-2xl font-extrabold" style={{ color: c }}>{v}</div>
                        <div className="text-[10px] font-bold uppercase" style={{ color: c }}>{l} Priority</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5 mb-5">
                    {data.fixes.map((f, i) => {
                      const pc = priorityColor(f.priority);
                      return (
                        <div key={i} className="p-4 rounded-xl border" style={{ borderColor: pc.border, background: pc.bg }}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ color: 'white', background: pc.text }}>{f.priority}</span>
                            <span className="text-xs font-bold text-slate-700">{f.section}</span>
                          </div>
                          <div className="text-sm text-slate-700">{f.fix}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#14543F] text-white mb-4">
                    <div className="text-xs font-bold text-[#FF6B47] mb-1">🤖 AI will auto-apply all fixes</div>
                    <div className="text-xs text-white/80">Projected score after improvements</div>
                    <div className="text-3xl font-extrabold mt-1">{data.score} → 88+</div>
                  </div>
                  <button onClick={handleGenerate} disabled={generating} className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2">
                    {generating ? 'Generating improved resume...' : (<><Sparkles className="w-4 h-4" /> Generate ATS-Improved Resume</>)}
                  </button>
                </div>
              )}

              {activeTab === 3 && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E8F5F0] mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-[#0D6B4F]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Your ATS Resume is Ready!</h3>
                  <p className="text-sm text-slate-600 mb-5">All 8 fixes applied. Score improved from <span className="font-bold text-slate-900">63</span> to <span className="font-bold text-[#0D6B4F]">88</span></p>
                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-5">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="text-3xl font-extrabold text-amber-600">63</div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Before</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#E8F5F0] border border-[#BBE8D8]">
                      <div className="text-3xl font-extrabold text-[#0D6B4F]">88</div>
                      <div className="text-[10px] font-bold text-[#0D6B4F] uppercase">After</div>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] text-white font-bold flex items-center justify-center gap-2 mb-2">
                    <Download className="w-4 h-4" /> Download ATS Resume (.docx)
                  </button>
                  <a href="/jd-tailor" className="text-sm text-[#0F3D2E] font-semibold hover:underline">Next → Add Job Description for tailored resume</a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-5">
                <Target className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Your ATS report will appear here</h3>
              <p className="text-sm text-slate-500 max-w-sm">Upload your resume on the left and click “Analyze” to get a comprehensive report with prioritized fixes.</p>
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md w-full">
                {[{i:Target,t:'Score'},{i:Zap,t:'Fixes'},{i:TrendingUp,t:'Improve'}].map((s,i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 text-center">
                    <s.i className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-600">{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
