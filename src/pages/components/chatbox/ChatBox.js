import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import UserInput from './UserInput';

const ChatBox = ({ agent }) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Display initial message from the chatbot
        setMessages([{ text: "Hello, how can I help you?", isUser: false }]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (message) => {
        // Display user message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, isUser: true }
        ]);
        setTyping(true); // Show typing indicator while waiting for response from ChatService

        try {
            // Fetch response from ChatService

            const response = await agent.sendMessage(message)
            // Display response from the chatbot
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: response, isUser: false }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setTyping(false); // Hide typing indicator after receiving response
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
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: '800px',
        width: '100%',
        height: '600px',
        border: '2px solid #ccc',
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
