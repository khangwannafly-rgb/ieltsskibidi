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
  badges?: string[];
  streak: number;
  xp: number;
  lastActiveDate?: string;
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
      if (parsedUser.streak === undefined) parsedUser.streak = 0;
      if (parsedUser.xp === undefined) parsedUser.xp = 0;
      if (!parsedUser.badges) parsedUser.badges = [];
      
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
      streak: 0,
      xp: 0,
      badges: [],
    };
    setUser(newUser);
    localStorage.setItem('ielts_user', JSON.stringify(newUser));
  };

  const calculateStreak = (submissions: Submission[]) => {
    if (submissions.length === 0) return 0;
    
    const dates = submissions
      .map(s => new Date(s.date).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i); // Unique dates

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(today);
    
    // Check if the user has practiced today or yesterday to continue streak
    const lastPracticeDate = new Date(dates[0]);
    lastPracticeDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0; // Streak broken

    for (let i = 0; i < dates.length; i++) {
      const practiceDate = new Date(dates[i]);
      practiceDate.setHours(0, 0, 0, 0);
      
      if (practiceDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (practiceDate.getTime() < currentDate.getTime()) {
        break;
      }
    }
    
    return streak;
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

    const newSubmissions = [newSubmission, ...user.submissions];
    const newStreak = calculateStreak(newSubmissions);
    const newXP = user.xp + 100; // 100 XP per submission

    const updatedUser: User = {
      ...user,
      submissions: newSubmissions,
      streak: newStreak,
      xp: newXP,
      lastActiveDate: new Date().toISOString(),
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
