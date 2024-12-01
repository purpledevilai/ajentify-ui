import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import UserInput from './UserInput';
import Alert from '../Alert';
import { colors } from '../SharedStyles';
import { sendMessage } from '../../../lib/SendMessage';

const ChatBox = ({ context, onUIUpdate = null }) => {
    const [messages, setMessages] = useState(context['messages']);
    const [typing, setTyping] = useState(false);
    const [alert, setAlert] = useState(null);
    const messagesRef = useRef(null); // Ref for the messages container

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    const handleSendMessage = async (message) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { message: message, from: 'human' }
        ]);
        setTyping(true);

        try {
            const response = await sendMessage(context['context_id'], message);

            if (response.error) {
                setAlert({
                    title: 'Error',
                    message: response.error,
                    onClose: () => setAlert(null)
                });
            } else {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { message: response.response, from: 'ai' }
                ]);
                if (response.ui_updates && onUIUpdate) {
                    onUIUpdate(response.ui_updates);
                }
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
            <div ref={messagesRef} style={styles.messages}>
                {messages.map((message, index) => (
                    <Message key={index} message={message.message} isUser={message.from === "human"} />
                ))}
                {typing && <TypingIndicator />}
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
        padding: '10px 20px',
        paddingBottom: '150px',
        boxSizing: 'border-box',
    },
};

export default ChatBox;
