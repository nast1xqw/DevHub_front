import { useState } from 'react';
import { parseAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

// Парсинг синхронный: бэк по очереди читает все RSS-ленты, поэтому запрос может идти долго.
const ParseArticlesButton = ({ onDone }) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleParse = async () => {
    setLoading(true);
    try {
      const data = await parseAPI.parseArticles();
      if (data.ok) {
        addToast(data.message, 'success');
        onDone?.(data);
      } else {
        addToast(data.errors?.detail?.[0] || 'Ошибка при обновлении статей', 'error');
      }
    } catch (error) {
      console.error('Parse error:', error);
      addToast('Ошибка при обновлении статей', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleParse}
      disabled={loading}
      className="btn-primary"
      title={loading ? 'Ленты читаются по очереди, это может занять до минуты' : undefined}
      style={{
        backgroundColor: loading ? '#8a8a9a' : '#bfff00',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? '⏳ Обновление...' : 'Обновить статьи из источников'}
    </button>
  );
};

export default ParseArticlesButton;
