import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppContextProvider } from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
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

