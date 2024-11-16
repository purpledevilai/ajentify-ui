import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ChatBox from "./components/chatbox/ChatBox";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import { colors } from './components/SharedStyles';
import Alert from './components/Alert';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';

function HomePage() {
  const {
    fetchAgents,
    agents,
    agentsLoading,
    fetchChatHistory,
    chatHistoryLoading,
    chatHistoryError,
    chatHistory,
    setChatHistoryError,
    contextLoading,
    currentContext,
    fetchContext,
    resetContext
  } = useAppContext();
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const startedInitalLoadRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!startedInitalLoadRef.current) {
      startedInitalLoadRef.current = true;
      fetchChatHistory();
      fetchAgents();
    }
  }, [fetchChatHistory, fetchAgents]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      fetchContext(chatHistory[0].context_id);
    }
  }, [chatHistory, fetchContext]);

  useEffect(() => {
    if (agents.length > 0) {
      setSelectedAgent(agents[0]);
    }
  }, [agents]);

  useEffect(() => {
    if (chatHistoryError) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: chatHistoryError,
        onClose: () => setChatHistoryError(null),
      });
    }
  }, [chatHistoryError, setChatHistoryError]);

  const onContextClicked = async (contextId) => {
    await fetchContext(contextId);
  };

  const checkMobileStatus = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useLayoutEffect(() => {
    checkMobileStatus();
    window.addEventListener("resize", checkMobileStatus);
    return () => window.removeEventListener("resize", checkMobileStatus);
  }, []);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      resetContext();
      navigate('/login');
    } catch (error) {
      setAlert({
        isOpen: true,
        title: 'Logout Failed',
        message: error.message || 'An unknown error occurred. Please try again.',
      });
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, title: '', message: '' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartConversation = async () => {
    console.log(`Starting conversation with ${selectedAgent.agent_name}`);
    await fetchContext()
    fetchChatHistory();
  };

  return (
    <div style={styles.appContainer}>
      <Header
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div style={styles.outerContentContainer}>
        {(isSidebarOpen || !isMobile) && (
          <Sidebar
            agents={agents}
            agentsLoading={agentsLoading}
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobile={isMobile}
            chatHistory={chatHistory}
            chatHistoryLoading={chatHistoryLoading}
            onContextClicked={onContextClicked}
            onStartConversation={handleStartConversation}
          />
        )}

        <div style={styles.centeredChatContainer}>
          {!chatHistory || chatHistoryLoading || !agents || agentsLoading || !selectedAgent ? (
            <LoadingIndicator />
          ) : chatHistory.length === 0 ? (
            <div style={styles.newConversationContainer}>
              <label style={styles.label}>Select Agent:</label>
              <select
                value={selectedAgent.agent_name}
                onChange={(e) => {
                  const agent = agents.find(a => a.agent_name === e.target.value);
                  setSelectedAgent(agent);
                }}
                style={styles.dropdown}
              >
                {agents.map((agent) => (
                  <option key={agent.agent_name} value={agent.agent_name}>
                    {agent.agent_name} {agent.agent_description ? ` - ${agent.agent_description}` : ''}
                  </option>
                ))}
              </select>
              <Button onClick={handleStartConversation} style={styles.startConversationButton}>
                Start Conversation
              </Button>
            </div>
          ) : !currentContext || contextLoading ? (
            <LoadingIndicator />
          ) : (
            <ChatBox key={currentContext.context_id} context={currentContext} />
          )}
        </div>
      </div>

      {alert.isOpen && (
        <Alert
          title={alert.title}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background,
    color: colors.text,
  },
  outerContentContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    minHeight: 'calc(100vh - 60px)',
  },
  centeredChatContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    boxSizing: 'border-box',
  },
  newConversationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: colors.cardColor,
  },
  label: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: colors.text,
  },
  dropdown: {
    width: '200px',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: colors.background,
    color: colors.text,
    border: `1px solid ${colors.primary}`,
  },
  startConversationButton: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default HomePage;
