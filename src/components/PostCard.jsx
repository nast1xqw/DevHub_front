import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/posts/${post.id}`} className="post-card-link">
      <div className="card post-card">
        {post.photo && (
          <img src={post.photo} alt={post.title} className="post-card-photo" />
        )}
        
        <div className="post-card-content">
          <div className="post-card-header">
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
          </div>

          <h3 className="post-title">{post.title}</h3>
          
          {post.text && (
            <p className="post-excerpt">
              {post.text.length > 200 
                ? post.text.substring(0, 200) + '...' 
                : post.text}
            </p>
          )}

          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="post-card-footer">
            <div className="post-stats">
              <span className="post-stat">
                ❤️ {post.likes_count || 0}
              </span>
              <span className="post-stat">
                💬 {post.comments_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;