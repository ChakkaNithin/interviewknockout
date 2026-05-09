// Mock data for resume builder app

export const mockTemplates = [
  { id: 'classic',    name: 'Classic',    tag: 'Popular',        layout: 'classic',   color: '#0F3D2E' },
  { id: 'sidebar',    name: 'Sidebar',    tag: 'Modern',         layout: 'sidebar',   color: '#1E3A5F' },
  { id: 'executive',  name: 'Executive',  tag: 'Professional',   layout: 'executive', color: '#0D3D8C' },
  { id: 'bold',       name: 'Bold',       tag: 'Creative',       layout: 'bold',      color: '#FF6B47' },
  { id: 'minimal',    name: 'Minimal',    tag: 'Clean',          layout: 'minimal',   color: '#334155' },
];

export const mockStats = [
  { value: '5,000+', label: 'Resumes Optimized' },
  { value: '850+',   label: 'Job Matches Found' },
  { value: '3 Yrs',  label: 'Helping Job Seekers' },
  { value: '400+',   label: 'Interview Calls Generated' },
];

export const mockFeatures = [
  {
    id: 1,
    title: 'Leave proofreading to AI tech',
    description: 'A built-in checker keeps grammar, clichés, and readability under control.',
    points: ['Wording and readability analysis', 'Error and typo elimination', 'Smart suggestions tailored to your job'],
    icon: 'SpellCheck',
  },
  {
    id: 2,
    title: 'Tailor your resume in one click',
    description: 'Paste the job description—our AI updates your resume to match the role.',
    points: ['Section creation and updates', 'Job-relevant skills and action verbs', 'Title and bullet point alignment'],
    icon: 'Target',
  },
  {
    id: 3,
    title: 'Choose from 20+ professional sections',
    description: 'Present your story in clean, eye-catching formats built for recruiters.',
    points: ['Experience, Skills, Summary, Education', 'Strengths, Quotes, Interests', 'Certifications, Awards, Projects'],
    icon: 'LayoutGrid',
  },
  {
    id: 4,
    title: 'Make sure your resume beats the ATS',
    description: 'Our ATS check ensures your resume reaches recruiters exactly as designed.',
    points: ['Detect keyword and content gaps', 'Actionable suggestions to pass AI scans', 'Compatible with top ATS systems'],
    icon: 'ShieldCheck',
  },
];

export const mockTestimonials = [
  { name: 'Priya Sharma', role: 'Product Manager, Bangalore', rating: 5, text: 'Got 4 interview calls in 10 days after using InterviewKnockout. The ATS optimization made a huge difference!', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '2 days ago' },
  { name: 'Arjun Mehta', role: 'Software Engineer, Hyderabad', rating: 5, text: 'Built my entire resume in under 2 hours. The templates are clean and the download just works perfectly.', avatar: 'https://images.pexels.com/photos/14589344/pexels-photo-14589344.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '3 days ago' },
  { name: 'Sneha Reddy', role: 'Data Analyst, Chennai', rating: 5, text: 'The JD tailoring feature is brilliant. Matched my resume to the job description and landed my dream role!', avatar: 'https://images.pexels.com/photos/15640958/pexels-photo-15640958.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '1 day ago' },
  { name: 'Rahul Nair', role: 'Business Analyst, Mumbai', rating: 5, text: 'Super easy to use. Formatting used to take me days — done in 1 hour here. Highly recommend to everyone.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '4 days ago' },
  { name: 'Kavya Iyer', role: 'UI/UX Designer, Pune', rating: 5, text: 'Loved how the resume looked instantly professional. Got shortlisted by 3 top companies within a week.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '5 days ago' },
  { name: 'Vikram Patel', role: 'DevOps Engineer, Delhi', rating: 5, text: 'InterviewKnockout helped me land a 60% salary hike. The curated job matches were spot on for my profile.', avatar: 'https://images.pexels.com/photos/30004323/pexels-photo-30004323.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '6 days ago' },
];

export const mockPricing = [
  {
    id: 'free',
    name: 'Basic',
    price: 0,
    originalPrice: null,
    period: 'free',
    description: 'Build and download your resume at no cost — forever',
    features: [
      'Resume Builder (unlimited)',
      'All Templates',
      'Download as Word (.docx)',
      'Custom Sections',
    ],
    cta: 'Start Free',
    highlighted: false,
    badge: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    originalPrice: 699,
    period: 'one-time',
    description: 'ATS Score, JD Tailoring & 15–20 curated job matches — done for you',
    features: [
      'Full ATS Score Report',
      'Book your 1-1 expert call',
      'Expert Resume Rewrite',
      'JD Tailoring for 1 Job Description',
      '15–20 Curated Job Matches',
      'Direct Application Links',
      '24–48 hr Delivery',
      'Priority Support',
    ],
    cta: 'Get Pro',
    highlighted: false,
    badge: '',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 899,
    originalPrice: 1299,
    period: 'one-time',
    description: 'Everything in Pro — more job matches, deeper recruiter research',
    features: [
      'Everything in Pro',
      'Book your 1-1 expert call',
      '30–40 Curated Job Matches',
      'Recruiter Contact Details',
      'Deeper Company Research',
      'Priority 24hr Delivery',
      'Direct Recruiter Outreach Tips',
      'Dedicated Support',
    ],
    cta: 'Get Premium',
    highlighted: true,
    badge: 'Best Value',
  },
];

export const mockFaqs = [
  { q: 'What is InterviewKnockout and how does it work?', a: 'InterviewKnockout is an expert resume service. You build your resume for free using our Resume Builder. If you want an ATS score, JD tailoring, or curated job matches — our expert team does it for you after a quick 15-minute consultation call. No AI guesswork, real human expertise.' },
  { q: 'Is the Resume Builder really free?', a: 'Yes, completely free — forever. Pick a professional template, fill in your details, and download your resume as a Word file at no cost. No trial period, no hidden charges.' },
  { q: 'What is the difference between Pro and Premium?', a: 'Both plans include an ATS score report, expert resume rewrite, and JD tailoring. Pro gives you 15–20 curated job matches. Premium gives you 30–40 job matches plus recruiter contact details and deeper company research — ideal if you want a more aggressive job search.' },
  { q: 'What happens after I make a payment?', a: 'After payment, you will be redirected to book a 15-minute consultation call with our expert. On the call, you share your resume and job goals. Our team then delivers your ATS report, rewritten resume, and curated job list within 24–48 hours.' },
  { q: 'Are the resume templates ATS-friendly?', a: 'Yes. Every template is built and tested against major ATS systems including Workday, Taleo, Greenhouse, and Lever. We use clean layouts, standard section headings, and readable fonts to ensure your resume parses correctly.' },
  { q: 'Is this a monthly subscription or a one-time payment?', a: 'One-time payment only. Pay once for Pro (₹499) or Premium (₹899) and receive your complete deliverables. There are no recurring charges, no auto-renewals, and no hidden fees.' },
  { q: 'Is my data safe?', a: 'Yes. We only store your name, email, and phone number — nothing more. Your resume content is used solely to deliver your order and is never shared or sold. You can request deletion of your data at any time by contacting our support team.' },
];

export const mockResumes = [
  { id: 'r1', title: 'Senior AI Engineer Resume', template: 'double-column', score: 88, lastEdited: '2 hours ago', targetRole: 'AI/ML Engineer' },
  { id: 'r2', title: 'Product Manager Resume', template: 'modern', score: 72, lastEdited: '1 day ago', targetRole: 'Product Manager' },
  { id: 'r3', title: 'Software Developer Resume', template: 'elegant', score: 81, lastEdited: '3 days ago', targetRole: 'Full Stack Developer' },
];

export const mockUser = {
  id: 'u1',
  name: 'Nithin Chakka',
  email: 'nithin@example.com',
  plan: 'pro',
  avatar: null,
};

// ATS Checker Mock
export const mockATSResult = {
  score: 63,
  metrics: [
    { label: 'Keywords Match', score: 72, color: '#4F8EF7' },
    { label: 'Formatting / ATS Parse', score: 42, color: '#EF4444' },
    { label: 'Skills Section', score: 80, color: '#22C55E' },
    { label: 'Work Experience', score: 75, color: '#4F8EF7' },
    { label: 'Education', score: 90, color: '#22C55E' },
    { label: 'Quantifiable Impact', score: 15, color: '#EF4444' },
  ],
  keywords: ['Python', 'LangGraph', 'AWS Bedrock', 'FastAPI', 'LLM', 'Multi-Agent', 'Neo4j', 'Azure OpenAI'],
  missingKeywords: ['Machine Learning', 'NLP', 'CI/CD', 'Docker', 'Kubernetes', 'RAG', 'Vector DB'],
  pros: [
    'Comprehensive technical skills section covering 8 categories clearly',
    'Three strong production-level projects with real business context',
    'Good use of action verbs: Built, Developed, Implemented, Engineered',
    'Education clearly structured with CGPA and year of passing',
    'Relevant certifications (Neo4j Professional, Salesforce Agentforce)',
    'Strong summary that positions AI automation expertise well',
  ],
  cons: [
    'Resume uses tables — most ATS parsers cannot read table-based layouts',
    'Zero quantifiable metrics across all 3 projects (no %, no numbers, no scale)',
    'No LinkedIn or GitHub profile URL anywhere in the resume',
    'Location is completely missing from contact info',
    'Job title "GenAI Developer" is non-standard — ATS may not match searches',
    'Missing high-demand keywords: Docker, RAG, Vector DB, CI/CD, NLP',
    'Bullet points are paragraph-style — hard for ATS to parse',
  ],
  fixes: [
    { priority: 'HIGH', section: 'Entire Resume', fix: 'Remove all table-based layouts — convert to plain text sections. ATS systems like Workday, Taleo, and Greenhouse cannot parse table cells.' },
    { priority: 'HIGH', section: 'Work Experience', fix: "Add measurable impact to every bullet point. Example: 'Reduced manual localization effort by 70% by automating 3-stage QC pipeline'." },
    { priority: 'HIGH', section: 'Contact Info', fix: 'Add LinkedIn URL and GitHub profile to contact section. Recruiters and ATS systems expect these for tech roles.' },
    { priority: 'HIGH', section: 'Contact Info', fix: 'Add your location (City, State) to the contact section. Many ATS systems filter by location.' },
    { priority: 'MEDIUM', section: 'Header', fix: "Change job title from 'GenAI Developer' to 'AI/ML Engineer' or 'Generative AI Engineer' — these match more ATS search queries." },
    { priority: 'MEDIUM', section: 'Skills', fix: 'Add missing high-demand keywords: RAG, Vector Databases (Pinecone/Chroma), Docker, Kubernetes, NLP, CI/CD pipelines.' },
    { priority: 'MEDIUM', section: 'Summary', fix: "Rewrite summary to include target role: 'Seeking Senior AI Engineer roles in healthcare/pharma AI automation'." },
    { priority: 'LOW', section: 'Work Experience', fix: 'Break paragraph-style bullet points into single-line achievement statements.' },
  ],
};

export const mockJDTailorResult = {
  matchScore: 94,
  keywordsAdded: ['RAG', 'Vector Databases', 'CDISC Standards', 'Clinical Trial Workflows', 'eCRF', 'eCOA', 'Drug Development', 'Regulatory Compliance'],
  keywordsPresent: ['LangGraph', 'AWS Bedrock', 'Azure OpenAI', 'Python', 'FastAPI', 'Neo4j', 'Multi-agent'],
  sectionsUpdated: [
    { section: 'Professional Summary', change: 'Rewritten to target Clinical AI roles — mentions drug development, CDISC standards, and regulatory compliance explicitly.' },
    { section: 'Skills Section', change: 'Added RAG, Vector Databases, CDISC, Docker, CI/CD, Clinical Trial Workflows to match JD requirements.' },
    { section: 'Project 1 — eCOA System', change: 'Reordered to top position (most relevant). Added CDISC compliance and regulatory submission language.' },
    { section: 'Project 2 — eCRF System', change: 'Strengthened clinical trial terminology. Highlighted Medidata Rave and protocol PDF processing.' },
    { section: 'Key Impact Summary', change: 'Added regulatory compliance metric and clinical trial throughput numbers aligned with pharma scale.' },
  ],
  unchangedSections: ['Education', 'Certifications', 'Contact Info'],
};

export const mockSampleJD = `Senior Generative AI Engineer — Healthcare AI
Pfizer Digital | Remote (US/India)

We are looking for a Senior Generative AI Engineer to join our Clinical AI team building next-generation automation systems for drug development.

Requirements:
• 3+ years experience with LLMs, multi-agent systems, and production AI pipelines
• Strong proficiency in Python, LangChain/LangGraph, and prompt engineering
• Experience with RAG (Retrieval-Augmented Generation) and Vector Databases
• Hands-on with AWS Bedrock, Azure OpenAI, or equivalent cloud AI services
• Knowledge of clinical trial workflows, eCRF, eCOA, or CDISC standards is a strong plus
• FastAPI or similar backend frameworks for AI service deployment
• Familiarity with Neo4j or graph databases preferred
• Docker, CI/CD pipelines, and production deployment experience

Responsibilities:
• Design and build multi-agent LLM workflows for clinical document processing
• Integrate AI systems with existing clinical data platforms
• Collaborate with medical and regulatory teams to ensure compliance
• Own end-to-end AI pipeline delivery from design to production`;

export const mockJobs = [
  { id: 1, score: 94, priority: 'EXCELLENT', site: 'job_board', title: 'Senior AI/ML Engineer', company: 'Infosys', location: 'Bangalore, Karnataka, India', job_type: 'Full-time', date_posted: '2 days ago', is_remote: false, min_amount: 25, max_amount: 40, currency: 'LPA', skills: ['Python', 'LangChain', 'AWS', 'FastAPI', 'LLM'], experience_range: '5-8 years', company_rating: 4.1, description: 'We are seeking a Senior AI/ML Engineer to build LLM-driven automation systems and multi-agent workflows for enterprise clients across pharma and healthcare.', job_url: '#' },
  { id: 2, score: 89, priority: 'EXCELLENT', site: 'job_board', title: 'GenAI Developer', company: 'TCS', location: 'Hyderabad, Telangana, India', job_type: 'Full-time', date_posted: '1 day ago', is_remote: false, min_amount: 18, max_amount: 30, currency: 'LPA', skills: ['Python', 'LangGraph', 'Azure OpenAI', 'FastAPI', 'Neo4j'], experience_range: '3-6 years', company_rating: 3.9, description: 'Looking for GenAI Developer with LangChain/LangGraph experience to build production AI pipelines for clinical document automation.', job_url: '#' },
  { id: 3, score: 83, priority: 'EXCELLENT', site: 'job_board', title: 'Machine Learning Engineer', company: 'Wipro', location: 'Pune, Maharashtra, India', job_type: 'Full-time', date_posted: '3 days ago', is_remote: true, min_amount: 20, max_amount: 35, currency: 'LPA', skills: ['Python', 'AWS Bedrock', 'NLP', 'Docker', 'FastAPI'], experience_range: '4-7 years', company_rating: 3.8, description: 'ML Engineer role working on NLP and deep learning pipelines for enterprise AI automation. Strong Python and cloud experience required.', job_url: '#' },
  { id: 4, score: 77, priority: 'GOOD', site: 'job_board', title: 'AI Automation Engineer', company: 'HCL Technologies', location: 'Chennai, Tamil Nadu, India', job_type: 'Full-time', date_posted: '4 days ago', is_remote: false, min_amount: 15, max_amount: 25, currency: 'LPA', skills: ['Python', 'LangChain', 'REST API', 'AWS'], experience_range: '2-5 years', company_rating: 3.7, description: 'Design and implement AI automation pipelines for enterprise clients. Experience with LLMs, prompt engineering, and Python required.', job_url: '#' },
  { id: 5, score: 71, priority: 'GOOD', site: 'job_board', title: 'Generative AI Engineer', company: 'Cognizant', location: 'Bangalore, Karnataka, India', job_type: 'Full-time', date_posted: '5 days ago', is_remote: true, min_amount: 22, max_amount: 38, currency: 'LPA', skills: ['Python', 'AWS Bedrock', 'Vector DB', 'FastAPI'], experience_range: '3-7 years', company_rating: 4.0, description: 'Build and deploy generative AI solutions for Fortune 500 clients. Strong experience in LLM frameworks and cloud platforms required.', job_url: '#' },
  { id: 6, score: 65, priority: 'GOOD', site: 'job_board', title: 'LLM Engineer - Healthcare AI', company: 'Philips India', location: 'Pune, Maharashtra, India', job_type: 'Full-time', date_posted: '6 days ago', is_remote: false, min_amount: 28, max_amount: 45, currency: 'LPA', skills: ['Python', 'LangGraph', 'Azure OpenAI', 'Neo4j'], experience_range: '5-10 years', company_rating: 4.2, description: 'Build LLM-powered solutions for healthcare data processing and clinical document automation using Azure OpenAI and LangGraph.', job_url: '#' },
  { id: 7, score: 55, priority: 'FAIR', site: 'job_board', title: 'NLP Engineer', company: 'Mu Sigma', location: 'Bangalore, Karnataka, India', job_type: 'Full-time', date_posted: '7 days ago', is_remote: false, min_amount: 12, max_amount: 22, currency: 'LPA', skills: ['Python', 'NLP', 'BERT', 'FastAPI'], experience_range: '2-4 years', company_rating: 3.6, description: 'NLP Engineer to build text classification, entity extraction, and summarization models for business intelligence products.', job_url: '#' },
  { id: 8, score: 44, priority: 'FAIR', site: 'job_board', title: 'Data Scientist - AI Products', company: 'Accenture', location: 'Mumbai, Maharashtra, India', job_type: 'Full-time', date_posted: '5 days ago', is_remote: false, min_amount: 14, max_amount: 24, currency: 'LPA', skills: ['Python', 'ML', 'TensorFlow'], experience_range: '2-5 years', company_rating: 4.0, description: 'Data Scientist role building ML models and AI-powered products for global clients across retail and BFSI sectors.', job_url: '#' },
];

export const trustedCompanies = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Adobe', 'Infosys', 'Walmart', 'Deloitte', 'JP Morgan', 'Meta', 'Spotify', 'Oracle'];
