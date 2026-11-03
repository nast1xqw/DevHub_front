import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'Что такое DevHub?', a: 'DevHub — это платформа для разработчиков, где можно делиться знаниями, читать статьи и обсуждать технологии.' },
    { q: 'Как создать пост?', a: 'Зарегистрируйтесь, нажмите кнопку "Создать пост" и заполните форму.' },
    { q: 'Можно ли редактировать пост?', a: 'Да, вы можете редактировать свои посты в любое время через свой профиль.' },
    { q: 'Как добавить статью в избранное?', a: 'На странице статьи нажмите кнопку "В избранное". Все избранные статьи будут в вашем профиле.' },
    { q: 'Кто может публиковать статьи?', a: 'Статьи публикуют администраторы платформы после модерации.' },
    { q: 'Есть ли мобильная версия?', a: 'Да, сайт полностью адаптивен и работает на всех устройствах.' },
    { q: 'Как связаться с администрацией?', a: 'Напишите нам через форму обратной связи или на email admin@devhub.com' },
    { q: 'Платформа бесплатная?', a: 'Да, все функции платформы полностью бесплатны для всех пользователей.' }
  ];

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq-section">
      <h2 className="section-title">ЧАСТЫЕ ВОПРОСЫ</h2>

      <div className="faq-grid">
        {faqs.map((faq, i) => (
          <div key={i} className="card faq-item">
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{faq.q}</span>
              <span className={`faq-icon ${openIndex === i ? 'faq-icon-open' : ''}`}>+</span>
            </button>

            {openIndex === i && (
              <div className="faq-answer">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;