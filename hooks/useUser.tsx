"use client";

import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user === null) {
      localStorage.removeItem("currentUser");
    } else if (user !== undefined) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]);

  return [user, setUser] as const;
}
