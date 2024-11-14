import React, { useState, useEffect } from "react";
import ChatBox from "./components/chatbox/ChatBox";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import { colors } from './components/SharedStyles';
import Alert from './components/Alert';

function HomePage() {
  const { agents, setIsLoggedIn } = useAppContext();
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check mobile status after component mounts
    const checkMobileStatus = () => setIsMobile(window.innerWidth <= 768);
    checkMobileStatus(); // Run on mount
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
            onFinishConversation={handleFinishConversation}
          />
        )}
        
        <div style={styles.centeredChatContainer}>
          <ChatBox key={selectedAgent.getName()} agent={selectedAgent} />
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
    padding: '20px', // Consistent padding for outer container
    boxSizing: 'border-box', // Ensures padding doesn't affect layout calculations
    overflow: 'hidden',
  },
  centeredChatContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%', // Fills remaining height in the outer content container
    boxSizing: 'border-box',
  },
};

export default HomePage;
