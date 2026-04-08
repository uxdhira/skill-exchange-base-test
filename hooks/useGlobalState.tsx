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

// `use client` tells Next.js this file must run on the client side.
// We use it here because hooks, localStorage, and context state need the browser.

// This type describes everything that can be shared through global state.
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

// Create a shared context for user data and skill actions.
// `createContext` is used to create app-wide shared state.
// We use it to avoid passing user and skill data through many component levels.
const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined,
);

/**
 * MockStateProvider keeps shared demo data in one place.
 * Any component inside this provider can read or update the data.
 */
export const MockStateProvider = ({ children }: { children: ReactNode }) => {
  // `useState` stores the current user in local component/provider state.
  // We use it because the UI should update when login state changes.
  const [user, setUser] = useState<User | null>(null);

  // When the app opens in the browser, restore the saved user from localStorage.
  // `useEffect` runs after render for side effects.
  // We use it here because reading localStorage should happen in the browser.
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setTimeout(() => setUser(JSON.parse(stored)), 0);
  }, []);

  // Save the logged-in user in both React state and localStorage.
  const loginUser = (currentUser: User) => {
    setUser(currentUser);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  };

  // Clear the user when logging out.
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Keep all skills in shared state so multiple pages can use the same list.
  // Another `useState` is used here to keep the skill list reactive.
  const [skills, setSkills] = useState<Skill[]>(mockSkills);

  // Add a new skill to the shared list.
  const addSkill = (skill: Skill) => {
    const newSkill: Skill = {
      ...skill,
    };

    setSkills((prev) => [...prev, newSkill]);
  };

  // Replace the old version of a skill with the updated one.
  const editSkill = (updatedSkill: Skill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill,
      ),
    );
  };

  // Remove a skill by its id.
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

/**
 * useGlobalState is a custom hook that gives easy access to the shared context.
 */
export const useGlobalState = () => {
  // `useContext` reads values from the nearest provider.
  // We use it so any child component can access shared user/skill data easily.
  const context = useContext(MockDataContext);

  if (!context) {
    throw new Error("useGlobalState must be used within MockDataProvider");
  }

  return context;
};
