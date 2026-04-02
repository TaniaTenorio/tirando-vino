"use client";

import { User } from "@/interfaces/user";
import React from "react";
import { getUser } from "@/actions/auth/getUser";
import { createClient } from "@/lib/supabase/client";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
}

const eventTypes = [
  "INITIAL_SESSION",
  "SIGNED_IN",
  "USER_UPDATED",
  "TOKEN_REFRESHED",
  "PASSWORD_RECOVERY",
  "SIGNED_OUT",
];

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user data
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (eventTypes.includes(event)) {
        if (session) {
          getUserData();
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
