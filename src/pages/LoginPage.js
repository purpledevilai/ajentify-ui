import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { colors } from './components/SharedStyles';
import Alert from './components/Alert';
import Button from './components/Button';
import { useAppContext } from '../context/AppContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await Auth.signIn(email, password);
      setIsLoggedIn(true)
      navigate('/');
    } catch (error) {
      setIsLoggedIn(false)
      setAlert({
        isOpen: true,
        title: 'Login Failed',
        message: error.message || 'An unknown error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, title: '', message: '' });
  };

  return (
    <div style={styles.authContainer}>
      <h1 style={styles.heading}>Ajentify</h1>
      <div style={styles.inputContainer}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <Button onClick={handleLogin} style={styles.button} isLoading={isLoading}>
          Login
        </Button>
        <Button onClick={() => navigate('/signup')} style={{ ...styles.button, ...styles.secondaryButton }}>
          Create Account
        </Button>
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
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: colors.background,
    color: colors.text,
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: colors.primary,
  },
  inputContainer: {
    width: '80%',
    maxWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%', // Full width within the container
    padding: '10px',
    margin: '10px 0',
    fontSize: '1rem',
    borderRadius: '5px',
    border: `1px solid ${colors.primary}`,
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', // Full width within the container
    padding: '10px',
    margin: '10px 0',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: colors.primary,
    color: 'white',
    boxSizing: 'border-box',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
};

export default LoginPage;
