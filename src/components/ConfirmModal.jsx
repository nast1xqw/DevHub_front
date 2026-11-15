import { useEffect } from 'react';

// Модальное окно подтверждения вместо window.confirm
const ConfirmModal = ({
  title = 'Подтвердите действие',
  message,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel, loading]);

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onCancel}>
      <div
        className="modal-content confirm-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{title}</h2>
        {message && <p className="confirm-message">{message}</p>}
        <div className="modal-actions confirm-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Подождите...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
