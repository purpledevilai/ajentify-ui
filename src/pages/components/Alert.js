import React, { useEffect } from 'react';
import { colors } from './SharedStyles';

function Alert({ title, message, actions = [{ label: 'Ok', handler: null }], onClose }) {
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('alert-overlay')) {
      onClose();
    }
  };

  const handleActionClick = (handler) => {
    if (handler) handler();
    onClose();
  };

  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscPress);
    return () => window.removeEventListener('keydown', handleEscPress);
  }, [onClose]);

  return (
    <div className="alert-overlay" onClick={handleBackgroundClick} style={styles.overlay}>
      <div className="alert-box" style={styles.alertBox}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div className="alert-actions" style={styles.actions}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.handler)}
              style={styles.button}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  alertBox: {
    backgroundColor: colors.cardColor,
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    color: colors.text,
  },
  title: {
    margin: '0 0 10px',
    fontSize: '1.5em',
    color: colors.primary,
  },
  message: {
    margin: '0 0 20px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: colors.primary,
    color: 'white',
  },
};

export default Alert;
