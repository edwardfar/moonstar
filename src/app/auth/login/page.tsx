"use client"; // for Next.js 13+ with app router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase"; // adjust path as needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data?.session) {
      setError(loginError?.message || "Login failed. Please try again.");
      return;
    }

    // Redirect to products page
    router.push("/products");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md p-8 rounded-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="font-semibold text-gray-700">Email</span>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="font-semibold text-gray-700">Password</span>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600"
          >
            Sign In
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
