import React from "react";
import { marked } from 'marked';

const Message = ({ message, isUser }) => {
    const renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
        return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
    };

    if (isUser === false) {
        // Convert newlines to <br> for bot messages to preserve line breaks
        const htmlContent = marked.parse(message.replace(/\n/g, '<br>'), { renderer });
        return (
            <div style={styles.botMessageContainer}>
                <div style={styles.botMessage} dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        );
    }
    
    return (
        <div style={styles.userMessageContainer}>
            <div style={{ ...styles.userMessage, whiteSpace: 'pre-wrap' }}>
                {message}
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    userMessageContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    },
    botMessageContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
    },
    userMessage: {
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '0px',
        padding: '14px 15px',
        borderRadius: '15px',
        maxWidth: '70%',
        backgroundColor: '#858585',
        color: '#fff', // To make text visible on dark background
        wordWrap: 'break-word',
    },
    botMessage: {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '0px',
        padding: '0px 15px',
        borderRadius: '15px',
        maxWidth: '70%',
        backgroundColor: '#dbdbdb',
        color: '#000', // To make text visible on light background
        wordWrap: 'break-word',
    },
};

export default Message;
