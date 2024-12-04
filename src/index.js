import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppContextProvider } from './context/AppContext';
import { AgentContextProvider } from './context/AgentsContext';
import { AlertProvider } from './hooks/useAlert';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AlertProvider>
      <AppContextProvider>
        <AgentContextProvider>
          <App />
        </AgentContextProvider>
      </AppContextProvider>
    </AlertProvider>
  </React.StrictMode>
);

reportWebVitals();

const setViewportHeight = () => {
  const viewportHeight = window.innerHeight; // Get the visible height
  document.documentElement.style.setProperty('--available-height', `${viewportHeight}px`);
};

// Set the viewport height on page load and resize
window.addEventListener('load', setViewportHeight);
window.addEventListener('resize', setViewportHeight);

