import { useState, useEffect } from 'react';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await postsAPI.getAll({ page, size: PAGE_SIZE });
        if (cancelled) return;
        if (data.ok) {
          setPosts(data.posts || []);
          setTotalPages(data.total_pages || 1);
        } else {
          addToast('Ошибка загрузки постов', 'error');
        }
      } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        if (!cancelled) addToast('Ошибка загрузки постов', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, reloadKey, addToast]);

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // После создания возвращаемся на первую страницу и перезагружаем ленту.
  // Пост обычного пользователя появится в ленте только после одобрения админом.
  const handleCreated = () => {
    if (page === 1) {
      setReloadKey((k) => k + 1);
    } else {
      setPage(1);
    }
  };

  return (
    <div className="posts-page">
      <div className="posts-container">
        <div className="posts-header">
          <h1 className="page-title">ПОСТЫ</h1>
          {user && (
            <button
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Создать пост
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>Пока нет постов</p>
            {user && <p>Будь первым — создай пост!</p>}
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default PostsPage;
