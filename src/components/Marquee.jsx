const Marquee = () => {
  const items = [
    'REACT', 'DJANGO', 'JAVASCRIPT', 'PYTHON',
    'TYPESCRIPT', 'NODE.JS', 'SECURITY', 'AI/ML',
    'CLOUD', 'DEVOPS', 'DATABASES', 'API'
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className={`marquee-item ${i % 2 === 0 ? 'marquee-green' : 'marquee-purple'}`}>
            ⚡ {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;