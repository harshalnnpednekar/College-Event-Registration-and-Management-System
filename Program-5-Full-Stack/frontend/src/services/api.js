/**
 * API Client Service
 * Connects Frontend to Express.js REST API with JWT authorization
 */

const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cp_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || (data.errors ? data.errors.join(', ') : `HTTP ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getProfile: () => request('/auth/me', { method: 'GET' }),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getEventById: (id) => request(`/events/${id}`, { method: 'GET' }),
  createEvent: (payload) => request('/events', { method: 'POST', body: payload }),
  updateEvent: (id, payload) => request(`/events/${id}`, { method: 'PUT', body: payload }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Registrations (Student)
  registerForEvent: (eventId) => request('/registrations', { method: 'POST', body: { event_id: eventId } }),
  getMyRegistrations: () => request('/registrations/my', { method: 'GET' }),
  cancelRegistration: (id) => request(`/registrations/${id}`, { method: 'DELETE' }),

  // Admin
  getAllRegistrations: () => request('/registrations/all', { method: 'GET' }),
  getAdminStats: () => request('/registrations/stats', { method: 'GET' })
};
