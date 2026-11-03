import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { articlesAPI } from "../api/api";
import { useToast } from "../context/ToastContext";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (tag = "", sortType = "newest") => {
    setLoading(true);
    try {
      const data = await articlesAPI.getAll(tag, sortType);
      const list = data.articles || [];
      setArticles(list);

      const tags = new Set();
      list.forEach((a) => (a.tags || []).forEach((t) => tags.add(t)));
      setAllTags([...tags]);
    } catch (error) {
      console.error("Ошибка загрузки статей:", error);
      addToast("Ошибка загрузки статей", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (newSort) => {
    setSort(newSort);
    loadArticles(selectedTag, newSort);
  };

  const handleTagClick = (tag) => {
    const newTag = selectedTag === tag ? "" : tag;
    setSelectedTag(newTag);
    loadArticles(newTag, sort);
  };

  return (
    <div className="articles-page">
      <div className="articles-container">
        <div className="articles-header">
          <h1 className="page-title">СТАТЬИ</h1>
        </div>

        <div className="articles-filters">
          <div className="filter-group">
            <span className="filter-label">Сортировка:</span>
            <button
              className={`filter-btn ${sort === "newest" ? "active" : ""}`}
              onClick={() => handleSort("newest")}
            >
              Новые
            </button>
            <button
              className={`filter-btn ${sort === "oldest" ? "active" : ""}`}
              onClick={() => handleSort("oldest")}
            >
              Старые
            </button>
            <button
              className={`filter-btn ${sort === "title" ? "active" : ""}`}
              onClick={() => handleSort("title")}
            >
              По названию
            </button>
          </div>

          {allTags.length > 0 && (
            <div className="filter-group tags-filter">
              <span className="filter-label">Теги:</span>
              <button
                className={`filter-btn tag-btn ${!selectedTag ? "active" : ""}`}
                onClick={() => handleTagClick("")}
              >
                Все
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-btn tag-btn ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <p>Статьи не найдены</p>
          </div>
        ) : (
          <div className="articles-list">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="article-link"
              >
                <div className="card article-card">
                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>

                    {article.tags && article.tags.length > 0 && (
                      <div className="article-tags">
                        {article.tags.map((tag) => (
                          <span key={tag} className="article-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p
                      className="article-excerpt"
                      dangerouslySetInnerHTML={{
                        __html: article.text.substring(0, 200) + "...",
                      }}
                    />

                    <div className="article-meta">
                      <span className="article-author">
                        ✍️ {article.author || "Админ"}
                      </span>
                      <span className="article-date">📅 {article.created}</span>
                      {article.is_favorited && (
                        <span className="article-fav-badge">★ В избранном</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
