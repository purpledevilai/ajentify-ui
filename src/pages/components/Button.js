import React from 'react';
import { colors } from './SharedStyles';

const Button = ({ onClick, style, isLoading, children }) => {
    return (
        <button
            onClick={onClick}
            style={{ ...styles.button, ...style }}
            disabled={isLoading}
        >
            {isLoading ? <div style={styles.spinner}></div> : children}
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
    spinner: {
        width: '16px',
        height: '16px',
        border: `2px solid ${colors.secondary}`,
        borderTop: `2px solid ${colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

// Keyframes for spinner animation
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inject the keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Button;
