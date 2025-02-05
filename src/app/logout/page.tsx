"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        router.push("/auth/login"); // Redirect to login page
      } else {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [router]);

  return <p>Logging out...</p>;
}
