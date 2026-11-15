import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

// Админ: посты на модерации. onCountChange сообщает родителю число постов для счётчика на вкладке.
const PendingPosts = ({ onCountChange }) => {
  const { addToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await postsAPI.getPending();
        if (cancelled) return;
        if (data.ok) {
          setPosts(data.posts || []);
          onCountChange?.((data.posts || []).length);
        } else {
          addToast(data.errors?.detail?.[0] || 'Ошибка загрузки постов', 'error');
        }
      } catch (error) {
        console.error('Ошибка загрузки постов на модерации:', error);
        if (!cancelled) addToast('Ошибка загрузки постов', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moderate = async (post, action) => {
    setBusyId(post.id);
    try {
      const data = action === 'approve'
        ? await postsAPI.approve(post.id)
        : await postsAPI.reject(post.id);
      if (data.ok) {
        const rest = posts.filter((p) => p.id !== post.id);
        setPosts(rest);
        onCountChange?.(rest.length);
        addToast(action === 'approve' ? 'Пост опубликован' : 'Пост отклонён', 'success');
      } else {
        addToast(data.errors?.detail?.[0] || 'Не удалось выполнить действие', 'error');
      }
    } catch (error) {
      console.error('Ошибка модерации:', error);
      addToast('Ошибка при модерации', 'error');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>Нет постов на модерации</p>
      </div>
    );
  }

  return (
    <div className="admin-articles-list">
      {posts.map((post) => (
        <div key={post.id} className="card admin-article-item">
          <div className="admin-article-info">
            <h3 className="admin-article-title">{post.title}</h3>
            <p className="pending-post-text">
              {post.text.length > 160 ? post.text.slice(0, 160) + '…' : post.text}
            </p>
            <div className="admin-article-meta">
              <span>✍️ {post.author?.username}</span>
              <span>📅 {new Date(post.created).toLocaleDateString('ru-RU')}</span>
              {post.tags?.length > 0 && <span>🏷️ {post.tags.join(', ')}</span>}
            </div>
          </div>
          <div className="admin-article-actions">
            <button
              className="btn-primary admin-action-btn"
              disabled={busyId === post.id}
              onClick={() => moderate(post, 'approve')}
            >
              ✓ Одобрить
            </button>
            <button
              className="btn-delete admin-action-btn"
              disabled={busyId === post.id}
              onClick={() => moderate(post, 'reject')}
            >
              ✕ Отклонить
            </button>
            <Link to={`/posts/${post.id}`} className="btn-secondary admin-view-btn" target="_blank">
              Смотреть →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingPosts;
