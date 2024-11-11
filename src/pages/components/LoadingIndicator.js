import React from 'react';
import { colors } from './SharedStyles';

const LoadingIndicator = () => {
    return <div style={styles.spinner}></div>;
};

const styles = {
    spinner: {
        width: '24px',
        height: '24px',
        border: `4px solid ${colors.secondary}`,
        borderTop: `4px solid ${colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto', // Center the spinner
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

export default LoadingIndicator;
