"use client";

import { mockSkills } from "@/data/mockData";
import { Skill, User } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type MockDataContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  mockSkillData: Skill[];
  addSkill: (skill: Skill) => void;
  editSkill: (skill: Skill) => void;

  deleteSkill: (id: string) => void;
  loginUser: (currentUser: User) => void;
  logoutUser: () => void;
};

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined,
);

export const MockStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setTimeout(() => setUser(JSON.parse(stored)), 0);
  }, []);
  // Load user from localStorage on client-side only

  const loginUser = (currentUser: User) => {
    setUser(currentUser);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const [skills, setSkills] = useState<Skill[]>(mockSkills);

  const addSkill = (skill: Skill) => {
    const newSkill: Skill = {
      ...skill,
    };

    setSkills((prev) => [...prev, newSkill]);
  };
  const editSkill = (updatedSkill: Skill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill,
      ),
    );
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
        editSkill,
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
    throw new Error("useGlobalState must be used within MockDataProvider");
  }

  return context;
};
