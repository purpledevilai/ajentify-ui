import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./components/chatbox/ChatBox";
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import { colors } from './components/SharedStyles';
import Alert from './components/Alert';
import Button from './components/Button';

function HomePage() {
  const { agents, setIsLoggedIn } = useAppContext();
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleAgentChange = (event) => {
    setAgentWithName(event.target.value);
  };

  const setAgentWithName = (agentName) => {
    for (let agent of agents) {
      if (agent.getName() === agentName) {
        setSelectedAgent(agent);
        return;
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFinishConversation = () => {
    setAlert({
      isOpen: true,
      title: 'Dont work yet',
      message: 'The idea is that this will trigger the agent to remember this conversation',
    });
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {isMobile && (
            <button style={styles.hamburger} onClick={toggleSidebar}>
              ☰
            </button>
          )}
          <h1 style={styles.title}>Ajentify</h1>
        </div>
        <Button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      </header>

      <div style={styles.outerContentContainer}>
        {(isSidebarOpen || !isMobile) && (
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
            <Button onClick={handleFinishConversation} style={styles.finishButton}>Finish Conversation</Button>
          </div>
        )}
        
        <div style={styles.chatContainer}>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
    boxSizing: 'border-box',
    backgroundColor: colors.cardColor,
    color: colors.text,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  hamburger: {
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  title: {
    fontSize: '1.5rem',
    color: colors.primary,
    margin: '0',
  },
  logoutButton: {
    margin: '0 10px',
  },
  outerContentContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'relative',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '200px',
    marginRight: '20px',
    color: colors.text,
    padding: '20px',
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
  },
  nonMobileSidebar: {
    backgroundColor: 'transparent', // No background on non-mobile view
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
  finishButton: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    borderRadius: '4px',
  },
  chatContainer: {
    display: 'flex',
    flex: 1,
    color: colors.text,
    backgroundColor: colors.background,
  },
};

export default HomePage;
