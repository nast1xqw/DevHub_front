import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/posts', label: 'Посты' },
    { to: '/articles', label: 'Статьи' },
    { to: '/profile', label: 'Профиль' },
  ];

  return (
    <footer className="site-footer">

      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              DEVHUB<span className="logo-underscore">_</span>
            </Link>
            <p className="footer-description">
              Платформа для разработчиков. Учись, пиши код, делись опытом.
            </p>
            <div className="footer-social">
              <a 
                href="https://github.com/nast1xqw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/nast1xqw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="Telegram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a 
                href="mailto:folk.baskakova@yandex.ru" 
                className="social-link"
                title="Email"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <h4 className="footer-nav-title">Навигация</h4>
            <ul className="footer-nav-list">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav">
            <h4 className="footer-nav-title">Для разработчиков</h4>
            <ul className="footer-nav-list">
              <li><a href="/posts" className="footer-nav-link">Публикация постов</a></li>
              <li><a href="/articles" className="footer-nav-link">Чтение статей</a></li>
              <li><a href="/profile" className="footer-nav-link">Личный кабинет</a></li>
              <li><a href="/admin" className="footer-nav-link">Админ-панель</a></li>
            </ul>
          </div>

          <div className="footer-nav">
            <h4 className="footer-nav-title">Контакты</h4>
            <ul className="footer-nav-list">
              <li className="footer-contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:folk.baskakova@yandex.ru" className="footer-contact-link">
                  folk.baskakova@yandex.ru
                </a>
              </li>
              <li className="footer-contact-item">
                <span className="contact-label">GitHub:</span>
                <a href="https://github.com/nast1xqw" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                  nast1xqw
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} DevHub. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;