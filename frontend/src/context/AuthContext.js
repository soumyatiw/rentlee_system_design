'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken as setApiToken, clearToken as clearApiToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // contains { id, role, ... }
      } catch (err) {
        console.error('Invalid token found', err);
        clearApiToken();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    setApiToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (err) {
      console.error('Login failed to decode token', err);
      return null;
    }
  };

  const logout = () => {
    clearApiToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
