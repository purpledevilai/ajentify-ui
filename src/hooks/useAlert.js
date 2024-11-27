import React, { useState, createContext, useContext } from 'react';
import Alert from '../pages/components/Alert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    actions: [],
    onCloseCallback: null,
  });

  const showAlert = ({ title, message, actions = [{ label: 'Ok', handler: null }], onClose }) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      actions,
      onCloseCallback: onClose || null,
    });
  };

  const closeAlert = () => {
    if (alertState.onCloseCallback) {
      alertState.onCloseCallback();
    }

    // Reset the alert state
    setAlertState({
      isOpen: false,
      title: '', 
      message: '',
      actions: [],
      onCloseCallback: null,
    });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState.isOpen && (
        <Alert
          title={alertState.title}
          message={alertState.message}
          actions={alertState.actions}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context.showAlert;
};
