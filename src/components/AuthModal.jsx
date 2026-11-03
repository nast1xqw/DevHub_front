import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthModal = ({ type, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
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
      if (type === 'login') {
        await login({
          username: formData.username,
          password: formData.password,
        });
        addToast('Вы успешно вошли!', 'success');
      } else {
        await register(formData);
        addToast('Регистрация успешна!', 'success');
      }
      onClose();
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        for (const [field, msgs] of Object.entries(error.errors)) {
          newErrors[field] = msgs[0];
        }
        setErrors(newErrors);
      } else {
        addToast('Произошла ошибка', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">
          {type === 'login' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
              className={`cyber-input ${errors.username ? 'error' : ''}`}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          {type === 'register' && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`cyber-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className={`cyber-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {type === 'register' && (
            <div className="form-group">
              <input
                type="password"
                name="password2"
                placeholder="Повторите пароль"
                value={formData.password2}
                onChange={handleChange}
                className={`cyber-input ${errors.password2 ? 'error' : ''}`}
              />
              {errors.password2 && <span className="error-text">{errors.password2}</span>}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary modal-submit"
            disabled={loading}
          >
            {loading ? 'ЗАГРУЗКА...' : type === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
        </form>

        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default AuthModal;