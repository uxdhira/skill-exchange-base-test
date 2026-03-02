'use client';

import { mockSkills } from '@/data/mockData';
import { Skill, User } from '@/types';
import { createContext, useContext, useState, ReactNode } from 'react';

type MockDataContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  mockSkillData: Skill[];
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  loginUser: (currentUser: User) => void;
  logoutUser: () => void;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockStateProvider = ({ children }: { children: ReactNode }) => {
  //   const [currUser,
  // ] = useState<User | null>(currentUser);
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;

    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  // Load user from localStorage on client-side only
  // useEffect(() => {
  //   try {
  //     const storedUser = localStorage.getItem('currentUser');
  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser));
  //     }
  //   } catch {
  //     setUser(null);
  //   }
  // }, []);

  const loginUser = (currentUser: User) => {
    setUser(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const [skills, setSkills] = useState<Skill[]>(mockSkills);

  const addSkill = (skill: Skill) => {
    const newSkill: Skill = {
      ...skill,
    };

    setSkills((prev) => [...prev, newSkill]);
  };
  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  return (
    <MockDataContext.Provider
      value={{
        user,
        setUser,
        mockSkillData: skills,
        addSkill,
        deleteSkill,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(MockDataContext);

  if (!context) {
    throw new Error('useGlobalState must be used within MockDataProvider');
  }

  return context;
};
