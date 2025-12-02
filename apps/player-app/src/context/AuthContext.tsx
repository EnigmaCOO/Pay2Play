import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, getCurrentUser, logOut } from "@/lib/auth";
import { User } from "firebase/auth";
import { useLocation, useWouter, navigate } from "wouter";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Redirect authenticated users from '/' to '/dashboard'
      if (firebaseUser && location === "/") {
        navigate("/dashboard");
      }
      // Redirect unauthenticated users from protected routes to '/'
      if (!firebaseUser && location !== "/" && location !== "/contact") {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [location]);

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
