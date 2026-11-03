import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../api/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('info'); 
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    patronymic: '',
    email: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        patronymic: user.patronymic || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'favorites' && user) {
      loadFavorites();
    }
  }, [activeTab, user]);

  const loadFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const data = await articlesAPI.getFavorites();
      setFavorites(data.articles || []);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      addToast('Ошибка загрузки избранного', 'error');
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Файл больше 2 МБ', 'error');
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('patronymic', formData.patronymic);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('bio', formData.bio);
    
    const avatarFile = fileInputRef.current?.files[0];
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    }

    try {
      await updateProfile(formDataToSend);
      addToast('Профиль обновлён!', 'success');
      setEditing(false);
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        for (const [field, msgs] of Object.entries(error.errors)) {
          newErrors[field] = msgs[0];
        }
        setErrors(newErrors);
      } else {
        addToast('Ошибка обновления', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading-page">Загрузка...</div>;
  }

  const fullName = [user.last_name, user.first_name, user.patronymic]
    .filter(Boolean)
    .join(' ') || user.username;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Аватар" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{fullName}</h1>
            <div className="profile-username">@{user.username}</div>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
          </div>

          <button 
            className="btn-primary"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Отмена' : 'Редактировать'}
          </button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            ℹ️ Информация
          </button>
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ⭐ Избранное ({favorites.length})
          </button>
        </div>


        {activeTab === 'info' && (
          <>
            {editing && (
              <form className="profile-form card" onSubmit={handleSubmit}>
                <h3 className="form-title">Редактировать профиль</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Имя</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`cyber-input ${errors.first_name ? 'error' : ''}`}
                    />
                    {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Фамилия</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`cyber-input ${errors.last_name ? 'error' : ''}`}
                    />
                    {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Отчество</label>
                    <input
                      type="text"
                      name="patronymic"
                      value={formData.patronymic}
                      onChange={handleChange}
                      className={`cyber-input ${errors.patronymic ? 'error' : ''}`}
                    />
                    {errors.patronymic && <span className="error-text">{errors.patronymic}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`cyber-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">О себе</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className={`cyber-input ${errors.bio ? 'error' : ''}`}
                  />
                  {errors.bio && <span className="error-text">{errors.bio}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Аватар</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="cyber-input file-input"
                  />
                  {errors.avatar && <span className="error-text">{errors.avatar}</span>}
                </div>

                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                </button>
              </form>
            )}

            <div className="profile-details card">
              <h3 className="form-title">Информация</h3>
              <div className="detail-row">
                <span className="detail-label">Имя пользователя:</span>
                <span>{user.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span>{user.email || 'Не указан'}</span>
              </div>
              {user.is_staff && (
                <div className="detail-row">
                  <span className="detail-label">Роль:</span>
                  <span className="accent-text">Администратор</span>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            {loadingFavorites ? (
              <div className="loading">Загрузка...</div>
            ) : favorites.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет избранных статей</p>
                <Link to="/articles" className="btn-primary" style={{marginTop: '20px', display: 'inline-block'}}>
                  Перейти к статьям
                </Link>
              </div>
            ) : (
              <div className="favorites-list">
                {favorites.map((article) => (
                  <Link key={article.id} to={`/articles/${article.id}`} className="article-link">
                    <div className="card favorite-article-card">
                      <h3 className="favorite-article-title">{article.title}</h3>
                      {article.tags?.length > 0 && (
                        <div className="article-tags">
                          {article.tags.map(tag => (
                            <span key={tag} className="article-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="favorite-article-meta">
                        <span>✍️ {article.author}</span>
                        <span>📅 {article.created}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;