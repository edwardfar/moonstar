"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../../lib/supabase";
// Removed: import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string | null;
  role?: string;
  businessName?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check user session
  const checkUser = async () => {
    try {
      // Rename "data" to "sessionData" so it's clear and used below.
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email, business_name")
          .eq("id", sessionData.session.user.id)
          .single();
        console.log("🔍 Supabase session:", sessionData.session);
        console.log("🔍 Supabase userData:", userData);
        if (!userError && userData) {
          setUser({
            id: sessionData.session.user.id,
            email: userData.email || null,
            businessName: userData.business_name || null,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data: loginData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error);
      return;
    }
    await checkUser();
    // Removed: router.push("/") since we don't need navigation in this context.
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("cart"); // Clear cart on logout
    // Removed: router.push("/")
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
