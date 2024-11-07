import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Navigate based on the authentication state
    if (isLoggedIn) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

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

// Need this because you cant use useNavigate on the same level as the Router
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
