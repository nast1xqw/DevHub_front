let unauthorizedHandler = null;

// AuthContext регистрирует сюда обработчик: он вызывается при любом ответе 401.
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

async function request(url, { method = 'GET', json, formData } = {}) {
  const headers = {};
  let body;
  if (formData !== undefined) {
    body = formData; 
  } else if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'same-origin',
    body,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, errors: { detail: ['Ошибка сервера'] } };
  }

  if (res.status === 401 && unauthorizedHandler) {
    unauthorizedHandler();
  }
  return data;
}

const qs = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

// Авторизация
export const authAPI = {
  getMe: () => request('/api/auth/me/'),
  register: (data) => request('/api/auth/register/', { method: 'POST', json: data }),
  login: (data) => request('/api/auth/login/', { method: 'POST', json: data }),
  logout: () => request('/api/auth/logout/', { method: 'POST' }),
  updateProfile: (formData) => request('/api/profile/', { method: 'POST', formData }),
};

// Посты
export const postsAPI = {
  getAll: ({ page = 1, size = 10 } = {}) =>
    request(`/api/posts/${qs({ page, size })}`),

  getById: (id) => request(`/api/posts/${id}/`),
  create: (formData) => request('/api/posts/create/', { method: 'POST', formData }),
  delete: (id) => request(`/api/posts/${id}/delete/`, { method: 'DELETE' }),
  like: (id) => request(`/api/posts/${id}/like/`, { method: 'POST' }),
  getComments: (id) => request(`/api/posts/${id}/comments/`),
  addComment: (id, text) =>
    request(`/api/posts/${id}/comments/create/`, { method: 'POST', json: { text } }),

  // Модерация
  getPending: () => request('/api/posts/pending/'),
  approve: (id) => request(`/api/posts/${id}/approve/`, { method: 'POST' }),
  reject: (id) => request(`/api/posts/${id}/reject/`, { method: 'POST' }),
};

// Статьи
export const articlesAPI = {
  getAll: ({ tag = '', sort = 'newest', page = 1, size = 12 } = {}) =>
    request(`/api/articles/${qs({ tag, sort, page, size })}`),

  getById: (id) => request(`/api/articles/${id}/`),
  create: (data) => request('/api/articles/create/', { method: 'POST', json: data }),
  update: (id, data) => request(`/api/articles/${id}/edit/`, { method: 'POST', json: data }),
  delete: (id) => request(`/api/articles/${id}/delete/`, { method: 'DELETE' }),
  getFavorites: () => request('/api/articles/favorites/'),
  getRecommendations: () => request('/api/articles/recommendations/'),

  getTags: async () => {
    const tags = new Set();
    let page = 1;
    let totalPages = 1;
    do {
      const data = await articlesAPI.getAll({ page, size: 50 });
      (data.articles || []).forEach((a) => (a.tags || []).forEach((t) => tags.add(t)));
      totalPages = data.total_pages || 1;
      page += 1;
    } while (page <= totalPages && page <= 10);
    return [...tags].sort((a, b) => a.localeCompare(b));
  },
};

// Избранное
export const favoritesAPI = {
  toggle: (articleId) => request(`/api/articles/${articleId}/favorite/`, { method: 'POST' }),
};

// Парсинг статей
export const parseAPI = {
  parseArticles: () => request('/api/articles/parse/', { method: 'POST' }),
};