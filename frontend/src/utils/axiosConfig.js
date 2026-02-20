import axios from 'axios';

// ── Auth header on every request ──────────────────────────
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Redirect to login on 401 ──────────────────────────────
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Simple in-memory GET cache (60s TTL) ──────────────────
const cache = new Map();
const TTL   = 60_000; // 1 minute

export const cachedGet = async (url) => {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const res  = await axios.get(url);
  cache.set(url, { data: res, ts: Date.now() });
  return res;
};

export const invalidateCache = (urlPattern) => {
  for (const key of cache.keys()) {
    if (key.includes(urlPattern)) cache.delete(key);
  }
};

export default axios;
