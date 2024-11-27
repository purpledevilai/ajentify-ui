import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { colors } from './components/SharedStyles';
import Alert from './components/Alert';
import Button from './components/Button';
import {createUser, createOrganization } from "../lib/API"

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '', actions: undefined, close: undefined });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setAlert({
        isOpen: true,
        title: 'Sign Up Failed',
        message: 'Passwords do not match. Please try again.',
        actions: [{ label: 'Ok', handler: closeAlert }],
        close: closeAlert,
      });
      return;
    }
    try {
      setIsLoading(true);
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      });
      setShowVerificationModal(true); // Show modal to enter verification code
    } catch (error) {
      setAlert({
        isOpen: true,
        title: 'Sign Up Failed',
        message: error.message || 'An unknown error occurred. Please try again.',
        actions: [{ label: 'Ok', handler: closeAlert }],
        close: closeAlert
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      await Auth.confirmSignUp(email, verificationCode);
  
      // Automatically log in the user after verification
      const user = await Auth.signIn(email, password);
      
      // Create the user
      await createUser(user.attributes.sub);
  
      // Make API calls after login
      if (isCreatingOrg) {
        await createOrganization(organizationName);
      } else {
        //await processInvitation(accessToken);
      }
  
      // Show success alert with redirection action
      setAlert({
        isOpen: true,
        title: 'Setup Successful',
        message: 'Your account and organization have been set up.',
        actions: [
          {
            label: 'Go to Home',
            handler: () => navigate('/'),
          },
        ],
        close: () => navigate('/'),
      });
      setShowVerificationModal(false); // Hide the verification modal
    } catch (error) {
      setAlert({
        isOpen: true,
        title: 'Verification Failed',
        message: error.message || 'Something went wrong. Please try again.',
        actions: [{ label: 'Ok', handler: closeAlert }],
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process invitation API call
  const processInvitation = async (accessToken) => {
    try {
      const response = await fetch('https://api.example.com/invitation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode,
          email,
          firstName,
          lastName,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process invitation.');
      }
  
      console.log('Invitation processed successfully');
    } catch (error) {
      throw new Error(`Invitation processing failed: ${error.message}`);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, title: '', message: '', actions: [], close: closeAlert });
  };

  return (
    <div style={styles.authContainer}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        &#8592; Back
      </button>
      <h1 style={styles.heading}>Create Account</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={styles.input}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.checkboxContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isCreatingOrg}
              onChange={() => setIsCreatingOrg(!isCreatingOrg)}
              style={styles.checkbox}
            />
            Create a new organization
          </label>
        </div>
        {isCreatingOrg ? (
          <input
            type="text"
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            style={styles.input}
          />
        ) : (
          <input
            type="text"
            placeholder="Invitation Code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            style={styles.input}
          />
        )}
        <Button onClick={handleSignUp} style={styles.button} isLoading={isLoading}>
          Create Account
        </Button>
      </div>

      {alert.isOpen && (
        <Alert
          title={alert.title}
          message={alert.message}
          actions={alert.actions}
          onClose={alert.close}
        />
      )}

      {showVerificationModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Verify Your Email</h2>
            <p style={styles.modalMessage}>
              Please enter the verification code sent to your email.
            </p>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={styles.input}
            />
            <Button onClick={handleVerifyCode} style={styles.button} isLoading={isLoading}>
              Verify
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  authContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: colors.background,
    color: colors.text,
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.primary,
    fontSize: '1rem',
    cursor: 'pointer',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.cardColor,
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  modalTitle: {
    margin: '0 0 10px',
    fontSize: '1.5em',
    color: colors.primary,
  },
  modalMessage: {
    margin: '0 0 20px',
  },
};

export default SignUpPage;
