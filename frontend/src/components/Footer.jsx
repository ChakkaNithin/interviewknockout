import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Instagram, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Resume Builder', to: '/builder' },
        { label: 'ATS Checker', to: '/ats-checker' },
        { label: 'JD Tailor', to: '/jd-tailor' },
        { label: 'Job Search', to: '/jobs' },
        { label: 'Pricing', to: '/pricing' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Resume Templates', to: '/#templates' },
        { label: 'Features', to: '/#features' },
        { label: 'Reviews', to: '/#reviews' },
        { label: 'FAQ', to: '/pricing' },
      ],
    },
  ];

  const socials = [
    {
      Icon: Instagram,
      href: 'https://www.instagram.com/interviewknockout?igsh=MXY5emZ4YjBsbHppOQ==',
      label: 'Instagram',
      active: true,
    },
    {
      Icon: Facebook,
      href: 'https://www.facebook.com/share/1CvAjZB1qm/',
      label: 'Facebook',
      active: true,
    },
    {
      Icon: Twitter,
      href: null,
      label: 'Twitter — coming soon',
      active: false,
    },
    {
      Icon: Linkedin,
      href: null,
      label: 'LinkedIn — coming soon',
      active: false,
    },
  ];

  return (
    <footer className="bg-[#0F3D2E] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand + social + contact */}
          <div className="col-span-2 md:col-span-2">
            <div className="mb-4">
              <img src={logo} alt="InterviewKnockout" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-5 max-w-xs">
              The modern resume builder trusted by 15M+ job seekers worldwide. Build, tailor, and land the job.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mb-6">
              {socials.map(({ Icon, href, label, active }) =>
                active ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF6B47] flex items-center justify-center transition-colors duration-200"
                    title={label}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ) : (
                  <button
                    key={label}
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center opacity-40 cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </button>
                )
              )}
            </div>

            {/* Support contact */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Support</p>
              <a
                href="mailto:hr@interviewknockout.in"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#FF6B47] transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-[#FF6B47]/20 flex items-center justify-center transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B47]" />
                </span>
                hr@interviewknockout.in
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('/#') ? (
                      <a href={link.to} className="text-sm text-slate-300 hover:text-[#FF6B47] transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-sm text-slate-300 hover:text-[#FF6B47] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} InterviewKnockout. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>🌐 English</span>
            <span>🔒 GDPR Compliant</span>
            <span>⭐ 4.8/5 Rating</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
