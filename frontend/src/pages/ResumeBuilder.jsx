import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { mockTemplates } from '../mock';
import { Plus, Trash2, Save, Download, Eye, Sparkles, User, Briefcase, GraduationCap, Award, Languages, Wrench, ArrowLeft } from 'lucide-react';

const sections = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: Sparkles },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Wrench },
  { id: 'certifications', name: 'Certifications', icon: Award },
  { id: 'languages', name: 'Languages', icon: Languages },
];

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0].id);
  const [activeSection, setActiveSection] = useState('personal');
  const [data, setData] = useState({
    personal: { name: 'Your Name', title: 'Your Role', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: { text: '' },
    experiences: [{ id: 1, company: '', role: '', period: '', bullets: ['', ''] }],
    education: [{ id: 1, school: '', degree: '', period: '', cgpa: '' }],
    skills: [''],
    certifications: [''],
    languages: [{ name: 'English', level: 'Native' }],
  });

  const template = mockTemplates.find(t => t.id === selectedTemplate) || mockTemplates[0];

  const addExp = () => setData({ ...data, experiences: [...data.experiences, { id: Date.now(), company: '', role: '', period: '', bullets: ['', ''] }] });
  const removeExp = (id) => setData({ ...data, experiences: data.experiences.filter(e => e.id !== id) });
  const updateExp = (id, field, value) => setData({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) });
  const updateBullet = (id, i, value) => setData({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, bi) => bi === i ? value : b) } : e) });
  const addBullet = (id) => setData({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e) });

  const addEdu = () => setData({ ...data, education: [...data.education, { id: Date.now(), school: '', degree: '', period: '', cgpa: '' }] });
  const removeEdu = (id) => setData({ ...data, education: data.education.filter(e => e.id !== id) });
  const updateEdu = (id, field, value) => setData({ ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) });

  const addSkill = () => setData({ ...data, skills: [...data.skills, ''] });
  const updateSkill = (i, value) => setData({ ...data, skills: data.skills.map((s, si) => si === i ? value : s) });
  const removeSkill = (i) => setData({ ...data, skills: data.skills.filter((_, si) => si !== i) });

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
              <h1 className="text-xl font-extrabold text-slate-900">Resume Builder</h1>
              <p className="text-xs text-slate-500">Auto-saved · 2 seconds ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#0F3D2E] hover:bg-[#0b2e23] text-white text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Improve
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#FF6B47] hover:bg-[#ff5630] text-white text-sm font-bold flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_600px] gap-4">
          {/* Sidebar - sections */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3 h-fit sticky top-20">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Sections</div>
            <div className="space-y-0.5">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${activeSection === s.id ? 'bg-[#FFF3EE] text-[#FF6B47]' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <s.icon className="w-4 h-4" />
                  {s.name}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Template</div>
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#FF6B47]">
                {mockTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
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
                      <input type="text" value={data.personal[k]} onChange={e => setData({...data, personal: {...data.personal, [k]: e.target.value}})} placeholder={ph} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">Professional Summary</h2>
                <p className="text-xs text-slate-500 mb-4">A brief overview of your experience, skills, and goals.</p>
                <textarea value={data.summary.text} onChange={e => setData({...data, summary: { text: e.target.value }})} rows={8} placeholder="Senior AI Engineer with 5+ years building production LLM systems..." className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B47] resize-none" />
                <button className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF6B47] to-[#ff8366] text-white text-sm font-bold rounded-lg">
                  <Sparkles className="w-4 h-4" /> Generate with AI
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

            {['certifications', 'languages'].includes(activeSection) && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-3 capitalize">{activeSection}</h2>
                <p className="text-sm text-slate-500">Coming soon — this section is under construction.</p>
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
                <div>
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: template.color }}>EDUCATION</div>
                  {data.education.filter(e => e.school || e.degree).map(e => (
                    <div key={e.id} className="text-[10px] mb-1">
                      <div className="font-bold text-slate-900">{e.degree}</div>
                      <div className="text-slate-600">{e.school} · {e.period}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
