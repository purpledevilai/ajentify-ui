import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from './components/SharedStyles';
import AppPage from './components/AppPage';
import Header from './components/Header';
import ChatBox from './components/chatbox/ChatBox';
import { useAlert } from '../hooks/useAlert';
import { useCreateContext } from '../hooks/useCreateContext';
import LoadingShimmerBox from './components/LoadingShimmerBox';

const CreateAgentPage = () => {
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [agentPrompt, setAgentPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const {
        context: currentContext,
        error: contextError,
        loading: contextLoading,
        clearError: clearContextError
    } = useCreateContext({ agent_id: "aj-prompt-engineer", invoke_agent_message: true });
    const navigate = useNavigate()
    const showAlert = useAlert();

    useEffect(() => {
        if (contextError) {
            showAlert({
                title: 'Error',
                message: contextError,
                onClose: clearContextError
            })
        }

    }, [contextError, clearContextError]);


    const createAgent = async () => {

    };

    return (
        <AppPage>
            <Header />
            <button onClick={() => navigate(-1)} style={styles.backButton}>
                &#8592; Back
            </button>
            <div style={styles.createAgentContainer}>
                <h1>Create Agent</h1>
                <div style={styles.formField}>
                    <label>Agent Name</label>
                    <input style={styles.input} type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                </div>
                <div style={styles.formField}>
                    <label>Agent Description</label>
                    <textarea style={styles.input} value={agentDescription} onChange={(e) => setAgentDescription(e.target.value)} />
                </div>
                <div style={styles.promptAndPromptChatContainer}>
                    <div style={styles.promptInputContainer}>
                        <label>Agent Prompt</label>
                        <textarea style={styles.promptInput} value={agentPrompt} onChange={(e) => setAgentPrompt(e.target.value)} />
                    </div>
                    <div style={styles.promptChatContainer}>
                        <label>AJ - your prompt engineer</label>
                        <div style={styles.chatBoxContainer}>
                            {contextLoading ? (
                                <LoadingShimmerBox height={600} />
                            ) : (
                                currentContext && (
                                    <ChatBox key={currentContext.context_id} context={currentContext} />
                                )
                            )}
                        </div>
                    </div>
                </div>

                <button style={styles.createAgentButton} onClick={createAgent} disabled={loading}>
                    {loading ? 'Creating Agent...' : 'Create Agent'}
                </button>
            </div>
        </AppPage>

    );
};

const styles = {
    createAgentContainer: {
        padding: '40px 20px',
    },
    backButton: {
        position: 'absolute',
        top: '90px',
        left: '20px',
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.primary,
        fontSize: '1rem',
        cursor: 'pointer',
    },
    formField: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '5px',
        border: `1px solid ${colors.primary}`,
        boxSizing: 'border-box',
    },
    chatBoxContainer: {
        paddingTop: '12px',
        height: '100%',
    },
    promptAndPromptChatContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        height: '600px',
    },
    promptInputContainer: {
        flex: '1',
    },
    promptInput: {
        width: '100%',
        height: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '5px',
        border: `1px solid ${colors.primary}`,
        boxSizing: 'border-box',
    },
    promptChatContainer: {
        flex: '1',
    },
    createAgentButton: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default CreateAgentPage;