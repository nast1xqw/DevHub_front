const AboutSection = () => {
  const features = [
    {
      icon: '📝',
      title: 'ПОСТЫ',
      text: 'Делись опытом, задавай вопросы, получай обратную связь от сообщества разработчиков'
    },
    {
      icon: '📚',
      title: 'СТАТЬИ',
      text: 'Читай качественные материалы от экспертов индустрии, сохраняй в избранное'
    },
    {
      icon: '💬',
      title: 'СООБЩЕСТВО',
      text: 'Обсуждай технологии, находи единомышленников, развивайся вместе с другими'
    }
  ];

  return (
    <section className="about-section">
      <h2 className="section-title">ЧТО ТАКОЕ DEVHUB?</h2>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="card feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-text">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;