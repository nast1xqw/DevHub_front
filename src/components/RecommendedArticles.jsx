import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { makeExcerpt } from '../utils/text';

// Блок «Рекомендуем вам»: до 3 статей по тегам избранного.
// Для гостя бэк отдаёт пустой список, поэтому блок просто не показывается.
const RecommendedArticles = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    articlesAPI
      .getRecommendations()
      .then((data) => {
        if (!cancelled) setArticles(data.articles || []);
      })
      .catch((error) => console.error('Ошибка загрузки рекомендаций:', error));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Гостю и пользователю без рекомендаций блок не показываем
  if (!user || articles.length === 0) return null;

  return (
    <section className="recommendations">
      <h2 className="section-subtitle">⭐ Рекомендуем вам</h2>
      <div className="recommendations-grid">
        {articles.map((article) => (
          <Link key={article.id} to={`/articles/${article.id}`} className="article-link">
            <div className="card recommendation-card">
              <h3 className="article-title">{article.title}</h3>
              {article.tags?.length > 0 && (
                <div className="article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="article-tag">{tag}</span>
                  ))}
                </div>
              )}
              <p className="article-excerpt">{makeExcerpt(article.text, 110)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedArticles;
