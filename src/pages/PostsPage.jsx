import { useState, useEffect } from 'react';
import { postsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postsAPI.getAll(1);
      setPosts(data.posts || data.results || data || []);
    } catch (error) {
      console.error('Ошибка загрузки постов:', error);
    } finally {
      setLoading(false);
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
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={loadPosts}
        />
      )}
    </div>

    
  );
};

export default PostsPage;