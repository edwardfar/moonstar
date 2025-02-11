"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import Header from "../../components/header"; // Use global Header

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before login attempt

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("❌ Invalid email or password. Please try again.");
        return;
      }

      // ✅ Fetch user profile from database
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("is_approved, registering_as")
        .eq("id", authData.user?.id)
        .single();

      if (profileError || !userProfile) {
        setError("⚠️ Unable to retrieve user profile. Please contact support.");
        return;
      }

      if (!userProfile.is_approved) {
        setError("⏳ Your account is pending approval. Please wait for admin approval.");
        await supabase.auth.signOut();
        return;
      }

      // ✅ Redirect to Dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError("⚠️ An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Use the global header */}
      <Header />

      {/* Login Form */}
      <div className="max-w-md mx-auto p-6 border rounded shadow-lg mt-10 bg-white">
        <h1 className="text-2xl font-bold mb-4">🔑 Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            Email <span className="text-red-500">*</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>
          <label className="block">
            Password <span className="text-red-500">*</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* ✅ Display errors dynamically */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
