import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast('Вы вышли из системы', 'success');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            DEVHUB<span className="accent-text">_</span>
          </Link>

          <nav className="header-nav desktop-nav">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/posts" className="nav-link">Посты</Link>
            <Link to="/articles" className="nav-link">Статьи</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="nav-link">Профиль</Link>
                {user.is_staff && <Link to="/admin" className="nav-link">Админ</Link>}
                <button onClick={handleLogout} className="btn-secondary nav-button">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModal('login')} className="btn-secondary nav-button">
                  Войти
                </button>
                <button onClick={() => setAuthModal('register')} className="btn-primary nav-button">
                  Регистрация
                </button>
              </>
            )}
          </nav>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Главная</Link>
            <Link to="/posts" className="nav-link" onClick={() => setMenuOpen(false)}>Посты</Link>
            <Link to="/articles" className="nav-link" onClick={() => setMenuOpen(false)}>Статьи</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Профиль</Link>
                {user.is_staff && <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Админ</Link>}
                <button onClick={handleLogout} className="btn-secondary">Выйти</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false); }} className="btn-secondary">
                  Войти
                </button>
                <button onClick={() => { setAuthModal('register'); setMenuOpen(false); }} className="btn-primary">
                  Регистрация
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      {authModal && <AuthModal type={authModal} onClose={() => setAuthModal(null)} />}
    </>
  );
};

export default Header;