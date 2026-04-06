/**
 * Rentlee API utility
 * All requests to the Express backend go through here.
 * The Rentlee JWT is stored in localStorage under 'rentlee_token'.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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

// ─── Auth / User sync ─────────────────────────────────────────────────────────

/**
 * Call this right after a successful Firebase login/signup.
 * It syncs the Firebase user to MongoDB and stores the Rentlee JWT.
 *
 * @param {import('firebase/auth').User} firebaseUser
 * @returns {Promise<{ user: object, token: string }>}
 */
export const syncWithBackend = async (firebaseUser) => {
  const result = await apiFetch('/users/sync', {
    method: 'POST',
    body: JSON.stringify({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
    }),
  });

  setToken(result.data.token);
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

// ─── Properties ──────────────────────────────────────────────────────────────

/**
 * Fetch properties with optional filters.
 * Filters match the BrowseHero search form.
 *
 * @param {{ city?: string, category?: string, minRent?: number, maxRent?: number, bedrooms?: number, page?: number, limit?: number }} filters
 */
export const fetchProperties = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== 'Any' && val !== 'Any type' && val !== 'Any price') {
      params.set(key, val);
    }
  });
  const query = params.toString();
  return apiFetch(`/properties${query ? `?${query}` : ''}`);
};

export const fetchPropertyById = (id) => apiFetch(`/properties/${id}`);

export const createProperty = (data) =>
  apiFetch('/properties', { method: 'POST', body: JSON.stringify(data) });

export const updateProperty = (id, data) =>
  apiFetch(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProperty = (id) =>
  apiFetch(`/properties/${id}`, { method: 'DELETE' });

export const getMyListings = () => apiFetch('/properties/my-listings');

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

export const deleteBlog = (id) =>
  apiFetch(`/blogs/${id}`, { method: 'DELETE' });
