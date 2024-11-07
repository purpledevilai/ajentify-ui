import React from 'react';

const SendButton = ({ onClick }) => {
    return (
        <button onClick={onClick} style={styles.button}>
            Send
        </button>
    );
};

// Inline styles
const styles = {
    button: {
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
    },
};

export default SendButton;
