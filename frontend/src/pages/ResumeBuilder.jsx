import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { mockTemplates } from '../mock';
import { resumeApi, aiApi } from '../lib/api';
import { Plus, Trash2, Save, Eye, Sparkles, User, Briefcase, GraduationCap, Award, Languages, Wrench, ArrowLeft, Loader2, Check, PenLine, X } from 'lucide-react';

const STATIC_SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: Sparkles },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Wrench },
  { id: 'certifications', name: 'Certifications', icon: Award },
  { id: 'languages', name: 'Languages', icon: Languages },
];

const EMPTY_DATA = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  summary: { text: '' },
  experiences: [{ id: 1, company: '', role: '', period: '', bullets: ['', ''] }],
  education: [{ id: 1, school: '', degree: '', period: '', cgpa: '' }],
  skills: [''],
  certifications: [{ id: 1, name: '', issuer: '', date: '' }],
  languages: [{ id: 1, name: 'English', level: 'Native' }],
};

const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

const ResumeBuilder = () => {
  const { id } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0].id);
  const [activeSection, setActiveSection] = useState('personal');
  const [data, setData] = useState(EMPTY_DATA);
  const [customSections, setCustomSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [resumeId, setResumeId] = useState(id || null);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!id) return;
    resumeApi.get(id).then(r => {
      setResumeId(r.id);
      setResumeTitle(r.title);
      setSelectedTemplate(r.template || mockTemplates[0].id);
      if (r.data) {
        setData({
          personal: r.data.personal || EMPTY_DATA.personal,
          summary: { text: r.data.summary || '' },
          experiences: r.data.experiences?.length ? r.data.experiences : EMPTY_DATA.experiences,
          education: r.data.education?.length ? r.data.education : EMPTY_DATA.education,
          skills: r.data.skills?.length ? r.data.skills : EMPTY_DATA.skills,
          certifications: r.data.certifications?.length ? r.data.certifications : EMPTY_DATA.certifications,
          languages: r.data.languages?.length ? r.data.languages : EMPTY_DATA.languages,
        });
        if (r.data.customSections?.length) setCustomSections(r.data.customSections);
      }
    }).catch(() => setLoadError('Failed to load resume.'));
  }, [id]);

  const buildPayload = useCallback(() => ({
    title: resumeTitle,
    template: selectedTemplate,
    data: {
      personal: data.personal,
      summary: data.summary.text,
      experiences: data.experiences,
      education: data.education,
      skills: data.skills,
      certifications: data.certifications,
      languages: data.languages,
      customSections,
    },
  }), [data, resumeTitle, selectedTemplate, customSections]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      if (resumeId) {
        await resumeApi.update(resumeId, payload);
      } else {
        const r = await resumeApi.create(payload);
        setResumeId(r.id);
        window.history.replaceState(null, '', `/builder/${r.id}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAiSummary = async () => {
    const prompt = `Name: ${data.personal.name}, Title: ${data.personal.title}, Skills: ${data.skills.filter(Boolean).join(', ')}`;
    setAiGenerating(true);
    try {
      const result = await aiApi.generate(prompt, '', 'summary');
      if (result.text) setData(d => ({ ...d, summary: { text: result.text } }));
    } catch {
      alert('AI generation failed. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  const template = mockTemplates.find(t => t.id === selectedTemplate) || mockTemplates[0];

  // Experience helpers
  const addExp = () => setData(d => ({ ...d, experiences: [...d.experiences, { id: Date.now(), company: '', role: '', period: '', bullets: ['', ''] }] }));
  const removeExp = (eid) => setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== eid) }));
  const updateExp = (eid, field, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, [field]: value } : e) }));
  const updateBullet = (eid, i, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, bullets: e.bullets.map((b, bi) => bi === i ? value : b) } : e) }));
  const addBullet = (eid) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, bullets: [...e.bullets, ''] } : e) }));

  // Education helpers
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), school: '', degree: '', period: '', cgpa: '' }] }));
  const removeEdu = (eid) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== eid) }));
  const updateEdu = (eid, field, value) => setData(d => ({ ...d, education: d.education.map(e => e.id === eid ? { ...e, [field]: value } : e) }));

  // Skills helpers
  const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, ''] }));
  const updateSkill = (i, value) => setData(d => ({ ...d, skills: d.skills.map((s, si) => si === i ? value : s) }));
  const removeSkill = (i) => setData(d => ({ ...d, skills: d.skills.filter((_, si) => si !== i) }));

  // Certifications helpers
  const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, { id: Date.now(), name: '', issuer: '', date: '' }] }));
  const removeCert = (cid) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== cid) }));
  const updateCert = (cid, field, value) => setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === cid ? { ...c, [field]: value } : c) }));

  // Languages helpers
  const addLang = () => setData(d => ({ ...d, languages: [...d.languages, { id: Date.now(), name: '', level: 'Intermediate' }] }));
  const removeLang = (lid) => setData(d => ({ ...d, languages: d.languages.filter(l => l.id !== lid) }));
  const updateLang = (lid, field, value) => setData(d => ({ ...d, languages: d.languages.map(l => l.id === lid ? { ...l, [field]: value } : l) }));

  // Custom sections helpers
  const addCustomSection = () => {
    const name = newSectionName.trim();
    if (!name) return;
    const cs = { id: Date.now(), name, content: '' };
    setCustomSections(prev => [...prev, cs]);
    setActiveSection(`custom_${cs.id}`);
    setNewSectionName('');
    setAddingSection(false);
  };
  const removeCustomSection = (csid) => {
    setCustomSections(prev => prev.filter(cs => cs.id !== csid));
    setActiveSection('personal');
  };
  const updateCustomSection = (csid, field, value) => setCustomSections(prev => prev.map(cs => cs.id === csid ? { ...cs, [field]: value } : cs));

  const activeCustomSection = activeSection.startsWith('custom_')
    ? customSections.find(cs => `custom_${cs.id}` === activeSection)
    : null;

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{loadError}</p>
          <Link to="/dashboard" className="text-sm text-[#FF6B47] font-bold hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <input
                value={resumeTitle}
                onChange={e => setResumeTitle(e.target.value)}
                className="text-xl font-extrabold text-slate-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-slate-200 focus:px-2 rounded"
              />
              <p className="text-xs text-slate-500">{resumeId ? `ID: ${resumeId.slice(0, 8)}…` : 'Not yet saved'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Print / Preview
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-[#FF6B47] hover:bg-[#ff5630] disabled:opacity-60 text-white text-sm font-bold flex items-center gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_600px] gap-4">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3 h-fit sticky top-20">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Sections</div>
            <div className="space-y-0.5">
              {STATIC_SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${activeSection === s.id ? 'bg-[#FFF3EE] text-[#FF6B47]' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <s.icon className="w-4 h-4" />
                  {s.name}
                </button>
              ))}
            </div>

            {/* Custom Sections */}
            {customSections.length > 0 && (
              <div className="mt-2 space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 pb-1">Custom</div>
                {customSections.map(cs => (
                  <div key={cs.id} className={`flex items-center gap-1 rounded-lg transition ${activeSection === `custom_${cs.id}` ? 'bg-[#FFF3EE]' : 'hover:bg-slate-50'}`}>
                    <button onClick={() => setActiveSection(`custom_${cs.id}`)} className={`flex-1 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-left ${activeSection === `custom_${cs.id}` ? 'text-[#FF6B47]' : 'text-slate-700'}`}>
                      <PenLine className="w-4 h-4 shrink-0" />
                      <span className="truncate">{cs.name}</span>
                    </button>
                    <button onClick={() => removeCustomSection(cs.id)} className="p-1.5 mr-1 text-slate-400 hover:text-red-500 transition"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Section */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              {addingSection ? (
                <div className="px-2">
                  <input
                    autoFocus
                    value={newSectionName}
                    onChange={e => setNewSectionName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addCustomSection(); if (e.key === 'Escape') { setAddingSection(false); setNewSectionName(''); } }}
                    placeholder="Section name…"
                    className="w-full px-2 py-1.5 text-sm border border-[#FF6B47] rounded-lg focus:outline-none mb-2"
                  />
                  <div className="flex gap-1.5">
                    <button onClick={addCustomSection} className="flex-1 py-1.5 bg-[#FF6B47] text-white text-xs font-bold rounded-lg hover:bg-[#ff5630]">Add</button>
                    <button onClick={() => { setAddingSection(false); setNewSectionName(''); }} className="flex-1 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingSection(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#FF6B47] transition">
                  <Plus className="w-4 h-4" /> Add Custom Section
                </button>
              )}
            </div>

          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 min-h-[600px]">
            {activeSection === 'personal' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[['name','Full Name','Your Name'],['title','Job Title','Software Engineer'],['email','Email','you@example.com'],['phone','Phone','+91 98765 43210'],['location','Location','Bangalore, India'],['linkedin','LinkedIn','linkedin.com/in/you'],['github','GitHub','github.com/you']].map(([k, l, ph]) => (
                    <div key={k} className={k === 'name' || k === 'title' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{l}</label>
                      <input type="text" value={data.personal[k]} onChange={e => setData(d => ({...d, personal: {...d.personal, [k]: e.target.value}}))} placeholder={ph} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">Professional Summary</h2>
                <p className="text-xs text-slate-500 mb-4">A brief overview of your experience, skills, and goals.</p>
                <textarea value={data.summary.text} onChange={e => setData(d => ({...d, summary: { text: e.target.value }}))} rows={8} placeholder="Senior AI Engineer with 5+ years building production LLM systems..." className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47] resize-none" />
                <button onClick={handleAiSummary} disabled={aiGenerating} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF6B47] to-[#ff8366] disabled:opacity-60 text-white text-sm font-bold rounded-lg">
                  {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {aiGenerating ? 'Generating…' : 'Generate with AI'}
                </button>
              </div>
            )}

            {activeSection === 'experience' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Work Experience</h2>
                  <button onClick={addExp} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold hover:bg-[#FF6B47] hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {data.experiences.map(exp => (
                    <div key={exp.id} className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">EXPERIENCE</span>
                        <button onClick={() => removeExp(exp.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input placeholder="Company" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="Role / Title" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="e.g. Jan 2022 - Present" value={exp.period} onChange={e => updateExp(exp.id, 'period', e.target.value)} className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                      </div>
                      <div className="space-y-2">
                        {exp.bullets.map((b, i) => (
                          <input key={i} placeholder={`Achievement ${i+1} — use metrics`} value={b} onChange={e => updateBullet(exp.id, i, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        ))}
                        <button onClick={() => addBullet(exp.id)} className="text-xs text-[#FF6B47] font-semibold hover:underline">+ Add bullet</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Education</h2>
                  <button onClick={addEdu} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold hover:bg-[#FF6B47] hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {data.education.map(ed => (
                    <div key={ed.id} className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">EDUCATION</span>
                        <button onClick={() => removeEdu(ed.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="School / University" value={ed.school} onChange={e => updateEdu(ed.id, 'school', e.target.value)} className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="Degree" value={ed.degree} onChange={e => updateEdu(ed.id, 'degree', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="CGPA / Grade" value={ed.cgpa} onChange={e => updateEdu(ed.id, 'cgpa', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="Period" value={ed.period} onChange={e => updateEdu(ed.id, 'period', e.target.value)} className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Skills</h2>
                  <button onClick={addSkill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold hover:bg-[#FF6B47] hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {data.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input placeholder="e.g. Python, React, SQL" value={s} onChange={e => updateSkill(i, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                      <button onClick={() => removeSkill(i)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'certifications' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Certifications</h2>
                  <button onClick={addCert} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold hover:bg-[#FF6B47] hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </div>
                <div className="space-y-3">
                  {data.certifications.map(c => (
                    <div key={c.id} className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">CERTIFICATION</span>
                        <button onClick={() => removeCert(c.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Certification Name" value={c.name} onChange={e => updateCert(c.id, 'name', e.target.value)} className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="Issuing Organization" value={c.issuer} onChange={e => updateCert(c.id, 'issuer', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                        <input placeholder="Date (e.g. Mar 2024)" value={c.date} onChange={e => updateCert(c.id, 'date', e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'languages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Languages</h2>
                  <button onClick={addLang} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF3EE] text-[#FF6B47] text-xs font-bold hover:bg-[#FF6B47] hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" /> Add Language
                  </button>
                </div>
                <div className="space-y-2">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex items-center gap-2">
                      <input placeholder="Language" value={l.name} onChange={e => updateLang(l.id, 'name', e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                      <select value={l.level} onChange={e => updateLang(l.id, 'level', e.target.value)} className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]">
                        {LANGUAGE_LEVELS.map(lv => <option key={lv}>{lv}</option>)}
                      </select>
                      <button onClick={() => removeLang(l.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom section form */}
            {activeCustomSection && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    value={activeCustomSection.name}
                    onChange={e => updateCustomSection(activeCustomSection.id, 'name', e.target.value)}
                    className="text-lg font-extrabold text-slate-900 bg-transparent border-b-2 border-transparent focus:border-[#FF6B47] outline-none pb-0.5 flex-1"
                  />
                  <span className="text-xs text-slate-400 font-medium">Custom Section</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Add any content you'd like — publications, awards, volunteer work, projects, etc.</p>
                <textarea
                  value={activeCustomSection.content}
                  onChange={e => updateCustomSection(activeCustomSection.id, 'content', e.target.value)}
                  rows={12}
                  placeholder={`Write your ${activeCustomSection.name} content here…\n\nYou can use bullet points:\n• First item\n• Second item\n• Third item`}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47] resize-none"
                />
                <p className="text-xs text-slate-400 mt-2">Tip: Use • for bullet points. Content will appear in your resume preview.</p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-slate-100 rounded-2xl p-4 h-fit sticky top-20">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Live Preview</div>
            <div className="bg-white rounded-lg shadow-xl p-6 aspect-[0.77] overflow-hidden">
              <div className="pb-3 mb-4 border-b-2" style={{ borderColor: template.color }}>
                <div className="text-xl font-extrabold text-slate-900">{data.personal.name || 'Your Name'}</div>
                <div className="font-bold text-sm" style={{ color: template.color }}>{data.personal.title || 'Your Role'}</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' · ') || 'contact info'}
                </div>
              </div>
              {data.summary.text && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>SUMMARY</div>
                  <p className="text-[10px] text-slate-700 leading-relaxed">{data.summary.text}</p>
                </div>
              )}
              {data.experiences.some(e => e.company || e.role) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1.5" style={{ color: template.color }}>EXPERIENCE</div>
                  {data.experiences.filter(e => e.company || e.role).map(e => (
                    <div key={e.id} className="mb-2">
                      <div className="flex items-baseline justify-between">
                        <div className="text-[11px] font-bold text-slate-900">{e.role}</div>
                        <div className="text-[9px] text-slate-500">{e.period}</div>
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600">{e.company}</div>
                      <ul className="text-[9px] text-slate-700 list-disc list-inside mt-0.5 space-y-0.5">
                        {e.bullets.filter(b => b).map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {data.skills.some(s => s) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>SKILLS</div>
                  <p className="text-[10px] text-slate-700">{data.skills.filter(s => s).join(' · ')}</p>
                </div>
              )}
              {data.education.some(e => e.school || e.degree) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>EDUCATION</div>
                  {data.education.filter(e => e.school || e.degree).map(e => (
                    <div key={e.id} className="text-[10px] mb-1">
                      <div className="font-bold text-slate-900">{e.degree}</div>
                      <div className="text-slate-600">{e.school}{e.period ? ` · ${e.period}` : ''}</div>
                    </div>
                  ))}
                </div>
              )}
              {data.certifications.some(c => c.name) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>CERTIFICATIONS</div>
                  {data.certifications.filter(c => c.name).map(c => (
                    <div key={c.id} className="text-[9px] text-slate-700 mb-0.5">
                      <span className="font-semibold">{c.name}</span>{c.issuer ? ` · ${c.issuer}` : ''}{c.date ? ` · ${c.date}` : ''}
                    </div>
                  ))}
                </div>
              )}
              {data.languages.some(l => l.name) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>LANGUAGES</div>
                  <p className="text-[9px] text-slate-700">{data.languages.filter(l => l.name).map(l => `${l.name} (${l.level})`).join(' · ')}</p>
                </div>
              )}
              {customSections.filter(cs => cs.content).map(cs => (
                <div key={cs.id} className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>{cs.name.toUpperCase()}</div>
                  <p className="text-[9px] text-slate-700 leading-relaxed whitespace-pre-line">{cs.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
