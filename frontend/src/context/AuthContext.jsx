import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bb_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount or token changes
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Session verification failed, logging out:', err);
        // Token is invalid or expired
        localStorage.removeItem('bb_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('bb_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('bb_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.detail || 'Registration failed. Email might already be taken.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bb_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      await api.put('/api/auth/profile', profileData);
      setUser((prev) => ({ ...prev, ...profileData }));
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      const msg = err.response?.data?.detail || 'Failed to update profile.';
      return { success: false, error: msg };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      await api.put('/api/auth/change-password', { current_password, new_password });
      return { success: true };
    } catch (err) {
      console.error('Change password error:', err);
      const msg = err.response?.data?.detail || 'Failed to change password.';
      return { success: false, error: msg };
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/api/auth/delete-account');
      logout();
      return { success: true };
    } catch (err) {
      console.error('Delete account error:', err);
      const msg = err.response?.data?.detail || 'Failed to delete account.';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
