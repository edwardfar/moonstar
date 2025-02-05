"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";

type User = {
  id: string;
  email: string | null; // Allowing null values for email
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
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      setUser({
        id: data.session.user.id,
        email: data.session.user.email ?? null, // Handling undefined email
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUser();

    // Listen to auth state changes
    const subscription = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.data?.subscription?.unsubscribe?.();
    };
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
