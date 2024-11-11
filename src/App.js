import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { Amplify, Auth } from 'aws-amplify';
import { useAppContext } from './context/AppContext';
import { colors } from './pages/components/SharedStyles';

Amplify.configure({
  Auth: {
    region: "ap-southeast-4",
    userPoolId: "ap-southeast-4_NafqYoG7v",
    userPoolWebClientId: "204io607m870s4g626vnm6viqq"
  }
});

function App() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const [loading, setLoading] = useState(true); // Loading state for initial check
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  });

  useEffect(() => {
    if (!loading) {
      // Redirect based on authentication status
      if (isLoggedIn) {
        navigate('/');
      } else if (location.pathname === '/') {
        navigate('/login');
      }
    }
  }, [isLoggedIn, loading, navigate, location.pathname]);

  const checkAuth = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsLoggedIn(true);
      console.log("User is logged in");
      console.log(`access token: ${Auth.user.signInUserSession.accessToken.jwtToken ?? 'undefined'}`);
    } catch (error) {
      setIsLoggedIn(false);
      console.log("User is not logged in");
    } finally {
      setLoading(false); // Mark loading as complete once authentication is checked
    }
  };

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
    </Routes>
  );
}

// Wrapper for Router
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
    backgroundColor: colors.background, // Set background color from shared styles
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

// Keyframes for spinner animation
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inject the keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
