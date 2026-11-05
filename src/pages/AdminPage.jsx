import { useState, useEffect } from 'react';
import { articlesAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import CreateArticleModal from '../components/CreateArticleModal';
import EditArticleModal from '../components/EditArticleModal';
import ParseArticlesButton from '../components/ParseArticlesButton';


const AdminPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);

  useEffect(() => {
    if (user && !user.is_staff) {
      addToast('Доступ запрещён', 'error');
      navigate('/');
    }
  }, [user, navigate, addToast]);

  useEffect(() => {
    if (user?.is_staff) {
      loadArticles();
    }
  }, [user]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await articlesAPI.getAll();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      addToast('Ошибка загрузки статей', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить статью "${title}"?`)) return;
    
    try {
      const data = await articlesAPI.delete(id);
      if (data.ok) {
        loadArticles();
        addToast('Статья удалена', 'success');
      }
    } catch (error) {
      addToast('Ошибка при удалении', 'error');
    }
  };

  if (!user) {
    return <div className="loading-page">Загрузка...</div>;
  }

  if (!user.is_staff) {
    return <div className="loading-page">Доступ запрещён</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="page-title">АДМИН-ПАНЕЛЬ</h1>
          <ParseArticlesButton />
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Создать статью
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{articles.length}</div>
            <div className="stat-label">Всего статей</div>
          </div>
        </div>

        <h2 className="section-subtitle">Все статьи</h2>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <p>Статей пока нет</p>
            <p>Нажми "Создать статью" или запусти парсер в Django админке</p>
          </div>
        ) : (
          <div className="admin-articles-list">
            {articles.map((article) => (
              <div key={article.id} className="card admin-article-item">
                <div className="admin-article-info">
                  <h3 className="admin-article-title">{article.title}</h3>
                  <div className="admin-article-meta">
                    <span>✍️ {article.author}</span>
                    <span>📅 {article.created}</span>
                    {article.tags?.length > 0 && (
                      <span className="admin-article-tags">
                        🏷️ {article.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="admin-article-actions">
                  <button 
                    className="btn-secondary admin-action-btn"
                    onClick={() => setEditArticle(article)}
                  >
                    ✏️ Редактировать
                  </button>
                  <button 
                    className="btn-delete admin-action-btn"
                    onClick={() => handleDelete(article.id, article.title)}
                  >
                    🗑️ Удалить
                  </button>
                  <a 
                    href={`/articles/${article.id}`} 
                    className="btn-secondary admin-view-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Смотреть →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateArticleModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadArticles();
            addToast('Статья создана!', 'success');
          }}
        />
      )}

      {editArticle && (
        <EditArticleModal
          article={editArticle}
          onClose={() => setEditArticle(null)}
          onUpdated={() => {
            setEditArticle(null);
            loadArticles();
            addToast('Статья обновлена!', 'success');
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;