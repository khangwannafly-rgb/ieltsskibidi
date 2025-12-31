'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Submission {
  id: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  band: number;
  date: string;
  details?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  targetScore: number;
  currentLevel: string;
  submissions: Submission[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
  login: (email: string, name: string, targetScore?: number) => Promise<void>;
  logout: () => void;
  addSubmission: (submission: Omit<Submission, 'id' | 'date'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('ielts_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure submissions array exists
      if (!parsedUser.submissions) {
        parsedUser.submissions = [];
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, name: string, targetScore: number = 6.5) => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      targetScore,
      currentLevel: 'Intermediate',
      submissions: [],
    };
    setUser(newUser);
    localStorage.setItem('ielts_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ielts_user');
  };

  const addSubmission = (submission: Omit<Submission, 'id' | 'date'>) => {
    if (!user) return;
    
    const newSubmission: Submission = {
      ...submission,
      id: 'sub_' + Date.now(),
      date: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      submissions: [newSubmission, ...user.submissions],
    };

    setUser(updatedUser);
    localStorage.setItem('ielts_user', JSON.stringify(updatedUser));
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('ielts_user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, login, logout, addSubmission }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
