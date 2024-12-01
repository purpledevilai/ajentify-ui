import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from './components/SharedStyles';
import AppPage from './components/AppPage';
import Header from './components/Header';
import Button from './components/Button';
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

    const onUIUpdate = (uiUpdates) => {
        for (const update of uiUpdates) {
            if (update.type === 'set_prompt') {
                setAgentPrompt(update.prompt);
            }
        }
    };


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
                                    <ChatBox key={currentContext.context_id} context={currentContext} onUIUpdate={onUIUpdate}/>
                                )
                            )}
                        </div>
                    </div>
                </div>
                <Button style={styles.createAgentButton}>Create Agent</Button>
            </div>
        </AppPage>

    );
};

const styles = {
    createAgentContainer: {
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px', // Space between stacked items
        minHeight: '100%', // Ensures the container occupies at least the full viewport height
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
        height: '600px', // Fixed height
        flexShrink: 0, // Prevent shrinking, ensures this container keeps its height
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
        width: '100%',
        color: 'white',
        border: 'none',
        alignSelf: 'center', // Center the button horizontally
        marginTop: '40px', // Add space above the button
    },
};

export default CreateAgentPage;