import React, { useState } from 'react';
import SendButton from './SendButton';
import { colors } from '../SharedStyles';

const UserInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type a message..."
                style={styles.inputField}
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
        alignItems: 'center', // Aligns input and button vertically
    },
    inputField: {
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '10px',
        borderRadius: '20px',
        marginRight: '10px', // Adds space between input and button
    },
};

export default UserInput;
