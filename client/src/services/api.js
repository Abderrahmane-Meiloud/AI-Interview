import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const publicPaths = ['/login', '/signup', '/register'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
};

export const resumeAPI = {
  upload: (formData, onProgress) =>
    API.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    }),
  get: () => API.get('/resume'),
};

export const jobProfileAPI = {
  create: (data) => API.post('/job-profile', data),
  get: () => API.get('/job-profile'),
};

export const interviewAPI = {
  start: () => API.post('/interview/start'),
  submitAnswer: (id, answer) => API.post(`/interview/${id}/answer`, { answer }),
  complete: (id) => API.post(`/interview/${id}/complete`),
  getHistory: () => API.get('/interview/history'),
  getById: (id) => API.get(`/interview/${id}`),
  getCurrent: (id) => API.get(`/interview/${id}/current`),
};

export const dashboardAPI = {
  get: () => API.get('/dashboard'),
  getProgress: () => API.get('/dashboard/progress'),
};

export default API;
