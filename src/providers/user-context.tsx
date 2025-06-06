"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { getUser } from "~/lib/dal";
import { deleteSession } from "~/lib/session";

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
  isLoading: boolean;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    try {
      // await logout(); // Gọi API logout nếu cần
      await deleteSession();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userAuth = await getUser();
        if (userAuth) {
          setUser({
            userId: userAuth.id,
            name: userAuth.name,
            role: userAuth.role,
            expires: userAuth.expires,
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const isAuthenticated = !!user && new Date(user.expires) > new Date();

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      isLoading,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
