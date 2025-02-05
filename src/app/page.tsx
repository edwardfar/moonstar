"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Adjust the path as per your folder structure
import PublicHeader from "./headers/publicheader"; // Ensure the path is correct
import PrivateHeader from "./headers/privateheader"; // Ensure the path is correct

// Define the User type based on Supabase's user structure
type SupabaseUser = {
  id: string;
  email: string | null | undefined; // Updated to handle undefined values
};

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session?.user) {
        setUser({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email ?? null, // Handle undefined email
        });
      } else {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  return (
    <div>
      {/* Render the appropriate header */}
      {user ? <PrivateHeader /> : <PublicHeader />}

      {/* Main content */}
      <main className="p-10 text-center">
        <h1 className="text-4xl font-bold">Welcome to MoonStar Food LLC</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore our products and enjoy the best FMCG and snacks.
        </p>
        <div className="mt-6">
          <a
            href={user ? "/products" : "/auth/login"}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            {user ? "Explore Products" : "Login to Start"}
          </a>
        </div>
      </main>
    </div>
  );
}
