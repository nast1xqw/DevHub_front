import { useState } from 'react';
import { parseAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

const ParseArticlesButton = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleParse = async () => {
    setLoading(true);
    try {
      const data = await parseAPI.parseArticles();
      if (data.ok) {
        addToast(data.message, 'success');
        // Обновляем страницу или список статей
        window.location.reload();
      } else {
        addToast('Ошибка при парсинге', 'error');
      }
    } catch (error) {
      console.error('Parse error:', error);
      addToast('Ошибка при парсинге статей', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleParse}
      disabled={loading}
      className="btn-primary"
      style={{
        backgroundColor: loading ? '#8a8a9a' : '#bfff00',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? '⏳ Парсинг...' : ' Спарсить статьи с Хабра'}
    </button>
  );
};

export default ParseArticlesButton;