'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Skill = 'reading' | 'listening' | 'writing' | 'speaking';

export interface Submission {
  id: string;
  skill: Skill;
  band: number;
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export interface User {
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

const STORAGE_KEY = 'ielts_user';
const DAY_MS = 1000 * 60 * 60 * 24;

const UserContext = createContext<UserContextType | undefined>(undefined);

function persistUser(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // localStorage có thể bị đầy hoặc bị chặn (chế độ ẩn danh) – không để app bị crash
    console.error('Không thể lưu dữ liệu người dùng:', error);
  }
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Tính số ngày học liên tiếp tính đến hôm nay (hoặc hôm qua nếu hôm nay chưa học). */
export function calculateStreak(submissions: Submission[]): number {
  if (submissions.length === 0) return 0;

  const uniqueDays = Array.from(
    new Set(
      submissions
        .map(s => new Date(s.date))
        .filter(d => !isNaN(d.getTime()))
        .map(d => startOfDay(d).getTime())
    )
  ).sort((a, b) => b - a); // Mới nhất trước

  if (uniqueDays.length === 0) return 0;

  const today = startOfDay(new Date()).getTime();
  const diffDays = Math.round((today - uniqueDays[0]) / DAY_MS);
  if (diffDays > 1) return 0; // Chuỗi đã bị đứt

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const gap = Math.round((uniqueDays[i - 1] - uniqueDays[i]) / DAY_MS);
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}

function sanitizeUser(raw: unknown): User | null {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as Partial<User>;
  if (!u.name || !u.email) return null;
  const submissions = Array.isArray(u.submissions)
    ? u.submissions.filter(s => s && typeof s.band === 'number' && !isNaN(s.band) && s.skill && s.date)
    : [];
  return {
    id: u.id || 'user_' + Math.random().toString(36).slice(2, 11),
    name: String(u.name),
    email: String(u.email),
    targetScore: typeof u.targetScore === 'number' ? u.targetScore : 6.5,
    currentLevel: u.currentLevel || 'Intermediate',
    submissions,
    badges: Array.isArray(u.badges) ? u.badges : [],
    // Tính lại streak khi tải trang để chuỗi bị đứt được cập nhật đúng
    streak: calculateStreak(submissions),
    xp: typeof u.xp === 'number' ? u.xp : 0,
    lastActiveDate: u.lastActiveDate,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsed = sanitizeUser(JSON.parse(savedUser));
        if (parsed) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      // Dữ liệu hỏng => xoá để tránh crash toàn bộ ứng dụng
      console.error('Dữ liệu người dùng bị lỗi, đang khởi tạo lại:', error);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, name: string, targetScore: number = 6.5) => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).slice(2, 11),
      email: email.trim(),
      name: name.trim(),
      targetScore,
      currentLevel: 'Intermediate',
      submissions: [],
      streak: 0,
      xp: 0,
      badges: [],
    };
    setUser(newUser);
    persistUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const addSubmission = useCallback((submission: Omit<Submission, 'id' | 'date'>) => {
    const band = Number(submission.band);
    if (!Number.isFinite(band)) {
      console.warn('Bỏ qua bài làm không có band hợp lệ:', submission);
      return;
    }

    // Dùng functional update để tránh mất dữ liệu do state cũ (stale closure)
    setUser(prev => {
      if (!prev) return prev;
      const newSubmission: Submission = {
        ...submission,
        band,
        id: 'sub_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        date: new Date().toISOString(),
      };
      const newSubmissions = [newSubmission, ...prev.submissions];
      const updatedUser: User = {
        ...prev,
        submissions: newSubmissions,
        streak: calculateStreak(newSubmissions),
        xp: prev.xp + 100, // 100 XP per submission
        lastActiveDate: newSubmission.date,
      };
      persistUser(updatedUser);
      return updatedUser;
    });
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...data };
      persistUser(updatedUser);
      return updatedUser;
    });
  }, []);

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
