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
  email: string | null; // Allowing null values for email
  role?: string; // Include role for additional checks if needed
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("email, registering_as")
          .eq("id", data.session.user.id)
          .single();
  
        if (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } else if (userData) {
          setUser({
            id: data.session.user.id,
            email: userData.email || null,
            role: userData.registering_as, // Map role correctly
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during user check:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
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
