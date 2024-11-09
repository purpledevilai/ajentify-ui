import React, { useState } from "react";
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
  const navigate = useNavigate();

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

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Ajentify</h1>
        <Button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      </header>
      <div style={styles.outerContentContainer}>
        <div style={styles.contentContainer}>
          <div style={styles.sidebar}>
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
            <Button style={styles.finishButton}>Finish Conversation</Button>
          </div>
          <div style={styles.chatContainer}>
            <ChatBox key={selectedAgent.getName()} agent={selectedAgent}/>
          </div>
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
    alignItems: 'center',
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
    backgroundColor: colors.cardColor,
    color: colors.text,
  },
  title: {
    margin: '0 10px', // Adds margin to avoid crowding the edges
    fontSize: '1.5rem',
    color: colors.primary,
  },
  logoutButton: {
    margin: '0 10px', // Adds margin to avoid crowding the edges
  },
  outerContentContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '20px 20px', // Adds padding on left and right sides
    boxSizing: 'border-box',
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    maxWidth: '1200px', // Limits the maximum width of the content to 1200px
    width: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '200px',
    marginRight: '20px',
    color: colors.text,
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
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    color: colors.text,
    backgroundColor: colors.background,
  },
};

export default HomePage;
