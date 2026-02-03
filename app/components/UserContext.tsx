"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string | null;
  semester: string;
  major: string;
}

const UserContext = createContext<{ 
  user: User; 
  setName: (name: string) => void 
} | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Start with null to match server-side render and avoid hydration errors
  const [user, setUser] = useState<User>({ 
    name: null, 
    semester: "Semester I", 
    major: "CSIT" 
  });

  // Sync with localStorage only after mounting in the browser
  useEffect(() => {
    const savedName = localStorage.getItem("nexus_user_name");
    if (savedName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(prev => ({ ...prev, name: savedName }));
    }
  }, []);

  const setName = (name: string) => {
    localStorage.setItem("nexus_user_name", name);
    setUser(prev => ({ ...prev, name }));
  };

  return (
    <UserContext.Provider value={{ user, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};