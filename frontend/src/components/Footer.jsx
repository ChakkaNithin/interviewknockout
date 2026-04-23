import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Resume Builder', to: '/' },
        { label: 'ATS Checker', to: '/ats-checker' },
        { label: 'JD Tailor', to: '/jd-tailor' },
        { label: 'Job Search', to: '/jobs' },
        { label: 'Pricing', to: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Resume Examples', to: '/' },
        { label: 'Cover Letter Templates', to: '/' },
        { label: 'Career Blog', to: '/' },
        { label: 'Interview Prep', to: '/' },
        { label: 'Help Center', to: '/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/' },
        { label: 'Careers', to: '/' },
        { label: 'Press Kit', to: '/' },
        { label: 'Contact', to: '/' },
        { label: 'Reviews', to: '/' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/' },
        { label: 'Terms of Service', to: '/' },
        { label: 'GDPR', to: '/' },
        { label: 'Cookie Policy', to: '/' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0F3D2E] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B47] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white">InterviewKnockout</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-5 max-w-xs">
              The modern resume builder trusted by 15M+ job seekers worldwide. Build, tailor, and land the job.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF6B47] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-300 hover:text-[#FF6B47] transition-colors">
                      {link.label}
                    </Link>
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
