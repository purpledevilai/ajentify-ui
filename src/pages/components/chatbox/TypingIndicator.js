import React from 'react';

const TypingIndicator = () => {
    return (
        <div style={styles.container}>
            <div style={styles.typingIndicator}>
                <span style={styles.dot}></span>
                <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
                <span style={{ ...styles.dot, animationDelay: '0.4s' }}></span>
            </div>
        </div>
    );
};

// Inline styles with animation
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginBottom: '5px',
    },
    typingIndicator: {
        display: 'inline-block',
        marginRight: '8px',
    },
    dot: {
        display: 'inline-block',
        width: '6px',
        height: '6px',
        backgroundColor: '#555',
        borderRadius: '50%',
        marginRight: '3px',
        animation: 'typing 1s infinite ease-in-out',
    },
};

// Keyframes for typing animation
const keyframes = `
@keyframes typing {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}`;

// Inject the keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default TypingIndicator;
