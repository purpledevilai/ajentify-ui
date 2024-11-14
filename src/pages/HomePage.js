import React, { useState, useEffect, useLayoutEffect } from "react";
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
    agents,
    setIsLoggedIn,
    fetchChatHistory,
    chatHistoryLoading,
    chatHistoryError,
    chatHistory,
    setChatHistoryError
  } = useAppContext();
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

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
      setIsLoggedIn(false);
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

  const handleStartConversation = () => {
    console.log(`Starting conversation with ${selectedAgent.getName()}`);
  };

  const handleFinishConversation = () => {
    setAlert({
      isOpen: true,
      title: 'Not Implemented Yet',
      message: 'This will trigger the agent to remember this conversation.',
    });
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
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobile={isMobile}
            chatHistory={chatHistory}
            chatHistoryLoading={chatHistoryLoading}
          />
        )}

        <div style={styles.centeredChatContainer}>
          {chatHistoryLoading ? (
            <LoadingIndicator />
          ) : chatHistory.length === 0 ? (
            <div style={styles.newConversationContainer}>
              <label style={styles.label}>Select Agent:</label>
              <select
                value={selectedAgent.getName()}
                onChange={(e) => {
                  const agent = agents.find(a => a.getName() === e.target.value);
                  setSelectedAgent(agent);
                }}
                style={styles.dropdown}
              >
                {agents.map((agent) => (
                  <option key={agent.getName()} value={agent.getName()}>
                    {agent.getName()}
                  </option>
                ))}
              </select>
              <Button onClick={handleStartConversation} style={styles.startConversationButton}>
                Start Conversation
              </Button>
            </div>
          ) : (
            <ChatBox key={selectedAgent.getName()} agent={selectedAgent} />
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
    minHeight: 'calc(100vh - 60px)', // Ensures outer container doesn't collapse and remains under header
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
