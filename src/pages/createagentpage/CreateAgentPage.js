import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../sharedcomponents/SharedStyles';
import AppPage from '../sharedcomponents/AppPage';
import Header from '../sharedcomponents/Header';
import Button from '../sharedcomponents/Button';
import ChatBox from '../sharedcomponents/chatbox/ChatBox';
import { useAlert } from '../../hooks/useAlert';
import { useCreateContext, useCreateContextLazy } from '../../hooks/agent/useCreateContext';
import { useCreateAgent } from '../../hooks/agent/useCreateAgent';
import { useUpdateAgent } from '../../hooks/agent/useUpdateAgent';
import LoadingShimmerBox from '../sharedcomponents/LoadingShimmerBox';

const CreateAgentPage = () => {
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [agentPrompt, setAgentPrompt] = useState('');
    const [testModalOpen, setTestModalOpen] = useState(false);
    const {
        context: currentPEContext,
        error: peContextError,
        loading: peContextLoading,
        clearError: clearPEContextError
    } = useCreateContext({ agent_id: "aj-prompt-engineer", invoke_agent_message: true });
    const { createAgent, loading: createAgentLoading } = useCreateAgent();
    const [currentAgent, setCurrentAgent] = useState(null);
    const { createContext, loading: agentContextLoading } = useCreateContextLazy();
    const [agentContext, setAgentContext] = useState(null);
    const { updateAgent, loading: agentUpdateLoading } = useUpdateAgent();
    const hasAgentUpdatesRef = useRef(false);
    const navigate = useNavigate();
    const showAlert = useAlert();

    useEffect(() => {
        if (peContextError) {
            showAlert({
                title: 'Error',
                message: peContextError,
                onClose: clearPEContextError
            });
        }
    }, [showAlert, peContextError, clearPEContextError]);

    const onUIUpdate = (uiUpdates) => {
        for (const update of uiUpdates) {
            if (update.type === 'set_prompt') {
                setAgentPrompt(update.prompt);
            }
        }
    };

    const testAgentHandler = async () => {
        setTestModalOpen(true);
        try {
            // Create agent if it doesn't exist
            let agent = currentAgent;
            if (!currentAgent) {
                agent = await createAgent({
                    agent_name: agentName,
                    agent_description: agentDescription,
                    prompt: agentPrompt,
                });
                setCurrentAgent(agent);
            }

            // Update if needed
            if (hasAgentUpdatesRef.current) {
                agent = await updateAgent({
                    agent_id: agent.agent_id,
                    agent_name: agentName,
                    agent_description: agentDescription,
                    prompt: agentPrompt,
                });
                setCurrentAgent(agent);
                hasAgentUpdatesRef.current = false;
            }

            // Create context with agent
            const context = await createContext({
                agent_id: agent.agent_id,
            });
            setAgentContext(context);
        } catch (error) {
            showAlert({
                title: 'Error',
                message: error.message,
            });
        }
    };

    return (
        <AppPage>
            <Header />
            <button onClick={() => navigate(-1)} style={styles.backButton}>
                &#8592; Back
            </button>
            <div style={styles.createAgentContainer}>
                <h1>Create Agent</h1>
                <div>
                    <label>Agent Name</label>
                    <input style={styles.input} type="text" value={agentName} onChange={(e) => {
                        hasAgentUpdatesRef.current = true;
                        setAgentName(e.target.value)
                    }} />
                </div>
                <div>
                    <label>Agent Description</label>
                    <textarea style={styles.input} value={agentDescription} onChange={(e) => {
                        hasAgentUpdatesRef.current = true;
                        setAgentDescription(e.target.value)
                    }} />
                </div>
                <div style={styles.promptAndPromptChatContainer}>
                    <div style={styles.promptInputContainer}>
                        <div style={styles.agentPromptLableAndTestButtonContainer}>
                            <label>Agent Prompt</label>
                            <button style={styles.testAgentButton} onClick={testAgentHandler}>Test Agent</button>
                        </div>
                        <textarea style={styles.promptInput} value={agentPrompt} onChange={(e) => {
                            hasAgentUpdatesRef.current = true;
                            setAgentPrompt(e.target.value)
                        }} />
                    </div>
                    <div style={styles.promptChatContainer}>
                        <label>AJ - your prompt engineer</label>
                        <div style={styles.chatBoxContainer}>
                            {peContextLoading ? (
                                <LoadingShimmerBox height={500} />
                            ) : (
                                currentPEContext && (
                                    <ChatBox key={currentPEContext.context_id} context={currentPEContext} onUIUpdate={onUIUpdate} />
                                )
                            )}
                        </div>
                    </div>
                </div>
                <Button style={styles.createAgentButton}>Create Agent</Button>
            </div>

            {testModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <button style={styles.modalCloseButton} onClick={() => setTestModalOpen(false)}>✖</button>
                        {(createAgentLoading || agentContextLoading || agentUpdateLoading) ? (
                            <LoadingShimmerBox height={300} />
                        ) : (
                            agentContext && (
                                <ChatBox key={agentContext.context_id} context={agentContext} onUIUpdate={onUIUpdate} />
                            )
                        )}
                    </div>
                </div>
            )}
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
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '5px',
        border: `1px solid ${colors.primary}`,
        boxSizing: 'border-box',
    },
    promptAndPromptChatContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        minHeight: '600px',
        maxHeight: '600px',
    },
    agentPromptLableAndTestButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    promptInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
    },
    testAgentButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.primary,
        fontSize: '1rem',
        cursor: 'pointer',
    },
    promptInput: {
        width: '100%',
        flex: 1,
        padding: 0,
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '5px',
        border: `1px solid ${colors.primary}`,
        boxSizing: 'border-box',
    },
    promptChatContainer: {
        flex: '1',
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    chatBoxContainer: {
        margin: '10px 0',
        height: '93%',
        width: '99%',
    },
    createAgentButton: {
        padding: '10px',
        width: '100%',
        color: 'white',
        border: 'none',
        alignSelf: 'center', // Center the button horizontally
        marginTop: '40px', // Add space above the button
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '600px',
        height: '80%',
        position: 'relative',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
};

export default CreateAgentPage;