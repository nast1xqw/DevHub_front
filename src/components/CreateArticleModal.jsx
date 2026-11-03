import { useState } from 'react';
import { articlesAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

const CreateArticleModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    source_url: '',
    tags_input: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const data = await articlesAPI.create(formData);
      
      if (!data.ok) {
        if (data.errors) {
          const newErrors = {};
          for (const [field, msgs] of Object.entries(data.errors)) {
            newErrors[field] = msgs[0];
          }
          setErrors(newErrors);
        }
        return;
      }

      onCreated?.();
    } catch (error) {
      addToast('Ошибка при создании статьи', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">СОЗДАТЬ СТАТЬЮ</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Заголовок *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`cyber-input ${errors.title ? 'error' : ''}`}
              placeholder="Введите заголовок статьи"
              required
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Текст статьи *</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows="10"
              className={`cyber-input ${errors.text ? 'error' : ''}`}
              placeholder="Введите текст статьи..."
              required
            />
            {errors.text && <span className="error-text">{errors.text}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Источник (URL)</label>
            <input
              type="url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              className={`cyber-input ${errors.source_url ? 'error' : ''}`}
              placeholder="https://..."
            />
            {errors.source_url && <span className="error-text">{errors.source_url}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Теги (через запятую)</label>
            <input
              type="text"
              name="tags_input"
              value={formData.tags_input}
              onChange={handleChange}
              className={`cyber-input ${errors.tags_input ? 'error' : ''}`}
              placeholder="Python, React, Django"
            />
            {errors.tags_input && <span className="error-text">{errors.tags_input}</span>}
            <span className="form-hint">Разделяйте теги запятыми</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'СОЗДАНИЕ...' : 'ОПУБЛИКОВАТЬ'}
            </button>
          </div>
        </form>

        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default CreateArticleModal;