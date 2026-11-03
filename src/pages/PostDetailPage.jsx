import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await postsAPI.getById(id);
      setPost(data.post || null);
    } catch (error) {
      console.error('Ошибка загрузки поста:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      addToast('Войдите, чтобы лайкнуть', 'error');
      return;
    }
    try {
      const data = await postsAPI.like(id);
      if (data.ok) {
        setPost(prev => ({
          ...prev,
          is_liked: data.is_liked,
          likes_count: data.likes_count,
        }));
      }
    } catch (error) {
      addToast('Ошибка', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить пост?')) return;
    try {
      const data = await postsAPI.delete(id);
      if (data.ok) {
        addToast('Пост удалён', 'success');
        navigate('/posts');
      } else {
        addToast(data.errors?.detail?.[0] || 'Ошибка при удалении', 'error');
      }
    } catch (error) {
      addToast('Ошибка при удалении', 'error');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading-page">Загрузка...</div>;
  }

  if (!post) {
    return <div className="loading-page">Пост не найден</div>;
  }

  const isAuthor = user && post.author && user.id === post.author.id;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <button className="back-button" onClick={() => navigate('/posts')}>
          ← Назад к постам
        </button>

        <article className="card post-detail-card">
          {post.photo && (
            <img src={post.photo} alt={post.title} className="post-detail-photo" />
          )}

          <div className="post-detail-header">
            <div className="post-author">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt="" className="post-author-avatar" />
              ) : (
                <div className="post-author-avatar-placeholder">
                  {post.author?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <div className="post-author-name">{post.author?.username}</div>
                <div className="post-date">{formatDate(post.created)}</div>
              </div>
            </div>

            {isAuthor && (
              <button className="btn-delete" onClick={handleDelete}>
                Удалить
              </button>
            )}
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          {post.tags?.length > 0 && (
            <div className="post-detail-tags">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
          )}
          
          <div className="post-detail-content">
            {post.text}
          </div>

          <div className="post-detail-actions">
            <button 
              className={`like-button ${post.is_liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              ❤️ {post.likes_count || 0}
            </button>
          </div>
        </article>

        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
