import React from 'react';

const DEMO_DATA = {
  personal: {
    name: 'Rahul Sharma',
    title: 'Senior Software Engineer',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/rahulsharma',
    github: 'github.com/rahulsharma',
  },
  summary: {
    text: 'Senior Software Engineer with 7+ years building scalable systems at top tech companies. Led teams of 5–10 engineers delivering products used by millions. Expert in distributed systems, cloud architecture, and cross-functional leadership.',
  },
  experiences: [
    {
      id: '1', role: 'Senior Software Engineer', company: 'Google', period: '2022 — Present',
      bullets: [
        'Led Search API migration to GraphQL; cut response time 45% for 2B+ queries/day',
        'Mentored 6 junior engineers; 2 promoted to senior within 12 months',
        'Shipped real-time collaboration feature adopted by 50M+ users globally',
      ],
    },
    {
      id: '2', role: 'Software Engineer', company: 'Amazon', period: '2019 — 2022',
      bullets: [
        'Built React component library for 15 internal products; saved 1,400 dev-hours/quarter',
        'Reduced app bundle 38%; cut load time from 4.2s → 1.8s',
        'Owned checkout flow processing ₹800Cr+ monthly transactions',
      ],
    },
    {
      id: '3', role: 'Frontend Developer', company: 'Flipkart', period: '2017 — 2019',
      bullets: [
        'Redesigned seller dashboard; +28% task completion across 300K active sellers',
        'Built A/B testing framework enabling 40+ concurrent experiments per quarter',
      ],
    },
  ],
  education: [
    { id: '1', school: 'IIT Bombay', degree: 'B.Tech — Computer Science', period: '2013 — 2017', cgpa: '8.9' },
  ],
  skillCategories: [
    { id: '1', category: 'Languages', skills: 'JavaScript, TypeScript, Python, Java, Go' },
    { id: '2', category: 'Frontend', skills: 'React, Next.js, Vue.js, Tailwind CSS, GraphQL' },
    { id: '3', category: 'Backend', skills: 'Node.js, PostgreSQL, Redis, Kafka, Elasticsearch' },
    { id: '4', category: 'Cloud & DevOps', skills: 'AWS, Docker, Kubernetes, Terraform, CI/CD, GitHub Actions' },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect — Professional', issuer: 'Amazon', date: '2023' },
    { id: '2', name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2022' },
    { id: '3', name: 'Google Cloud Professional Developer', issuer: 'Google', date: '2021' },
  ],
  languages: [
    { id: '1', name: 'English', level: 'Fluent' },
    { id: '2', name: 'Hindi', level: 'Native' },
    { id: '3', name: 'Kannada', level: 'Basic' },
  ],
};

const ResumePreview = ({ data, template, customSections = [], isModal = false }) => {
  const c = template.color;
  const layout = template.layout || 'classic';

  const isEmpty =
    !data?.personal?.name?.trim() &&
    !data?.experiences?.[0]?.company?.trim() &&
    !data?.experiences?.[0]?.role?.trim();
  const d = isEmpty ? DEMO_DATA : data;

  const s = isModal ? {
    name: 'text-[27px]', title: 'text-[14px]', contact: 'text-[11px]',
    label: 'text-[10px] tracking-[0.14em]', body: 'text-[13px]',
    small: 'text-[11px]', bullet: 'text-[12px]',
    g: 'mb-5', sg: 'mb-3', p: 32,
  } : {
    name: 'text-[16px]', title: 'text-[9px]', contact: 'text-[7.5px]',
    label: 'text-[7px] tracking-[0.1em]', body: 'text-[8px]',
    small: 'text-[7.5px]', bullet: 'text-[7.5px]',
    g: 'mb-2', sg: 'mb-1', p: 12,
  };

  const allContact = [
    d.personal.email, d.personal.phone, d.personal.location,
    d.personal.linkedin, d.personal.github,
  ].filter(Boolean);

  const SectionLabel = ({ title, invert }) => {
    if (layout === 'executive') {
      return (
        <div className={`${s.label} font-extrabold uppercase pl-2 border-l-[3px] mb-1.5`}
          style={{ color: c, borderColor: c }}>{title}</div>
      );
    }
    if (layout === 'minimal') {
      return (
        <div className={`${s.label} font-extrabold uppercase border-b pb-0.5 mb-1.5 text-slate-400 border-slate-200`}>
          {title}
        </div>
      );
    }
    if (layout === 'bold') {
      return (
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex-shrink-0 rounded-sm" style={{ width: 3, height: isModal ? 12 : 8, background: c }} />
          <span className={`${s.label} font-extrabold uppercase`} style={{ color: c }}>{title}</span>
        </div>
      );
    }
    return (
      <div className={`${s.label} font-extrabold uppercase border-b pb-0.5 mb-1.5`}
        style={{
          color: invert ? 'rgba(255,255,255,0.55)' : c,
          borderColor: invert ? 'rgba(255,255,255,0.2)' : `${c}45`,
        }}>{title}</div>
    );
  };

  const ExpItems = ({ col }) => (
    <>
      {d.experiences?.filter(e => e.company || e.role).map(e => (
        <div key={e.id} className={s.sg}>
          <div className="flex items-baseline justify-between gap-1">
            <span className={`${s.body} font-bold text-slate-900`}>{e.role}</span>
            <span className={`${s.small} text-slate-400 flex-shrink-0`}>{e.period}</span>
          </div>
          <div className={`${s.small} font-semibold mb-0.5`} style={{ color: col || c }}>{e.company}</div>
          {e.bullets?.filter(Boolean).map((b, i) => (
            <div key={i} className={`${s.bullet} text-slate-600 flex gap-1`}>
              <span className="flex-shrink-0 mt-px">•</span><span>{b}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );

  const SkillItems = ({ invert }) => (
    <>
      {d.skillCategories?.filter(sc => sc.skills).map(sc => (
        <div key={sc.id} className={`${s.small} mb-0.5 flex gap-1`}>
          {sc.category && (
            <span className="flex-shrink-0 font-semibold"
              style={{ color: invert ? 'rgba(255,255,255,0.5)' : undefined }}>
              {sc.category}:
            </span>
          )}
          <span style={{ color: invert ? 'rgba(255,255,255,0.7)' : '#475569' }}>{sc.skills}</span>
        </div>
      ))}
    </>
  );

  const EduItems = ({ invert, col }) => (
    <>
      {d.education?.filter(e => e.school || e.degree).map(e => (
        <div key={e.id} className={s.sg}>
          <div className={`${s.body} font-bold`} style={{ color: invert ? '#fff' : '#0f172a' }}>{e.degree}</div>
          <div className={`${s.small} font-semibold`} style={{ color: invert ? 'rgba(255,255,255,0.65)' : (col || c) }}>
            {e.school}
          </div>
          <div className={`${s.small}`} style={{ color: invert ? 'rgba(255,255,255,0.45)' : '#94a3b8' }}>
            {[e.period, e.cgpa ? `GPA: ${e.cgpa}` : ''].filter(Boolean).join(' · ')}
          </div>
        </div>
      ))}
    </>
  );

  const CertItems = ({ invert }) => (
    <>
      {d.certifications?.filter(cert => cert.name).map(cert => (
        <div key={cert.id} className={`${s.small} mb-0.5`}
          style={{ color: invert ? 'rgba(255,255,255,0.7)' : '#475569' }}>
          {[cert.name, cert.issuer, cert.date].filter(Boolean).join(' · ')}
        </div>
      ))}
    </>
  );

  const LangItems = ({ invert }) => (
    <div className={`${s.small} text-slate-600`}>
      {d.languages?.filter(l => l.name).map(l => (
        <span key={l.id} style={{ color: invert ? 'rgba(255,255,255,0.7)' : undefined }}>
          {l.name} ({l.level}){'  '}
        </span>
      ))}
    </div>
  );

  // ── SIDEBAR ──────────────────────────────────────────────────────────────
  if (layout === 'sidebar') {
    return (
      <div className="flex min-h-full">
        <div className="flex-shrink-0" style={{ width: '36%', background: c, padding: s.p }}>
          <div className={`${s.name} font-extrabold text-white leading-tight`}>
            {d.personal.name || 'Your Name'}
          </div>
          <div className={`${s.title} font-bold mt-0.5`} style={{ color: 'rgba(255,255,255,0.7)' }}>
            {d.personal.title || 'Your Role'}
          </div>
          {allContact.length > 0 && (
            <div className={`${s.contact} mt-2 space-y-0.5`} style={{ color: 'rgba(255,255,255,0.6)' }}>
              {allContact.map((item, i) => <div key={i}>{item}</div>)}
            </div>
          )}
          {d.skillCategories?.filter(sc => sc.skills).length > 0 && (
            <div className={`mt-3 ${s.g}`}>
              <SectionLabel title="SKILLS" invert />
              <SkillItems invert />
            </div>
          )}
          {d.education?.filter(e => e.school || e.degree).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="EDUCATION" invert />
              <EduItems invert />
            </div>
          )}
          {d.certifications?.filter(cert => cert.name).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="CERTIFICATIONS" invert />
              <CertItems invert />
            </div>
          )}
          {d.languages?.filter(l => l.name).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="LANGUAGES" invert />
              <LangItems invert />
            </div>
          )}
        </div>

        <div className="flex-1" style={{ padding: s.p }}>
          {d.summary?.text && (
            <div className={s.g}>
              <SectionLabel title="SUMMARY" />
              <p className={`${s.body} text-slate-600 leading-relaxed`}>{d.summary.text}</p>
            </div>
          )}
          {d.experiences?.filter(e => e.company || e.role).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="EXPERIENCE" />
              <ExpItems />
            </div>
          )}
          {customSections.filter(cs => cs.name).map(cs => (
            <div key={cs.id} className={s.g}>
              <SectionLabel title={cs.name.toUpperCase()} />
              <p className={`${s.body} text-slate-600 leading-relaxed whitespace-pre-line`}>{cs.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── BOLD HEADER ──────────────────────────────────────────────────────────
  if (layout === 'bold') {
    return (
      <div>
        <div style={{ background: c, padding: s.p, paddingBottom: isModal ? 20 : 10 }}>
          <div className={`${s.name} font-extrabold text-white leading-tight`}>
            {d.personal.name || 'Your Name'}
          </div>
          <div className={`${s.title} font-bold mt-0.5`} style={{ color: 'rgba(255,255,255,0.75)' }}>
            {d.personal.title || 'Your Role'}
          </div>
          {allContact.length > 0 && (
            <div className={`${s.contact} mt-1`} style={{ color: 'rgba(255,255,255,0.65)' }}>
              {allContact.join(' · ')}
            </div>
          )}
        </div>
        <div style={{ padding: s.p, paddingTop: isModal ? 20 : 10 }}>
          {d.summary?.text && (
            <div className={s.g}>
              <SectionLabel title="SUMMARY" />
              <p className={`${s.body} text-slate-600 leading-relaxed`}>{d.summary.text}</p>
            </div>
          )}
          {d.experiences?.filter(e => e.company || e.role).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="EXPERIENCE" />
              <ExpItems />
            </div>
          )}
          {d.skillCategories?.filter(sc => sc.skills).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="SKILLS" />
              <SkillItems />
            </div>
          )}
          {d.education?.filter(e => e.school || e.degree).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="EDUCATION" />
              <EduItems />
            </div>
          )}
          {d.certifications?.filter(cert => cert.name).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="CERTIFICATIONS" />
              <CertItems />
            </div>
          )}
          {d.languages?.filter(l => l.name).length > 0 && (
            <div className={s.g}>
              <SectionLabel title="LANGUAGES" />
              <LangItems />
            </div>
          )}
          {customSections.filter(cs => cs.name).map(cs => (
            <div key={cs.id} className={s.g}>
              <SectionLabel title={cs.name.toUpperCase()} />
              <p className={`${s.body} text-slate-600 leading-relaxed whitespace-pre-line`}>{cs.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── CLASSIC / EXECUTIVE / MINIMAL ────────────────────────────────────────
  const isMinimal = layout === 'minimal';
  const accentColor = isMinimal ? '#64748b' : c;

  return (
    <div style={{ padding: s.p }}>
      <div
        className={`${s.g} pb-3 border-b-2 ${layout === 'classic' ? 'text-center' : ''}`}
        style={{ borderColor: isMinimal ? '#e2e8f0' : c }}
      >
        <div className={`${s.name} font-extrabold leading-tight text-slate-900`}>
          {d.personal.name || 'Your Name'}
        </div>
        <div className={`${s.title} font-bold mt-0.5`} style={{ color: accentColor }}>
          {d.personal.title || 'Your Role'}
        </div>
        <div className={`${s.contact} text-slate-500 mt-1`}>{allContact.join(' · ')}</div>
      </div>

      {d.summary?.text && (
        <div className={s.g}>
          <SectionLabel title="SUMMARY" />
          <p className={`${s.body} text-slate-600 leading-relaxed`}>{d.summary.text}</p>
        </div>
      )}
      {d.experiences?.filter(e => e.company || e.role).length > 0 && (
        <div className={s.g}>
          <SectionLabel title="EXPERIENCE" />
          <ExpItems col={accentColor} />
        </div>
      )}
      {d.skillCategories?.filter(sc => sc.skills).length > 0 && (
        <div className={s.g}>
          <SectionLabel title="SKILLS" />
          <SkillItems />
        </div>
      )}
      {d.education?.filter(e => e.school || e.degree).length > 0 && (
        <div className={s.g}>
          <SectionLabel title="EDUCATION" />
          <EduItems col={accentColor} />
        </div>
      )}
      {d.certifications?.filter(cert => cert.name).length > 0 && (
        <div className={s.g}>
          <SectionLabel title="CERTIFICATIONS" />
          <CertItems />
        </div>
      )}
      {d.languages?.filter(l => l.name).length > 0 && (
        <div className={s.g}>
          <SectionLabel title="LANGUAGES" />
          <LangItems />
        </div>
      )}
      {customSections.filter(cs => cs.name).map(cs => (
        <div key={cs.id} className={s.g}>
          <SectionLabel title={cs.name.toUpperCase()} />
          <p className={`${s.body} text-slate-600 leading-relaxed whitespace-pre-line`}>{cs.content}</p>
        </div>
      ))}
    </div>
  );
};

export const TemplateThumbnail = ({ template }) => {
  const c = template.color;
  const layout = template.layout;

  if (layout === 'sidebar') {
    return (
      <div className="rounded overflow-hidden bg-white" style={{ height: 46 }}>
        <div className="flex h-full">
          <div className="w-2/5 flex-shrink-0 p-1" style={{ background: c }}>
            <div className="h-1 rounded mb-0.5" style={{ background: 'rgba(255,255,255,0.65)', width: '80%' }} />
            <div className="h-0.5 rounded mb-1" style={{ background: 'rgba(255,255,255,0.4)', width: '60%' }} />
            <div className="space-y-0.5">
              {[1, 0.8, 0.6, 0.9, 0.7, 0.5].map((w, i) => (
                <div key={i} className="h-0.5 rounded" style={{ background: 'rgba(255,255,255,0.28)', width: `${w * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-0.5 rounded" style={{ background: `${c}55`, width: '65%' }} />
            {[1, 0.85, 0.7, 0.9, 0.75, 0.6, 0.8, 0.65].map((w, i) => (
              <div key={i} className="h-0.5 rounded bg-slate-200" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'bold') {
    return (
      <div className="rounded overflow-hidden bg-white" style={{ height: 46 }}>
        <div style={{ background: c, height: 13, padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
          <div className="rounded" style={{ height: 4, width: '55%', background: 'rgba(255,255,255,0.7)' }} />
        </div>
        <div className="p-1 space-y-0.5">
          <div className="flex items-center gap-0.5">
            <div className="rounded-sm flex-shrink-0" style={{ width: 2, height: 5, background: c }} />
            <div className="h-0.5 rounded" style={{ background: `${c}70`, width: '50%' }} />
          </div>
          {[1, 0.8, 0.65, 0.9, 0.75, 0.55, 0.85, 0.7].map((w, i) => (
            <div key={i} className="h-0.5 rounded bg-slate-200" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'executive') {
    return (
      <div className="rounded overflow-hidden bg-white p-1" style={{ height: 46 }}>
        <div className="mb-0.5">
          <div className="h-1 rounded bg-slate-800 mb-0.5" style={{ width: '55%' }} />
          <div className="h-0.5 rounded" style={{ background: c, width: '40%' }} />
        </div>
        <div className="border-b mb-0.5" style={{ borderColor: `${c}40` }} />
        {[1, 0.8, 1, 0.75, 1, 0.85, 0.6].map((w, i) => (
          <div key={i} className={`flex items-center gap-0.5 ${i % 2 === 0 ? 'mt-0.5' : ''}`}>
            {i % 2 === 0 ? (
              <>
                <div className="rounded-sm flex-shrink-0" style={{ width: 2, height: 5, background: c }} />
                <div className="h-0.5 rounded flex-1" style={{ background: `${c}65` }} />
              </>
            ) : (
              <div className="h-0.5 rounded bg-slate-200 ml-2.5" style={{ width: `${w * 100}%` }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div className="rounded overflow-hidden bg-white p-1" style={{ height: 46 }}>
        <div className="mb-0.5">
          <div className="h-1 rounded bg-slate-800 mb-0.5" style={{ width: '55%' }} />
          <div className="h-0.5 rounded bg-slate-400" style={{ width: '40%' }} />
        </div>
        <div className="border-b border-slate-200 mb-0.5" />
        <div className="space-y-0.5">
          <div className="h-0.5 rounded bg-slate-300" style={{ width: '45%' }} />
          {[1, 0.85, 0.7, 0.45, 1, 0.8, 0.65, 0.9].map((w, i) => (
            <div key={i} className="h-0.5 rounded bg-slate-200" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    );
  }

  // classic
  return (
    <div className="rounded overflow-hidden bg-white p-1" style={{ height: 46 }}>
      <div className="text-center mb-0.5">
        <div className="h-1 rounded bg-slate-800 mx-auto mb-0.5" style={{ width: '55%' }} />
        <div className="h-0.5 rounded mx-auto" style={{ background: c, width: '40%' }} />
      </div>
      <div className="border-b mb-0.5 pb-0.5" style={{ borderColor: `${c}45` }} />
      <div className="space-y-0.5">
        <div className="h-0.5 rounded" style={{ background: `${c}70`, width: '45%' }} />
        {[1, 0.8, 0.45, 1, 0.75, 0.6, 0.85, 0.5].map((w, i) => (
          <div key={i} className="h-0.5 rounded bg-slate-200" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;
