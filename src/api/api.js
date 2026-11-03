function getCSRF() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith('csrftoken=')) {
      return cookie.substring('csrftoken='.length);
    }
  }
  return '';
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCSRF(),
  };
  console.log('📋 Headers:', headers);
  console.log('🍪 All cookies:', document.cookie);
  return headers;
}
//Авторизация
export const authAPI = {
  getCSRF: () =>
    fetch('/api/auth/csrf/', {
      credentials: 'same-origin',
    }).then(res => {
      console.log('🍪 CSRF cookie set, cookies:', document.cookie);
      return res.json();
    }),

  getMe: () =>
    fetch('/api/auth/me/', {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  register: (data) => {
    console.log('📤 Register data:', data);
    const body = JSON.stringify(data);
    console.log('📦 Register body:', body);
    return fetch('/api/auth/register/', {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
      body: body,
    }).then(async (res) => {
      const json = await res.json();
      console.log('📥 Register response:', json);
      return json;
    });
  },

  login: (data) => {
    console.log('📤 Login data:', data);
    const body = JSON.stringify(data);
    console.log('📦 Login body:', body);
    return fetch('/api/auth/login/', {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
      body: body,
    }).then(async (res) => {
      const json = await res.json();
      console.log('📥 Login response:', json);
      return json;
    });
  },

  logout: () =>
    fetch('/api/auth/logout/', {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  updateProfile: (formData) =>
    fetch('/api/profile/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRF(),
      },
      credentials: 'same-origin',
      body: formData,
    }).then(res => res.json()),
};
//Посты
export const postsAPI = {
  getAll: (page = 1) =>
    fetch(`/api/posts/?page=${page}`, {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  getById: (id) =>
    fetch(`/api/posts/${id}/`, {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  create: (formData) =>
    fetch('/api/posts/create/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRF(),
      },
      credentials: 'same-origin',
      body: formData, 
    }).then(res => res.json()),

  delete: (id) =>
  fetch(`/api/posts/${id}/delete/`, {  
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'same-origin',
  }).then(res => res.json()),

  like: (id) =>
    fetch(`/api/posts/${id}/like/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  getComments: (id) =>
    fetch(`/api/posts/${id}/comments/`, {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  addComment: (id, text) =>
    fetch(`/api/posts/${id}/comments/create/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ text }),
    }).then(res => res.json()),
};

//СТАТЬИ 
export const articlesAPI = {
  getAll: (tag = '', sort = 'newest') => {
    let url = '/api/articles/?';
    if (tag) url += `tag=${encodeURIComponent(tag)}&`;
    if (sort) url += `sort=${sort}`;
    return fetch(url, {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json());
  },

  getById: (id) =>
    fetch(`/api/articles/${id}/`, {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  create: (data) =>
    fetch('/api/articles/create/', {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify(data),
    }).then(res => res.json()),

  update: (id, data) =>
    fetch(`/api/articles/${id}/edit/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify(data),
    }).then(res => res.json()),

  delete: (id) =>
    fetch(`/api/articles/${id}/delete/`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  getFavorites: () =>
    fetch('/api/articles/favorites/', {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),

  getRecommendations: () =>
    fetch('/api/articles/recommendations/', {
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),
};

//ИЗБРАННОЕ
export const favoritesAPI = {
  toggle: (articleId) =>
    fetch(`/api/articles/${articleId}/favorite/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'same-origin',
    }).then(res => res.json()),
};