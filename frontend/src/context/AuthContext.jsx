import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AUTH_STATES = {
  LOADING: 'AUTH_LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED'
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(AUTH_STATES.LOADING);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Validate session on boot
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('labelguard_token');
      const savedUser = localStorage.getItem('labelguard_user');

      if (!savedToken) {
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        setUser(null);
        setToken('');
        return;
      }

      try {
        // Validate with backend /api/v1/user/me
        const res = await axios.get('/api/v1/user/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });

        if (res.data?.data) {
          const verifiedUser = res.data.data;
          setUser(verifiedUser);
          setToken(savedToken);
          localStorage.setItem('labelguard_user', JSON.stringify(verifiedUser));
          setAuthState(AUTH_STATES.AUTHENTICATED);
        } else {
          throw new Error('Invalid user payload');
        }
      } catch (err) {
        console.warn('Session token expired or invalid, logging out:', err?.response?.data?.message || err.message);
        localStorage.removeItem('labelguard_token');
        localStorage.removeItem('labelguard_user');
        setUser(null);
        setToken('');
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
      }
    };

    initAuth();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem('labelguard_token', accessToken);
    localStorage.setItem('labelguard_user', JSON.stringify(userData));
    setUser(userData);
    setToken(accessToken);
    setAuthState(AUTH_STATES.AUTHENTICATED);
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/v1/user/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn('Logout API notification failed, clearing local session:', e.message);
    } finally {
      localStorage.removeItem('labelguard_token');
      localStorage.removeItem('labelguard_user');
      setUser(null);
      setToken('');
      setAuthState(AUTH_STATES.UNAUTHENTICATED);
    }
  };

  return (
    <AuthContext.Provider value={{
      authState,
      isAuthenticated: authState === AUTH_STATES.AUTHENTICATED,
      isLoading: authState === AUTH_STATES.LOADING,
      user,
      token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

