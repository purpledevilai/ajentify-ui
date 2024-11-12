import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { colors } from './SharedStyles';
import Button from './Button';
import LoadingIndicator from './LoadingIndicator';
import Alert from './Alert';

const Sidebar = ({ agents, selectedAgent, setSelectedAgent, isSidebarOpen, setIsSidebarOpen, isMobile, onFinishConversation }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatHistory = async () => {
            setLoading(true); 
            setError(null);   
            try {
                const response = await fetch('https://20yz4xw0ib.execute-api.ap-southeast-4.amazonaws.com/v1/chat-history', {
                    headers: {
                        Authorization: Auth.user.signInUserSession.accessToken.jwtToken,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to load chat history.");
                }

                const data = await response.json();
                console.log('Chat history:', data);
                setChatHistory(data.chat_history);
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setError(error.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchChatHistory();
    }, []);

    const handleAgentChange = (event) => {
        const agentName = event.target.value;
        const agent = agents.find((agent) => agent.getName() === agentName);
        if (agent) setSelectedAgent(agent);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        if (isMobile && isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile, isSidebarOpen]);

    const handleChatClick = (contextId) => {
        navigate(`/${contextId}`);
        setIsSidebarOpen(false);
    };

    return (
        <div
            ref={sidebarRef}
            style={{
                ...styles.sidebar,
                ...(isMobile ? styles.mobileSidebar : styles.nonMobileSidebar),
            }}
        >
            <label style={styles.label}>Select Agent:</label>
            <select
                value={selectedAgent.getName()}
                onChange={handleAgentChange}
                style={styles.dropdown}
            >
                {agents.map((agent) => (
                    <option key={agent.getName()} value={agent.getName()}>
                        {agent.getName()}
                    </option>
                ))}
            </select>

            <div style={styles.chatHistoryContainer}>
                <h3 style={styles.chatHistoryTitle}>Chat History</h3>
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    <ul style={styles.chatHistoryList}>
                        {chatHistory.map((chat) => (
                            <li
                                key={chat.context_id}
                                style={styles.chatHistoryItem}
                                onClick={() => handleChatClick(chat.context_id)}
                            >
                                <div style={styles.chatTitle}>{chat.first_message}</div>
                                <div style={styles.contextId}>{chat.context_id}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Button onClick={onFinishConversation} style={styles.finishButton}>
                Finish Conversation
            </Button>

            {error && (
                <Alert
                    title="Error Loading Chat History"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};

// Sidebar styles
const styles = {
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '200px',
        height: '100%', 
        overflowY: 'auto', 
        padding: '20px',
        color: colors.text,
        zIndex: 10,
    },
    mobileSidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%', 
        width: '200px',
        backgroundColor: colors.cardColor,
        zIndex: 20,
        boxShadow: '2px 0px 5px rgba(0,0,0,0.5)',
        overflowY: 'auto', 
    },
    nonMobileSidebar: {
        backgroundColor: 'transparent',
    },
    label: {
        marginBottom: '10px',
        fontSize: '1rem',
        color: colors.text,
    },
    dropdown: {
        width: '100%',
        padding: '8px',
        marginBottom: '20px',
        borderRadius: '4px',
        border: `1px solid ${colors.primary}`,
        backgroundColor: colors.cardColor,
        color: colors.text,
    },
    chatHistoryContainer: {
        width: '100%',
        marginTop: '20px',
    },
    chatHistoryTitle: {
        fontSize: '1rem',
        marginBottom: '10px',
        color: colors.primary,
    },
    chatHistoryList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    chatHistoryItem: {
        padding: '8px',
        cursor: 'pointer',
        borderBottom: `1px solid ${colors.primary}`,
        color: colors.text,
    },
    chatTitle: {
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    contextId: {
        fontSize: '0.8rem',
        color: colors.secondaryText,
    },
    finishButton: {
        backgroundColor: colors.primary,
        color: 'white',
        padding: '10px',
        width: '100%',
        textAlign: 'center',
        borderRadius: '4px',
        marginTop: '20px',
    },
};

export default Sidebar;
