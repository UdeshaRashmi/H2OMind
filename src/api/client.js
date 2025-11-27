const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

export const authApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

export const usersApi = {
  get: (id) => request(`/users/${id}`),
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const usageApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/usage${query ? `?${query}` : ''}`);
  },
  create: (data) => request('/usage', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/usage/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/usage/${id}`, { method: 'DELETE' }),
};

export const insightsApi = {
  summary: (userId) => request(`/insights/summary?userId=${userId}`),
  alerts: (userId) => request(`/insights/alerts?userId=${userId}`),
};

export default {
  authApi,
  usersApi,
  usageApi,
  insightsApi,
};

