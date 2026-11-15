import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { articlesAPI } from "../api/api";
import { useToast } from "../context/ToastContext";
import Pagination from "../components/Pagination";
import RecommendedArticles from "../components/RecommendedArticles";
import { makeExcerpt } from "../utils/text";

const PAGE_SIZE = 12;

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allTags, setAllTags] = useState([]);
  const { addToast } = useToast();

  // Теги собираем один раз и независимо от фильтра, сортировки и страницы
  useEffect(() => {
    let cancelled = false;
    articlesAPI
      .getTags()
      .then((tags) => {
        if (!cancelled) setAllTags(tags);
      })
      .catch((error) => console.error("Ошибка загрузки тегов:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await articlesAPI.getAll({
          tag: selectedTag,
          sort,
          page,
          size: PAGE_SIZE,
        });
        if (cancelled) return;
        if (data.ok) {
          setArticles(data.articles || []);
          setTotalPages(data.total_pages || 1);
        } else {
          addToast("Ошибка загрузки статей", "error");
        }
      } catch (error) {
        console.error("Ошибка загрузки статей:", error);
        if (!cancelled) addToast("Ошибка загрузки статей", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedTag, sort, page, addToast]);

  // При смене сортировки или тега возвращаемся на первую страницу
  const handleSort = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
    setPage(1);
  };

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="articles-page">
      <div className="articles-container">
        <div className="articles-header">
          <h1 className="page-title">СТАТЬИ</h1>
        </div>

        <RecommendedArticles />

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
          <>
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

                      {/* Сначала убираем теги, потом обрезаем; выводим как обычный текст */}
                      <p className="article-excerpt">{makeExcerpt(article.text, 200)}</p>

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
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
