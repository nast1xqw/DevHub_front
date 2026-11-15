// Постраничная навигация. page — с 1, как на бэке.
const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  // Окно из страниц вокруг текущей: 1 … 4 5 [6] 7 8 … 20
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 2) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav className="pagination" aria-label="Страницы">
      <button
        className="filter-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Назад
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pagination-gap">…</span>
        ) : (
          <button
            key={p}
            className={`filter-btn ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="filter-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Вперёд →
      </button>
    </nav>
  );
};

export default Pagination;
