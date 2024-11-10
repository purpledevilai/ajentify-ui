import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { Amplify, Auth } from 'aws-amplify';
import { useAppContext } from './context/AppContext';

Amplify.configure({
  Auth: {
    region: "ap-southeast-4",
    userPoolId: "ap-southeast-4_NafqYoG7v",
    userPoolWebClientId: "204io607m870s4g626vnm6viqq"
  }
});

function App() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Only redirect to /login if accessing the home page without being logged in
    if (!isLoggedIn && location.pathname === '/') {
      navigate('/login');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  const checkAuth = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsLoggedIn(true);
      console.log("User is logged in");
    } catch (error) {
      setIsLoggedIn(false);
      console.log("User is not logged in");
    }
  };

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
