import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '../types';

export interface UserProfile {
  id: string;
  employee_id: string;
  role: UserRole;
  employee_name: string;
}

interface AuthContextType {
  session: any | null;
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedRole = localStorage.getItem('mock_role');
    if (storedRole) {
      signIn(storedRole as UserRole);
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (role: UserRole) => {
    const mockUser = { id: `mock-${role.toLowerCase()}` };
    const mockProfile: UserProfile = {
      id: mockUser.id,
      employee_id: role === 'Admin' ? 'admin' : role === 'Manager' ? 'manager' : 'employee',
      role: role,
      employee_name: role === 'Admin' ? 'Admin User' : role === 'Manager' ? 'Project Manager' : 'Employee User'
    };
    
    setSession({ user: mockUser });
    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem('mock_role', role);
    setLoading(false);
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mock_role');
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
