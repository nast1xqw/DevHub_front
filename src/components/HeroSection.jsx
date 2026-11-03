import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-label">/ ПЛАТФОРМА ДЛЯ РАЗРАБОТЧИКОВ</div>
        
        <h1 className="hero-title">
          Учись. Пиши.<br />
          <span className="accent-text">Делись кодом.</span>
        </h1>

        <p className="hero-subtitle">
          Статьи, обучающие видео и лента постов в одном месте. 
          Сохраняй материалы в избранное, а мы подберём, что учить дальше.
        </p>

        <div className="hero-buttons">
          <Link to="/posts" className="btn-primary">
            Начать →
          </Link>
          <Link to="/articles" className="btn-secondary">
            Статьи
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;