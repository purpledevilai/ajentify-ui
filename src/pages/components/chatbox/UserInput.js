import React, { useState, useRef, useEffect } from 'react';
import SendButton from './SendButton';
import { colors } from '../SharedStyles';

const MAX_LINES = 5; // Maximum number of lines before scrolling

const UserInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
        adjustTextareaHeight();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline from being added
            handleSubmit(e); // Call handleSubmit on Enter
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
            adjustTextareaHeight(); // Reset height after sending message
        }
    };

    // Adjusts the height of the textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to shrink if needed
            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
            const maxHeight = lineHeight * MAX_LINES;

            if (textarea.scrollHeight > maxHeight) {
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.height = `${textarea.scrollHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Handle Enter and Shift + Enter
                placeholder="Type a message..."
                style={styles.textarea}
                rows={1} // Start with 1 row
            />
            <SendButton onClick={handleSubmit} />
        </form>
    );
};

// Inline styles
const styles = {
    form: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        backgroundColor: colors.chatBox,
        padding: '10px',
        borderRadius: '8px',
        alignItems: 'center',
    },
    textarea: {
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '10px',
        borderRadius: '10px',
        marginRight: '10px',
        resize: 'none', // Prevent manual resizing
        fontSize: '16px',
        lineHeight: '1.4em',
        overflowY: 'hidden', // Hide overflow initially
    },
};

export default UserInput;
