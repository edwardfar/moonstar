"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../../lib/supabase";

type User = {
  id: string;
  email: string | null;
  role?: string;
  businessName?: string;
  business_name?: string; // Added to match the property used in the code
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setUser(null);
        return;
      }

      if (sessionData.session?.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, business_name")
          .eq("id", sessionData.session.user.id)
          .single();

        if (userError || !userData) {
          console.error("Error fetching user data:", userError);
          setUser(null);
        } else {
          setUser({
            id: userData.id,
            email: userData.email,
            businessName: userData.business_name || null, // Map business_name to businessName
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Unexpected error checking user session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error("Login error:", loginError);
        throw new Error("Invalid email or password.");
      }

      await checkUser();
    } catch (error) {
      console.error("Unexpected error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("cart"); // Clear cart on logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
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