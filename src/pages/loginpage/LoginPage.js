import React, { useState } from 'react';
import AppPage from '../sharedcomponents/AppPage';
import { colors } from '../sharedcomponents/SharedStyles';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/user/useLogin';
import { useAlert } from '../../hooks/useAlert';
import Button from '../sharedcomponents/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: loginLoading } = useLogin();
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      showAlert({
        title: 'Error',
        message: error.message,
      });
    }
  };

  return (
    <AppPage style={styles.authContainer}>
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
          <Button onClick={handleLogin} style={styles.button} isLoading={loginLoading}>
            Login
          </Button>
          <Button onClick={() => navigate('/signup')} style={{ ...styles.button, ...styles.secondaryButton }}>
            Create Account
          </Button>
        </div>
    </AppPage>
  );
}

const styles = {
  authContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '1rem',
    borderRadius: '5px',
    border: `1px solid ${colors.primary}`,
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
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
