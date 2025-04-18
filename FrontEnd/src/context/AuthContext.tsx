import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { getUserRole } from '../services/authService';

interface AuthContextType { role: string | null; logout: () => void; }
const AuthContext = createContext<AuthContextType>({ role: null, logout: () => {} });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => { setRole(getUserRole()); }, []);
  const logout = () => { localStorage.removeItem('jwtToken'); setRole(null); window.location.href = '/login'; };
  return <AuthContext.Provider value={{ role, logout }}>{children}</AuthContext.Provider>;
};
export function useAuth() { return useContext(AuthContext); }