import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/api';
import type { AuthResponse } from '../types/auth';

interface AuthContextProps {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (data: { name: string; email: string; password: string; role: string }) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  role: null,
  isAuthenticated: false,
  login: () => Promise.reject('AuthProvider not initialized'),
  signup: () => Promise.reject('AuthProvider not initialized'),
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const isAuthenticated = !!token;
  // const userRole = user?.role || null;

  useEffect(() => {
    if (token&&role) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      setToken(response.accessToken);
      setRole(response.role)
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('role',response.role)
      return response
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: { name: string; email: string; password: string; role: string }) => {
    try {
      const response = await auth.register(data);
      return response
    } catch (error) {
      throw error;
    }
  };
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, signup, logout, isAuthenticated }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
