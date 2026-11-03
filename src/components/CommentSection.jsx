import { useState, useEffect } from 'react';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await postsAPI.getComments(postId);
      console.log('📥 Comments response:', data);
      

      const list = data.comments || data.results || data.data || (Array.isArray(data) ? data : []);
      setComments(list);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const data = await postsAPI.addComment(postId, newComment);
      console.log('📤 Comment created:', data);
      
      if (data.ok || data.comment) {
        setNewComment('');
        await loadComments(); 
        addToast('Комментарий добавлен!', 'success');
      } else {
        addToast('Ошибка при отправке', 'error');
      }
    } catch (error) {
      console.error('Ошибка создания комментария:', error);
      addToast('Ошибка при отправке комментария', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        💬 Комментарии ({comments.length})
      </h3>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            rows="3"
            className="cyber-input"
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
          </button>
        </form>
      ) : (
        <div className="comment-login-hint">
          Войдите, чтобы оставить комментарий
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">Пока нет комментариев</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt="" className="comment-avatar" />
                  ) : (
                    <div className="comment-avatar-placeholder">
                      {comment.author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span className="comment-author-name">
                    {comment.author?.username || comment.author || 'Аноним'}
                  </span>
                </div>
                {comment.created_at && (
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                )}
              </div>
              <p className="comment-text">{comment.content || comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;