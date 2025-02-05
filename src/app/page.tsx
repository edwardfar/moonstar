"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Adjust the path as per your folder structure
import PublicHeader from "./publicheader"; // Ensure the path is correct
import PrivateHeader from "./privateheader"; // Ensure the path is correct

// Define the User type based on Supabase's user structure
type SupabaseUser = {
  id: string;
  email?: string; // Mark email as optional to handle undefined values
  [key: string]: any; // Allow other fields from Supabase user object
};

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error fetching user session:", error);
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
