import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { colors } from './SharedStyles';
import { useLogout } from "../../hooks/user/useLogout";
import { useAlert } from '../../hooks/useAlert';

const Header = ({ isMobile, onToggleSidebar }) => {

  const { logout, loading: logoutLoading} = useLogout();
  const navigate = useNavigate();
  const showAlert = useAlert();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      showAlert({
        title: "Error",
        message: error.message || "An unknown error occurred. Please try again.",
      });
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        {isMobile && (
          <button style={styles.hamburger} onClick={onToggleSidebar}>
            ☰
          </button>
        )}
        <h1 style={styles.title}>Ajentify</h1>
      </div>
      <Button onClick={handleLogout} isLoading={logoutLoading} style={styles.logoutButton}>
        Logout
      </Button>
    </header>
  )
};

// Header styles
const styles = {
  header: {
    display: 'flex',
    height: '70px',
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
    color: colors.primary,
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
};

export default Header;
