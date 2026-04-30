import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';
import { mockTemplates } from '../mock';
import { resumeApi, aiApi, atsApi } from '../lib/api';
import { Plus, Trash2, Save, Eye, Sparkles, User, Briefcase, GraduationCap, Award, Languages, Wrench, ArrowLeft, Loader2, Check, PenLine, X, Download, ChevronDown, ArrowRight, CheckCircle2, Wand2, Search } from 'lucide-react';

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
  experiences: [{ id: '1', company: '', role: '', period: '', bullets: ['', ''] }],
  education: [{ id: '1', school: '', degree: '', period: '', cgpa: '' }],
  skills: [''],
  skillCategories: [],
  certifications: [{ id: '1', name: '', issuer: '', date: '' }],
  languages: [{ id: '1', name: 'English', level: 'Native' }],
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
  const [saveError, setSaveError] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadingResume, setLoadingResume] = useState(!!id);
  const [atsBanner, setAtsBanner] = useState(null);
  const [originalFileBase64, setOriginalFileBase64] = useState('');
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modalCanScroll, setModalCanScroll] = useState(false);
  const modalBodyRef = useRef(null);

  // Load ATS-fixed resume if coming from ATS Checker
  useEffect(() => {
    if (id) return;
    try {
      const prefill = JSON.parse(sessionStorage.getItem('ik_ats_prefill') || 'null');
      if (!prefill?.resumeData) return;
      const r = prefill.resumeData;
      setData({
        personal: r.personal || EMPTY_DATA.personal,
        summary: { text: r.summary || '' },
        experiences: r.experiences?.length ? r.experiences.map(e => ({ ...e, id: e.id || String(Math.random()) })) : EMPTY_DATA.experiences,
        education: r.education?.length ? r.education.map(e => ({ ...e, id: e.id || String(Math.random()) })) : EMPTY_DATA.education,
        skills: r.skills?.length ? r.skills : EMPTY_DATA.skills,
        skillCategories: r.skill_categories?.length ? r.skill_categories : [],
        certifications: r.certifications?.length ? r.certifications.map(c => ({ ...c, id: c.id || String(Math.random()) })) : EMPTY_DATA.certifications,
        languages: r.languages || EMPTY_DATA.languages,
      });
      if (r.personal?.name) setResumeTitle(`${r.personal.name} — ATS Fixed`);
      setAtsBanner({ score: prefill.score });
      if (prefill.originalFileBase64) setOriginalFileBase64(prefill.originalFileBase64);
      sessionStorage.removeItem('ik_ats_prefill');
    } catch { /* ignore */ }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingResume(true);
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
          skillCategories: r.data.skillCategories?.length ? r.data.skillCategories : [],
          certifications: r.data.certifications?.length ? r.data.certifications : EMPTY_DATA.certifications,
          languages: r.data.languages?.length ? r.data.languages : EMPTY_DATA.languages,
        });
        if (r.data.customSections?.length) setCustomSections(r.data.customSections);
      }
    }).catch(() => setLoadError('Failed to load resume.')).finally(() => setLoadingResume(false));
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
    setSaveError('');
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
      setTimeout(() => setSaved(false), 2500);
      if (!sessionStorage.getItem('ik_upsell_shown')) {
        sessionStorage.setItem('ik_upsell_shown', '1');
        setTimeout(() => setShowUpsellModal(true), 800);
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Save failed. Please try again.';
      setSaveError(msg);
      setTimeout(() => setSaveError(''), 4000);
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
      setAiError('AI generation failed. Please try again.');
      setTimeout(() => setAiError(''), 3000);
    } finally {
      setAiGenerating(false);
    }
  };


  useEffect(() => {
    if (!showPreview) { setModalCanScroll(false); return; }
    const check = () => {
      if (modalBodyRef.current) {
        const { scrollHeight, clientHeight } = modalBodyRef.current;
        setModalCanScroll(scrollHeight > clientHeight + 10);
      }
    };
    const t1 = setTimeout(check, 200);
    const t2 = setTimeout(check, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showPreview]);

  const handleModalScroll = () => {
    if (!modalBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    setModalCanScroll(scrollTop + clientHeight < scrollHeight - 20);
  };

  const handleDownloadWord = async () => {
    if (originalFileBase64) {
      try {
        const blob = await atsApi.downloadFixedDocx(originalFileBase64, {
          personal: data.personal,
          summary: data.summary.text,
          experiences: data.experiences,
          education: data.education,
          skills: data.skills,
          skill_categories: data.skillCategories,
          certifications: data.certifications,
          languages: data.languages,
        });
        saveAs(blob, `${(data.personal.name || resumeTitle || 'resume').replace(/[^a-z0-9\s_-]/gi, '_')}_ATS_Fixed.docx`);
        return;
      } catch (e) {
        // fall through to client-side generation
      }
    }

    const children = [];

    children.push(new Paragraph({
      children: [new TextRun({ text: data.personal.name || 'Your Name', bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
    }));
    if (data.personal.title) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personal.title, size: 26, color: '336699' })],
        alignment: AlignmentType.CENTER,
      }));
    }
    const contactParts = [data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin, data.personal.github].filter(Boolean);
    if (contactParts.length) {
      children.push(new Paragraph({
        children: [new TextRun({ text: contactParts.join(' | '), size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        border: { bottom: { color: '333333', space: 1, style: BorderStyle.SINGLE, size: 4 } },
      }));
    }

    if (data.summary.text) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 22 })], spacing: { before: 240, after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: data.summary.text, size: 20 })], spacing: { after: 100 } }));
    }

    const exps = data.experiences.filter(e => e.company || e.role);
    if (exps.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'WORK EXPERIENCE', bold: true, size: 22 })], spacing: { before: 240, after: 80 } }));
      exps.forEach(exp => {
        children.push(new Paragraph({ children: [new TextRun({ text: exp.role || '', bold: true, size: 24 }), new TextRun({ text: exp.period ? `\t\t${exp.period}` : '', size: 20, color: '555555' })] }));
        if (exp.company) children.push(new Paragraph({ children: [new TextRun({ text: exp.company, bold: true, size: 20, color: '336699' })], spacing: { after: 60 } }));
        exp.bullets.filter(b => b).forEach(b => {
          children.push(new Paragraph({ children: [new TextRun({ text: b, size: 20 })], bullet: { level: 0 } }));
        });
        children.push(new Paragraph({ text: '', spacing: { after: 80 } }));
      });
    }

    const skills = data.skills.filter(s => s);
    if (data.skillCategories?.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'SKILLS', bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      data.skillCategories.forEach(cat => {
        const skillStr = Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills;
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${cat.category}`, bold: true, size: 20 }),
            new TextRun({ text: `\t${skillStr}`, size: 20 }),
          ],
          spacing: { after: 40 },
        }));
      });
    } else if (skills.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'SKILLS', bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: skills.join(', '), size: 20 })], spacing: { after: 100 } }));
    }

    const edus = data.education.filter(e => e.school || e.degree);
    if (edus.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'EDUCATION', bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      edus.forEach(ed => {
        children.push(new Paragraph({ children: [new TextRun({ text: ed.degree || '', bold: true, size: 22 })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: [ed.school, ed.period, ed.cgpa ? `GPA: ${ed.cgpa}` : ''].filter(Boolean).join(' · '), size: 20 })], spacing: { after: 80 } }));
      });
    }

    const certs = data.certifications.filter(c => c.name);
    if (certs.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'CERTIFICATIONS', bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      certs.forEach(c => {
        children.push(new Paragraph({ children: [new TextRun({ text: [c.name, c.issuer, c.date].filter(Boolean).join(' · '), size: 20 })] }));
      });
    }

    const langs = data.languages.filter(l => l.name);
    if (langs.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'LANGUAGES', bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: langs.map(l => `${l.name} (${l.level})`).join(', '), size: 20 })] }));
    }

    customSections.filter(cs => cs.content).forEach(cs => {
      children.push(new Paragraph({ children: [new TextRun({ text: cs.name.toUpperCase(), bold: true, size: 22 })], spacing: { before: 200, after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: cs.content, size: 20 })] }));
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${(resumeTitle || 'resume').replace(/[^a-z0-9\s-]/gi, '')}.docx`);
  };

  const template = mockTemplates.find(t => t.id === selectedTemplate) || mockTemplates[0];

  // Experience helpers
  const addExp = () => setData(d => ({ ...d, experiences: [...d.experiences, { id: String(Date.now()), company: '', role: '', period: '', bullets: ['', ''] }] }));
  const removeExp = (eid) => setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== eid) }));
  const updateExp = (eid, field, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, [field]: value } : e) }));
  const updateBullet = (eid, i, value) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, bullets: e.bullets.map((b, bi) => bi === i ? value : b) } : e) }));
  const addBullet = (eid) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === eid ? { ...e, bullets: [...e.bullets, ''] } : e) }));

  // Education helpers
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: String(Date.now()), school: '', degree: '', period: '', cgpa: '' }] }));
  const removeEdu = (eid) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== eid) }));
  const updateEdu = (eid, field, value) => setData(d => ({ ...d, education: d.education.map(e => e.id === eid ? { ...e, [field]: value } : e) }));

  // Skills helpers
  const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, ''] }));
  const updateSkill = (i, value) => setData(d => ({ ...d, skills: d.skills.map((s, si) => si === i ? value : s) }));
  const removeSkill = (i) => setData(d => ({ ...d, skills: d.skills.filter((_, si) => si !== i) }));

  // Certifications helpers
  const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, { id: String(Date.now()), name: '', issuer: '', date: '' }] }));
  const removeCert = (cid) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== cid) }));
  const updateCert = (cid, field, value) => setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === cid ? { ...c, [field]: value } : c) }));

  // Languages helpers
  const addLang = () => setData(d => ({ ...d, languages: [...d.languages, { id: String(Date.now()), name: '', level: 'Intermediate' }] }));
  const removeLang = (lid) => setData(d => ({ ...d, languages: d.languages.filter(l => l.id !== lid) }));
  const updateLang = (lid, field, value) => setData(d => ({ ...d, languages: d.languages.map(l => l.id === lid ? { ...l, [field]: value } : l) }));

  // Custom sections helpers
  const addCustomSection = () => {
    const name = newSectionName.trim();
    if (!name) return;
    const cs = { id: String(Date.now()), name, content: '' };
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

  if (loadingResume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B47] animate-spin" />
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      {atsBanner && (
        <div className="bg-[#0F3D2E] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>✅</span>
            All ATS fixes applied — your resume was upgraded from score {atsBanner.score} by AI. Review and save.
          </div>
          <button onClick={() => setAtsBanner(null)} className="text-white/60 hover:text-white text-lg leading-none">×</button>
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
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
              <button onClick={() => setShowPreview(true)} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button onClick={handleDownloadWord} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download
              </button>
              <motion.button
                onClick={handleSave} disabled={saving}
                whileHover={!saving ? { scale: 1.04, boxShadow: '0 8px 20px rgba(255,107,71,0.30)' } : {}}
                whileTap={!saving ? { scale: 0.96 } : {}}
                className="px-4 py-2 rounded-lg bg-[#FF6B47] hover:bg-[#ff5630] disabled:opacity-60 text-white text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                    </motion.span>
                  ) : saved ? (
                    <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Saved!
                    </motion.span>
                  ) : (
                    <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                      <Save className="w-4 h-4" /> Save
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {saveError && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {saveError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_600px] gap-4">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3 h-fit sticky top-20">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Sections</div>
            <div className="space-y-0.5">
              {STATIC_SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={`relative w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${activeSection === s.id ? 'text-[#FF6B47]' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {activeSection === s.id && (
                    <motion.div layoutId="section-indicator" className="absolute inset-0 bg-[#FFF3EE] rounded-lg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                  )}
                  <s.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{s.name}</span>
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
          <div className="bg-white rounded-2xl border border-slate-100 p-5 min-h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            {activeSection === 'personal' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[['name','Full Name','Your Name'],['title','Job Title','Software Engineer'],['email','Email','you@example.com'],['phone','Phone','+91 98765 43210'],['location','Location','Bangalore, India'],['linkedin','LinkedIn','linkedin.com/in/you'],['github','GitHub','github.com/you']].map(([k, l, ph]) => (
                    <div key={k} className={k === 'name' || k === 'title' ? 'col-span-2' : ''}>
                      <label htmlFor={`personal-${k}`} className="block text-xs font-bold text-slate-600 mb-1">{l}</label>
                      <input id={`personal-${k}`} name={k} type="text" value={data.personal[k]} onChange={e => setData(d => ({...d, personal: {...d.personal, [k]: e.target.value}}))} placeholder={ph} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
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
            </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview */}
          <div className="bg-slate-100 rounded-2xl p-4 sticky top-20">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Live Preview</div>
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: 560 }}>
            <div className="h-full overflow-y-auto p-6">
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
              {(data.skillCategories?.length > 0 || data.skills.some(s => s)) && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>SKILLS</div>
                  {data.skillCategories?.length > 0 ? (
                    <div className="space-y-0.5">
                      {data.skillCategories.map((cat, i) => (
                        <div key={i} className="flex gap-1.5 text-[9px]">
                          <span className="font-bold text-slate-800 shrink-0 w-24">{cat.category}</span>
                          <span className="text-slate-600">{Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-700">{data.skills.filter(s => s).join(', ')}</p>
                  )}
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
            {/* Live preview scroll indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))' }}>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0">
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 animate-bounce" />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowPreview(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <div className="font-extrabold text-slate-900">{resumeTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Resume Preview</div>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal body — enlarged resume preview */}
              <div ref={modalBodyRef} onScroll={handleModalScroll} className="flex-1 overflow-y-auto p-6 bg-slate-50 relative" style={{ minHeight: 0 }}>
                <div className="bg-white shadow-xl rounded-xl p-8 max-w-[680px] mx-auto" style={{ minHeight: '880px' }}>
                  <div className="pb-4 mb-5 border-b-2" style={{ borderColor: template.color }}>
                    <div className="text-3xl font-extrabold text-slate-900">{data.personal.name || 'Your Name'}</div>
                    <div className="font-bold text-base mt-1" style={{ color: template.color }}>{data.personal.title || 'Your Role'}</div>
                    <div className="text-sm text-slate-500 mt-1.5">
                      {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' · ') || 'Add your contact info'}
                    </div>
                    {(data.personal.linkedin || data.personal.github) && (
                      <div className="text-sm text-slate-500">
                        {[data.personal.linkedin, data.personal.github].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                  {data.summary.text && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>PROFESSIONAL SUMMARY</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{data.summary.text}</p>
                    </div>
                  )}
                  {data.experiences.some(e => e.company || e.role) && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-3" style={{ color: template.color }}>WORK EXPERIENCE</div>
                      {data.experiences.filter(e => e.company || e.role).map(e => (
                        <div key={e.id} className="mb-4">
                          <div className="flex items-baseline justify-between">
                            <div className="text-base font-bold text-slate-900">{e.role}</div>
                            <div className="text-xs text-slate-500 font-semibold">{e.period}</div>
                          </div>
                          <div className="text-sm font-semibold mb-1" style={{ color: template.color }}>{e.company}</div>
                          <ul className="text-sm text-slate-700 space-y-0.5">
                            {e.bullets.filter(b => b).map((b, i) => <li key={i} className="flex gap-2"><span className="text-slate-400 mt-0.5">•</span><span>{b}</span></li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {(data.skillCategories?.length > 0 || data.skills.some(s => s)) && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>SKILLS</div>
                      {data.skillCategories?.length > 0 ? (
                        <div className="space-y-1.5">
                          {data.skillCategories.map((cat, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                              <span className="font-bold text-slate-800 shrink-0 w-44">{cat.category}</span>
                              <span className="text-slate-600">{Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700 leading-relaxed">{data.skills.filter(s => s).join(', ')}</p>
                      )}
                    </div>
                  )}
                  {data.education.some(e => e.school || e.degree) && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>EDUCATION</div>
                      {data.education.filter(e => e.school || e.degree).map(e => (
                        <div key={e.id} className="mb-2">
                          <div className="font-bold text-slate-900">{e.degree}</div>
                          <div className="text-sm text-slate-600">{e.school}{e.period ? ` · ${e.period}` : ''}{e.cgpa ? ` · GPA: ${e.cgpa}` : ''}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {data.certifications.some(c => c.name) && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>CERTIFICATIONS</div>
                      {data.certifications.filter(c => c.name).map(c => (
                        <div key={c.id} className="text-sm text-slate-700 mb-1">
                          <span className="font-semibold">{c.name}</span>{c.issuer ? ` · ${c.issuer}` : ''}{c.date ? ` · ${c.date}` : ''}
                        </div>
                      ))}
                    </div>
                  )}
                  {data.languages.some(l => l.name) && (
                    <div className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>LANGUAGES</div>
                      <p className="text-sm text-slate-700">{data.languages.filter(l => l.name).map(l => `${l.name} (${l.level})`).join(' · ')}</p>
                    </div>
                  )}
                  {customSections.filter(cs => cs.content).map(cs => (
                    <div key={cs.id} className="mb-5">
                      <div className="text-xs font-extrabold tracking-widest mb-2" style={{ color: template.color }}>{cs.name.toUpperCase()}</div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{cs.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {modalCanScroll && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(241,245,249,0.97))' }}
                  >
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-semibold text-slate-400">scroll for more</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-save upsell modal */}
      <AnimatePresence>
        {showUpsellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,61,46,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowUpsellModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Top green banner */}
              <div className="bg-gradient-to-r from-[#0F3D2E] to-[#1a5c45] px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-base leading-tight">Resume saved successfully!</div>
                    <div className="text-white/65 text-xs mt-0.5">Want experts to take it from here?</div>
                  </div>
                </div>
                <button onClick={() => setShowUpsellModal(false)} className="text-white/50 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 text-center">
                  You built the resume — now let our experts get you the interview. We'll analyse your ATS score, tailor your resume to the job, and find you curated roles — all done for you.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Pro card */}
                  <div className="border-2 border-slate-100 rounded-2xl p-5 hover:border-[#FF6B47]/30 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B47] bg-[#FFF3EE] px-2 py-0.5 rounded-full">Pro</span>
                      <span className="text-xs font-bold text-slate-400 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Limited Offer</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-extrabold text-slate-900">₹499</span>
                      <span className="text-sm text-slate-300 line-through font-semibold">₹699</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {[
                        [Wand2, 'Full ATS Score — expert analysis', '#FF6B47'],
                        [CheckCircle2, 'Resume rewrite by our specialist', '#0D6B4F'],
                        [CheckCircle2, 'JD tailoring for your target role', '#0D6B4F'],
                        [Search, '15–20 curated job matches', '#4F8EF7'],
                      ].map(([Icon, text, color]) => (
                        <li key={text} className="flex items-start gap-2 text-xs text-slate-600">
                          <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color }} strokeWidth={2.5} />
                          {text}
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing" onClick={() => setShowUpsellModal(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0F3D2E] hover:bg-[#1a5c45] text-white text-sm font-bold transition-colors">
                      Get Pro <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Premium card */}
                  <div className="border-2 border-[#0F3D2E] rounded-2xl p-5 bg-[#0F3D2E] text-white relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B47] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      Best Value
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B47]">Premium</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-extrabold">₹899</span>
                      <span className="text-sm text-white/30 line-through font-semibold">₹1,299</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {[
                        [Wand2, 'Everything in Pro', '#FF6B47'],
                        [Search, '30–40 curated job matches', '#4F8EF7'],
                        [CheckCircle2, 'Recruiter contacts included', '#BBE8D8'],
                        [CheckCircle2, 'Priority 24hr delivery', '#BBE8D8'],
                      ].map(([Icon, text, color]) => (
                        <li key={text} className="flex items-start gap-2 text-xs text-white/80">
                          <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color }} strokeWidth={2.5} />
                          {text}
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing" onClick={() => setShowUpsellModal(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FF6B47] hover:bg-[#ff5630] text-white text-sm font-bold transition-colors">
                      Get Premium <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={() => setShowUpsellModal(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
                    I'll handle it myself — close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeBuilder;
