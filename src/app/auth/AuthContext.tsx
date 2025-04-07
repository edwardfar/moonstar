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
  // Removed router as it's not needed:
  // const router = useRouter();

  // ✅ Check user session
  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("email, business_name")
          .eq("id", data.session.user.id)
          .single();
        console.log("🔍 Supabase session:", data.session);
        console.log("🔍 Supabase userData:", userData);

        if (!error && userData) {
          setUser({
            id: data.session.user.id,
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

  // ✅ Login function (refresh state)
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error);
      return;
    }
    await checkUser(); // Refresh user state after login
    // Removed navigation call: router.push("/");
  };

  // ✅ Logout function (clear cart + refresh state)
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("cart"); // Clear cart on logout
    // Removed navigation call: router.push("/");
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
