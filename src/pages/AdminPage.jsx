import { useState, useEffect } from 'react';
import { articlesAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import CreateArticleModal from '../components/CreateArticleModal';
import EditArticleModal from '../components/EditArticleModal';
import ParseArticlesButton from '../components/ParseArticlesButton';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import PendingPosts from '../components/PendingPosts';

const PAGE_SIZE = 10;

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('articles');
  const [pendingCount, setPendingCount] = useState(null);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isStaff = !!user?.is_staff;

  // Редирект только когда ответ /api/auth/me/ уже получен
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/');
    } else if (!user.is_staff) {
      addToast('Доступ запрещён', 'error');
      navigate('/');
    }
  }, [authLoading, user, navigate, addToast]);

  // Список статей: общее число берём из total, страницы переключаем через page/size
  useEffect(() => {
    if (!isStaff) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await articlesAPI.getAll({ page, size: PAGE_SIZE });
        if (cancelled) return;
        if (data.ok) {
          setArticles(data.articles || []);
          setTotal(data.total ?? 0);
          setTotalPages(data.total_pages || 1);
        } else {
          addToast('Ошибка загрузки статей', 'error');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        if (!cancelled) addToast('Ошибка загрузки статей', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isStaff, page, reloadKey, addToast]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const data = await articlesAPI.delete(deleteTarget.id);
      if (data.ok) {
        addToast('Статья удалена', 'success');
        // Если удалили последнюю статью на странице, уходим на предыдущую
        if (articles.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          reload();
        }
      } else {
        addToast(data.errors?.detail?.[0] || 'Ошибка при удалении', 'error');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      addToast('Ошибка при удалении', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleParsed = () => {
    if (page === 1) reload();
    else setPage(1);
  };

  if (authLoading || !user) {
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
          <ParseArticlesButton onDone={handleParsed} />
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Создать статью
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${tab === 'articles' ? 'active' : ''}`}
            onClick={() => setTab('articles')}
          >
            📰 Статьи ({total})
          </button>
          <button
            className={`tab-btn ${tab === 'moderation' ? 'active' : ''}`}
            onClick={() => setTab('moderation')}
          >
            🛡️ Модерация постов{pendingCount !== null ? ` (${pendingCount})` : ''}
          </button>
        </div>

        {tab === 'articles' && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-value">{total}</div>
                <div className="stat-label">Всего статей</div>
              </div>
            </div>

            <h2 className="section-subtitle">Все статьи</h2>

            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : articles.length === 0 ? (
              <div className="empty-state">
                <p>Статей пока нет</p>
                <p>Нажми «Создать статью» или «Обновить статьи из источников»</p>
              </div>
            ) : (
              <>
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
                          onClick={() => setDeleteTarget(article)}
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
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </>
        )}

        {/* Рендерим вкладку всегда, но скрываем, чтобы счётчик в заголовке вкладки был известен сразу */}
        <div style={{ display: tab === 'moderation' ? 'block' : 'none' }}>
          <h2 className="section-subtitle">Посты на модерации</h2>
          <PendingPosts onCountChange={setPendingCount} />
        </div>
      </div>

      {showCreateModal && (
        <CreateArticleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            if (page === 1) reload();
            else setPage(1);
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
            reload();
            addToast('Статья обновлена!', 'success');
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Удалить статью?"
          message={`«${deleteTarget.title}» будет удалена без возможности восстановления.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
