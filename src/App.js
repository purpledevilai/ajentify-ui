import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import SignUpPage from './pages/signuppage/SignUpPage';
import HomePage from './pages/homepage/HomePage';
import ChatPage from './pages/chatpage/ChatPage';
import CreateAgentPage from './pages/createagentpage/CreateAgentPage';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { colors } from './pages/sharedcomponents/SharedStyles';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
  }
});

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initial authentication check
    Auth.currentAuthenticatedUser()
      .then(() => {
        console.log("User is logged in");
        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      })
      .catch(() => {
        console.log("User is not logged in");
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, location.pathname]);

  // Listen for Amplify Hub events
  useEffect(() => {
    const handleAuthEvents = (data) => {
      const { event } = data.payload;
      if (event === 'signIn') {
        console.log("User signed in");
        if (location.pathname !== '/signup') { // When we sign in for user creation, we don't want to redirect
          navigate('/');
        }
      } else if (event === 'signOut') {
        console.log("User signed out");
        navigate('/login');
      }
    };

    Hub.listen('auth', handleAuthEvents);

    // Cleanup the listener on component unmount
    return () => {
      Hub.remove('auth', handleAuthEvents);
    };
  }, [navigate]);

  // Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/create-agent" element={<CreateAgentPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

// Wrapper for Router - So you can use navigate in app
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

// Inline styles for loading screen and spinner
const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: colors.background,
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255, 255, 255, 0.3)',
    borderTop: `5px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
