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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    height: '100vh',
    backgroundColor: colors.background,
    color: colors.text,
  },
  outerContentContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  centeredChatContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '20px',
    boxSizing: 'border-box',
  },
};

export default HomePage;
