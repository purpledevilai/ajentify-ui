import React from 'react';
import { colors } from './SharedStyles';
import LoadingIndicator from './LoadingIndicator';

const Button = ({ onClick, style, isLoading, children }) => {
  return (
    <button
      onClick={onClick}
      style={{ ...styles.button, ...style }}
      disabled={isLoading}
    >
      {isLoading ? <LoadingIndicator /> : children}
    </button>
  );
};

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    position: 'relative',
    minHeight: '40px', // Ensures button height doesn't change with spinner
    backgroundColor: colors.primary,
    color: 'white',
  },
};

export default Button;
