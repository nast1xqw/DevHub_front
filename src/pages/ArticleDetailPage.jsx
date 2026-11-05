import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { articlesAPI, favoritesAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await articlesAPI.getById(id);
      setArticle(data.article || null);
    } catch (error) {
      console.error("Ошибка загрузки статьи:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      addToast("Войдите, чтобы добавить в избранное", "error");
      return;
    }
    setFavLoading(true);
    try {
      const data = await favoritesAPI.toggle(id);
      if (data.ok) {
        setArticle((prev) => ({ ...prev, is_favorited: data.is_favorited }));
        addToast(
          data.is_favorited ? "Добавлено в избранное" : "Удалено из избранного",
          "success",
        );
      }
    } catch (error) {
      addToast("Ошибка", "error");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Загрузка...</div>;
  }

  if (!article) {
    return (
      <div className="loading-page">
        <p>Статья не найдена</p>
        <button className="btn-primary" onClick={() => navigate("/articles")}>
          К статьям
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="article-detail-container">
        <button className="back-button" onClick={() => navigate("/articles")}>
          ← Назад к статьям
        </button>

        <article className="card article-detail-card">
          <div className="article-detail-header">
            <div className="article-author-info">
              <div className="article-author-avatar">
                <span>{(article.author || "А")[0].toUpperCase()}</span>
              </div>
              <div>
                <div className="article-author-name">
                  {article.author || "Админ"}
                </div>
                <div className="article-date">{article.created}</div>
              </div>
            </div>

            {user && (
              <button
                className={`favorite-button ${article.is_favorited ? "active" : ""}`}
                onClick={handleFavorite}
                disabled={favLoading}
              >
                {article.is_favorited ? "★ В избранном" : "☆ В избранное"}
              </button>
            )}
          </div>

          <h1 className="article-detail-title">{article.title}</h1>

          {article.tags && article.tags.length > 0 && (
            <div className="article-detail-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="article-detail-content"
            dangerouslySetInnerHTML={{ __html: article.text }}
          />
          {article.source_url && (
            <div className="article-source">
              <span className="source-label">Источник:</span>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                {article.source_url}
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
