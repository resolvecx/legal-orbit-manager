import React, { createContext, useContext, useState } from 'react';

interface MockUser {
  id: string;
  email: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: any;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>({
    id: 'mock-user-1',
    email: 'demo@example.com'
  });
  const [profile, setProfile] = useState<UserProfile | null>({
    id: 'mock-user-1',
    email: 'demo@example.com',
    full_name: 'Demo User',
    role: 'admin'
  });
  const [loading] = useState(false);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Mock sign up:', email);
    const newUser = {
      id: `user-${Date.now()}`,
      email
    };
    const newProfile = {
      id: newUser.id,
      email,
      full_name: fullName || 'New User',
      role: 'user'
    };
    setUser(newUser);
    setProfile(newProfile);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Mock sign in:', email);
    const mockUser = {
      id: 'mock-user-1',
      email
    };
    const mockProfile = {
      id: 'mock-user-1',
      email,
      full_name: 'Demo User',
      role: 'admin'
    };
    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  };

  const signOut = async () => {
    console.log('Mock sign out');
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    console.log('Mock reset password for:', email);
    return { error: null };
  };

  const value = {
    user,
    session: user ? { user } : null,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};