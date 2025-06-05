"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { logout } from "~/app/(auth)/login/actions/auth";
import { getSession } from "~/lib/session";

type User = {
  userId: number;
  name: string;
  role: string;
  expires: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkSession = async () => {
      // Gọi API để kiểm tra session
      const session = await getSession();
      if (session) {
        setUser(session);
      } else {
        await logout();
        return;
      }
    };
    checkSession();
  }, []);
  // Kiểm tra token hết hạn
  useEffect(() => {
    if (user && new Date(user.expires) < new Date()) {
      setUser(null);
      setIsAuthenticated(false);
    } else if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);
  const value = {
    user,
    setUser,
    isAuthenticated,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
