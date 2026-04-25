import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_BASE, timeout: 120000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ik_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('ik_token');
      localStorage.removeItem('ik_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }).then(r => r.data),
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  google: (profile) => api.post('/auth/google', profile).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  updatePlan: (plan) => api.patch(`/auth/me/plan?plan=${plan}`).then(r => r.data),
};

export const resumeApi = {
  list: () => api.get('/resumes').then(r => r.data),
  create: (payload) => api.post('/resumes', payload).then(r => r.data),
  get: (id) => api.get(`/resumes/${id}`).then(r => r.data),
  update: (id, payload) => api.put(`/resumes/${id}`, payload).then(r => r.data),
  delete: (id) => api.delete(`/resumes/${id}`).then(r => r.data),
};

export const atsApi = {
  analyzeText: (resume_text, target_role) => api.post('/ats/analyze', { resume_text, target_role }).then(r => r.data),
  analyzeFile: (file, target_role) => {
    const fd = new FormData();
    fd.append('file', file);
    if (target_role) fd.append('target_role', target_role);
    return api.post('/ats/analyze-file', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
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
  save: (job) => api.post('/jobs/save', job).then(r => r.data),
  saved: () => api.get('/jobs/saved').then(r => r.data),
  unsave: (id) => api.delete(`/jobs/saved/${id}`).then(r => r.data),
};

export const paymentsApi = {
  createOrder: (plan, billing) => api.post('/payments/create-order', { plan, billing }).then(r => r.data),
  verify: (payload) => api.post('/payments/verify', payload).then(r => r.data),
};

export default api;
