import React, { useState, useRef, useEffect } from 'react';
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
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, isUser: true }
        ]);
        setTyping(true);

        try {
            const response = await agent.sendMessage(message);

            if (response.error) {
                setAlert({
                    title: 'Error',
                    message: response.error,
                    onClose: () => setAlert(null)
                });
            } else {
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
            setTyping(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typing]);

    return (
        <div style={styles.container}>
            <div style={styles.messages}>
                {messages.map((message, index) => (
                    <Message key={index} message={message.text} isUser={message.isUser} />
                ))}
                {typing && <TypingIndicator />}
                <div ref={messagesEndRef} style={styles.messagesEndSpacer} />
            </div>
            <UserInput onSendMessage={handleSendMessage} />

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

const styles = {
    container: {
      maxWidth: '800px',
      width: '100%',
      height: '100%',
      border: `2px solid ${colors.chatBox}`,
      borderRadius: '10px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: '20px',
    },
    messagesEndSpacer: {
      height: '100px',
    },
  };

export default ChatBox;
