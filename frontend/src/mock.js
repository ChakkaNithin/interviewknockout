// Mock data for resume builder app

export const mockTemplates = [
  { id: 'double-column', name: 'Double Column', tag: 'Popular', category: 'modern', color: '#0F3D2E' },
  { id: 'ivy-league', name: 'Ivy League', tag: 'Executive', category: 'classic', color: '#1E3A5F' },
  { id: 'elegant', name: 'Elegant', tag: 'Professional', category: 'classic', color: '#2D3748' },
  { id: 'contemporary', name: 'Contemporary', tag: 'New', category: 'modern', color: '#0D6B4F' },
  { id: 'modern', name: 'Modern', tag: 'Recommended', category: 'modern', color: '#FF6B47' },
  { id: 'timeline', name: 'Timeline', tag: 'Creative', category: 'creative', color: '#7C3AED' },
  { id: 'creative', name: 'Creative', tag: 'Design', category: 'creative', color: '#EC4899' },
  { id: 'stylish', name: 'Stylish', tag: 'Fashion', category: 'creative', color: '#0891B2' },
  { id: 'single-column', name: 'Single Column', tag: 'Minimal', category: 'simple', color: '#334155' },
  { id: 'compact', name: 'Compact', tag: 'Efficient', category: 'simple', color: '#64748B' },
  { id: 'polished', name: 'Polished', tag: 'Clean', category: 'modern', color: '#0F766E' },
  { id: 'multicolumn', name: 'Multi Column', tag: 'Versatile', category: 'modern', color: '#B45309' },
];

export const mockStats = [
  { value: '15M+', label: 'Resumes Optimized' },
  { value: '10M+', label: 'Job Matches Found' },
  { value: '11 Yrs', label: 'Helping Job Seekers' },
  { value: '1M+', label: 'Interview Calls Generated' },
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
  { name: 'Jacqueline', role: 'Marketing Manager', rating: 5, text: 'Excellent and easy. No hassle no fuss. Landed my dream job in 2 weeks!', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '1 day ago' },
  { name: 'Carla', role: 'Product Designer', rating: 4, text: 'The platform is great. Templates are beautiful and ATS-friendly. Still learning all the features.', avatar: 'https://images.pexels.com/photos/30004323/pexels-photo-30004323.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '1 day ago' },
  { name: 'Ricardo O.', role: 'Software Engineer', rating: 5, text: 'Pretty intuitive. Suggestions made sense. Formatting the CV which usually is a pain was super easy.', avatar: 'https://images.pexels.com/photos/14589344/pexels-photo-14589344.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '4 days ago' },
  { name: 'Julien', role: 'Data Analyst', rating: 5, text: 'Built a CV in 2 hours flat. I can adapt it to different templates, I love it! Highly recommend!', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '2 days ago' },
  { name: 'Sarah M.', role: 'Solutions Engineer', rating: 5, text: 'InterviewKnockout changed my life: One week and four interviews later, I will be making 150% more.', avatar: 'https://images.pexels.com/photos/15640958/pexels-photo-15640958.jpeg?auto=compress&cs=tinysrgb&w=200', daysAgo: '3 days ago' },
  { name: 'Priya K.', role: 'AI Engineer', rating: 5, text: 'The ATS checker caught issues I never would have seen. Got 3 interview calls in a week.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=200', daysAgo: '5 days ago' },
];

export const mockPricing = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with basic resume creation',
    features: ['1 Resume', 'Basic Templates (3)', 'PDF Download', 'Basic ATS Check', 'Community Support'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    period: 'month',
    description: 'Everything you need to land the job',
    features: ['Unlimited Resumes', 'All Premium Templates (20+)', 'AI Content Generation', 'Advanced ATS Checker', 'One-Click JD Tailoring', 'Cover Letter Builder', 'Priority Support'],
    cta: 'Start Pro Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    period: 'month',
    description: 'For serious job seekers who want it all',
    features: ['Everything in Pro', 'Advanced Job Search', 'AI Interview Prep', '1-on-1 Expert Review', 'LinkedIn Profile Optimizer', 'Career Coaching Session', '24/7 Premium Support'],
    cta: 'Go Premium',
    highlighted: false,
  },
];

export const mockFaqs = [
  { q: 'Why use InterviewKnockout for your job application?', a: 'InterviewKnockout helps you build a resume that feels personal and gets remembered. Modern, intuitive, and enjoyable. With expert guidance at every step, highlight your skills, achievements, and personality.' },
  { q: 'Is InterviewKnockout free to use?', a: 'Yes, InterviewKnockout is free to use. New users get full access to all features for 7 days. After that, you can continue with the free tier or upgrade to Pro.' },
  { q: 'Are your resumes ATS-friendly?', a: 'Every template is tested against major ATS systems (Workday, Taleo, Greenhouse, Lever). We use clean layouts, readable fonts, and standard section titles.' },
  { q: 'What AI tools does InterviewKnockout offer?', a: 'Our AI tools help you rewrite content with industry-relevant language, generate bullet points, translate resumes into 30+ languages, and tailor resumes to any job description with one click.' },
  { q: 'Do you support languages other than English?', a: 'Yes! We support Spanish, French, German, Italian, Swedish, Portuguese, Dutch, Danish, Finnish, Czech, Polish, and Norwegian.' },
  { q: 'How to use the InterviewKnockout Builder?', a: 'Upload your old resume or enter your job title to pick a template. Drag and drop sections, fill in details, use AI tips and proofreading. Tailor to any JD in one click, then download as PDF.' },
  { q: 'Is my data secure and GDPR compliant?', a: 'Yes. Your data is fully encrypted, never sold, and only accessed to provide our service. InterviewKnockout is GDPR-compliant. You can export or delete your information anytime.' },
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
