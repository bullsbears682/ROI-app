import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Loading messages that rotate during loading
const loadingMessages = [
  "Calculating returns on your investment",
  "Analyzing 85+ business scenarios",
  "Preparing ROI calculations",
  "Loading industry benchmarks",
  "Optimizing for your success"
];

let messageIndex = 0;
let messageInterval;

// Update loading subtitle with rotating messages
const updateLoadingMessage = () => {
  const subtitle = document.querySelector('.loading-subtitle');
  if (subtitle) {
    subtitle.style.opacity = '0';
    setTimeout(() => {
      subtitle.textContent = loadingMessages[messageIndex];
      subtitle.style.opacity = '1';
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 300);
  }
};

// Start message rotation
const startMessageRotation = () => {
  messageInterval = setInterval(updateLoadingMessage, 1500);
};

// Hide loading spinner once React app loads
const hideLoading = () => {
  const loading = document.getElementById('loading');
  if (loading) {
    // Clear message interval
    if (messageInterval) clearInterval(messageInterval);
    
    // Fade out animation
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }
};

// Start the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Start message rotation immediately
startMessageRotation();

// Render the app
root.render(<App />);

// Remove loading screen after a brief delay to show the nice animation
setTimeout(hideLoading, 1200);