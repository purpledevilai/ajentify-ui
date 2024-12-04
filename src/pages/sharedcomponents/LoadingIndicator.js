import React from 'react';
import { colors } from './SharedStyles';

const LoadingIndicator = () => {
  return <div style={styles.spinner}></div>;
};

const styles = {
  spinner: {
    width: '24px',
    height: '24px',
    border: `4px solid ${colors.cardColor}`,
    borderTop: `4px solid ${colors.secondary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto', // Center the spinner
  },
};

// Keyframes for spinner animation
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inject the keyframes into the document
const injectKeyframes = () => {
  const styleSheet = document.styleSheets[0];
  const keyframeExists = Array.from(styleSheet.cssRules).some(
    (rule) => rule.name === 'spin'
  );
  if (!keyframeExists) {
    styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);
  }
};

injectKeyframes();

export default LoadingIndicator;
