import { useState, useRef } from 'react';
import { postsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

const CreatePostModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Файл больше 2 МБ', 'error');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('tags_input', tagsInput);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const data = await postsAPI.create(formData);
      
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

      addToast('Пост создан!', 'success');
      onCreated?.();
      onClose();
    } catch (error) {
      addToast('Ошибка при создании поста', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">СОЗДАТЬ ПОСТ</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Заголовок *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`cyber-input ${errors.title ? 'error' : ''}`}
              placeholder="Введите заголовок"
              required
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Текст *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="6"
              className={`cyber-input ${errors.text ? 'error' : ''}`}
              placeholder="Напишите что-нибудь..."
              required
            />
            {errors.text && <span className="error-text">{errors.text}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Теги (через запятую)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`cyber-input ${errors.tags_input ? 'error' : ''}`}
              placeholder="python, django, react"
            />
            {errors.tags_input && <span className="error-text">{errors.tags_input}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Фото (необязательно)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="cyber-input file-input"
            />
            {errors.photo && <span className="error-text">{errors.photo}</span>}
            {photoPreview && (
              <img src={photoPreview} alt="Превью" className="photo-preview" />
            )}
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

export default CreatePostModal;