import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from 'styled-components';
import './index.css';
import App from './App';

axios.defaults.baseURL = 'http://localhost:5000';

// Attach authorization token from localStorage to all axios requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const theme = {
  colors: {
    background: '#121212',
    text: '#ffffff',
    primary: '#1db954',
    primaryDark: '#18a449',
    secondary: '#282828',
    error: '#ff3333',
    border: '#333333',
    inputBackground: '#2a2a2a',
    inputText: '#ffffff',
    placeholderText: '#a7a7a7',
    disabled: '#4d4d4d',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
); 