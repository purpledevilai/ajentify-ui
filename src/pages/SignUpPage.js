import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from './components/SharedStyles';
import { useAlert } from '../hooks/useAlert';
import AppPage from './components/AppPage';
import Button from './components/Button';
import { useSignUp } from "../hooks/useSignUp";
import { useConfirmSignUp } from '../hooks/useConfirmSignUp';
import { useLogin } from '../hooks/useLogin';
import { useCreateUser } from '../hooks/useCreateUser';
import { useCreateOrganization } from '../hooks/useCreateOrganization';

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const showAlert = useAlert();
  const { signUp, loading: signUpLoading } = useSignUp();
  const { confirmSignUp, loading: confirmSignUpLoading } = useConfirmSignUp();
  const { login, loading: loginLoading } = useLogin();
  const { createUser, loading: createUserLoading } = useCreateUser();
  const { createOrganization, loading: createOrganizationLoading } = useCreateOrganization();

  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Passwords match
    if (password !== confirmPassword) {
      showAlert({
        title: "Whoops!",
        message: "Passwords do not match. Please try again.",
      });
      return;
    }
    try {
      // Sign Up
      await signUp({ email, password, firstName, lastName });
      setShowVerificationModal(true);
    } catch (error) {
      showAlert({
        title: 'Sign Up Failed',
        message: error.message,
      })
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Confirm Sign Up
      await confirmSignUp({ email, verificationCode });

      // Login
      await login({ email, password });

      // Create the user
      await createUser();

      if (isCreatingOrg) {
        // Create the org
        await createOrganization({ organizationName });
      } else {
        //await processInvitation(accessToken);
      }

      // Success!
      setShowVerificationModal(false);
      showAlert({
        title: 'Setup Successful',
        message: 'Your account and organization have been set up.',
        actions: [
          {
            label: 'Go to Home',
            handler: () => navigate('/'),
          },
        ],
        onClose: () => navigate('/'),
      });
    } catch (error) {
      showAlert({
        title: 'Verification Failed',
        message: error.message
      })
    }
  };

  return (
    <AppPage style={styles.authContainer}>
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
        <Button onClick={handleSignUp} style={styles.button} isLoading={signUpLoading}>
          Create Account
        </Button>
      </div>

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
            <Button onClick={handleVerifyCode} style={styles.button} isLoading={confirmSignUpLoading || loginLoading || createUserLoading || createOrganizationLoading}>
              Verify
            </Button>
          </div>
        </div>
      )}
    </AppPage>
  );
}

const styles = {
  authContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
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
