import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers with token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is valid and load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token is expired, log out user
          logoutUser();
          setLoading(false);
          return;
        }

        // Get user data
        const response = await api.get('/auth/me');
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user:', err);
        logoutUser();
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const registerUser = async (userData) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      // Save token to local storage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  // Login user
  const loginUser = async (userData) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', userData);
      const { token: newToken, user: newUser } = response.data;
      
      // Save token and user to local storage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      console.log('Login error:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  // Logout user
  const logoutUser = () => {
    // Remove token and user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Profile update failed. Please try again.');
      return { success: false, error: err.response?.data?.error || 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 