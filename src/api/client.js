const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let authUser = null;

function setAuthUser(user) {
  authUser = user;
}

function getAuthUser() {
  if (!authUser) {
    const stored = localStorage.getItem('h2omind:user');
    authUser = stored ? JSON.parse(stored) : null;
  }
  return authUser;
}

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
    const user = getAuthUser();
    const query = new URLSearchParams({ ...params, ...(user?.id && !params.userId ? { userId: user.id } : {}) }).toString();
    return request(`/usage${query ? `?${query}` : ''}`);
  },
  create: (data) => {
    const user = getAuthUser();
    return request('/usage', { method: 'POST', body: JSON.stringify({ ...data, userId: data.userId || user?.id }) });
  },
  update: (id, data) => request(`/usage/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/usage/${id}`, { method: 'DELETE' }),
};

export const insightsApi = {
  summary: (userId) => {
    const user = getAuthUser();
    const id = userId || user?.id;
    return request(`/insights/summary?userId=${id}`);
  },
  alerts: (userId) => {
    const user = getAuthUser();
    const id = userId || user?.id;
    return request(`/insights/alerts?userId=${id}`);
  },
};

export { setAuthUser, getAuthUser };

export default {
  authApi,
  usersApi,
  usageApi,
  insightsApi,
  setAuthUser,
  getAuthUser,
};

