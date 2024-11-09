import React, { useState, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import UserInput from './UserInput';
import Alert from '../Alert';
import { colors } from '../SharedStyles';

const ChatBox = ({ agent }) => {
    const [messages, setMessages] = useState(agent.getMessages());
    const [typing, setTyping] = useState(false);
    const [alert, setAlert] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (message) => {
        // Display user message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, isUser: true }
        ]);
        setTyping(true); // Show typing indicator while waiting for response from agent

        try {
            // Fetch response from agent
            const response = await agent.sendMessage(message);

            // Check if the response contains an error
            if (response.error) {
                setAlert({
                    title: 'Error',
                    message: response.error,
                    onClose: () => setAlert(null)
                });
            } else {
                // Update messages if response is successful
                setMessages([...agent.getMessages()]);
            }
        } catch (error) {
            console.error('Error in sendMessage:', error);
            setAlert({
                title: 'Error',
                message: 'An unexpected error occurred. Please try again.',
                onClose: () => setAlert(null)
            });
        } finally {
            setTyping(false); // Hide typing indicator after receiving response
            scrollToBottom();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.messages}>
                {messages.map((message, index) => (
                    <Message key={index} message={message.text} isUser={message.isUser} />
                ))}
                {typing && <TypingIndicator />} {/* Show typing indicator if typing */}
                <div ref={messagesEndRef} />
            </div>
            <UserInput onSendMessage={handleSendMessage} />

            {/* Display Alert if there is an error */}
            {alert && (
                <Alert
                    title={alert.title}
                    message={alert.message}
                    onClose={alert.onClose}
                />
            )}
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: '800px',
        width: '100%',
        height: '600px',
        border: `2px solid ${colors.chatBox}`,
        borderRadius: '10px',
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    messages: {
        height: 'calc(100% - 40px)',
        overflowY: 'auto',
    },
};

export default ChatBox;
