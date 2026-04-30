import axios from 'axios';
import supabase from './supabase';

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  // Codespaces: swap the -3000 port in the current URL for -8000
  if (hostname.includes('.app.github.dev')) {
    return `https://${hostname.replace('-3000.app.github.dev', '-8000.app.github.dev')}`;
  }
  // Production / deployed domain — use env variable
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
};

const BACKEND_URL = getBackendUrl();

const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_BASE, timeout: 180000 });

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) config.headers.Authorization = `Bearer ${session.access_token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      err.message = err.response?.data?.detail || 'Your session could not access this feature. Please try again.';
    }
    return Promise.reject(err);
  }
);

export const resumeApi = {
  list: () => Promise.resolve([]),
  create: () => Promise.resolve(null),
  get: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
};

export const atsApi = {
  analyzeText: (resume_text, target_role) => api.post('/ats/analyze', { resume_text, target_role }).then(r => r.data),
  analyzeFile: (file, target_role) => {
    const fd = new FormData();
    fd.append('file', file);
    if (target_role) fd.append('target_role', target_role);
    return api.post('/ats/analyze-file', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  applyFixes: (resume_text, fixes, target_role) =>
    api.post('/ats/apply-fixes', { resume_text, fixes, target_role }).then(r => r.data),
  downloadFixedDocx: (originalFileBase64, resumeData) =>
    api.post('/ats/download-fixed-docx', { original_file_base64: originalFileBase64, resume_data: resumeData }, { responseType: 'blob' }).then(r => r.data),
};

export const jdApi = {
  tailor: (resume_text, jd_text) => api.post('/jd/tailor', { resume_text, jd_text }).then(r => r.data),
  tailorFile: (file, jd_text) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('jd_text', jd_text);
    return api.post('/jd/tailor-file', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
};

export const aiApi = {
  generate: (prompt, context, kind = 'summary') => api.post('/ai/generate', { prompt, context, kind }).then(r => r.data),
};

export const jobsApi = {
  search: (payload) => api.post('/jobs/search', payload).then(r => r.data),
};

export default api;
