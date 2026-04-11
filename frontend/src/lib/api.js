/**
 * Rentlee API utility
 * All requests to the Express backend go through here.
 * The Rentlee JWT is stored in localStorage under 'rentlee_token'.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002/api/v1';

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage || typeof window.localStorage.getItem !== 'function') return null;
    return window.localStorage.getItem('rentlee_token') ?? null;
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem('rentlee_token', token);
    }
  } catch { /* no-op */ }
};

export const clearToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
      window.localStorage.removeItem('rentlee_token');
    }
  } catch { /* no-op */ }
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

const apiFetch = async (path, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────

export const loginUser = async (email, password) => {
  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return result.data; // { user, token }
};

export const registerNormalUser = async (userData) => {
  const result = await apiFetch('/auth/register/user', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return result.data;
};

export const registerLister = async (listerData) => {
  const result = await apiFetch('/auth/register/lister', {
    method: 'POST',
    body: JSON.stringify(listerData),
  });
  return result.data;
};

// ─── User ────────────────────────────────────────────────────────────────────

export const getMe = () => apiFetch('/users/me');

export const updateMe = (data) =>
  apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(data) });

export const getSavedProperties = () => apiFetch('/users/me/saved');

export const saveProperty = (propertyId) =>
  apiFetch(`/users/me/saved/${propertyId}`, { method: 'POST' });

export const unsaveProperty = (propertyId) =>
  apiFetch(`/users/me/saved/${propertyId}`, { method: 'DELETE' });

// ─── Listings (Formerly Properties) ──────────────────────────────────────────

/**
 * Fetch listings with optional filters.
 */
export const fetchProperties = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== 'Any' && val !== 'Any type' && val !== 'Any price') {
      params.set(key, val);
    }
  });
  const query = params.toString();
  return apiFetch(`/listings${query ? `?${query}` : ''}`);
};

export const fetchPropertyById = (id) => apiFetch(`/listings/${id}`);

export const createProperty = (data) =>
  apiFetch('/listings', { method: 'POST', body: JSON.stringify(data) });

export const updateProperty = (id, data) =>
  apiFetch(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProperty = (id) =>
  apiFetch(`/listings/${id}`, { method: 'DELETE' });

export const getMyListings = () => apiFetch('/listings/lister/dashboard');

export const getListerStats = () => apiFetch('/listings/lister/stats');


// ─── Blogs ───────────────────────────────────────────────────────────────────

export const fetchBlogs = ({ page = 1, limit = 9, tag } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (tag) params.set('tag', tag);
  return apiFetch(`/blogs?${params.toString()}`);
};

export const fetchBlogBySlug = (slug) => apiFetch(`/blogs/${slug}`);

export const createBlog = (data) =>
  apiFetch('/blogs', { method: 'POST', body: JSON.stringify(data) });

export const updateBlog = (id, data) =>
  apiFetch(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ─── Admin Tools ─────────────────────────────────────────────────────────────

export const fetchAdminStats = () => apiFetch('/admin/stats');

export const fetchAllUsers = (page = 1, limit = 10) => 
  apiFetch(`/admin/users?page=${page}&limit=${limit}`);

export const fetchPendingListers = (page = 1, limit = 10) => 
  apiFetch(`/admin/listers/pending?page=${page}&limit=${limit}`);

export const fetchAllListers = (statusFilter = '', page = 1, limit = 10) => {
  const query = new URLSearchParams({ page, limit });
  if (statusFilter && statusFilter !== 'All') query.set('status', statusFilter.toLowerCase());
  return apiFetch(`/admin/listers?${query.toString()}`);
};

export const approveLister = (id) => 
  apiFetch(`/admin/listers/${id}/approve`, { method: 'PATCH' });

export const rejectLister = (id, reason) => 
  apiFetch(`/admin/listers/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });

export const suspendLister = (id) => 
  apiFetch(`/admin/listers/${id}/suspend`, { method: 'PATCH' });

export const adminDeleteListing = (id) => 
  apiFetch(`/admin/listings/${id}`, { method: 'DELETE' });

// ─── Enquiries ─────────────────────────────────────────────────────────────

export const sendEnquiry = (propertyId, message) =>
  apiFetch('/enquiries', { method: 'POST', body: JSON.stringify({ propertyId, message }) });

export const getMyEnquiries = () => apiFetch('/enquiries/my');

export const markEnquiryRead = (id) =>
  apiFetch(`/enquiries/${id}/read`, { method: 'PATCH' });

