"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import Header from "../../components/header"; // ✅ Your unified header

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [street, setStreet] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1) Create Supabase Auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !data.user) {
        setError("Failed to create an account. Please try again.");
        return;
      }

      // 2) Insert additional user details in 'users' table
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id, // match the Auth user ID
        email,
        phone,
        business_name: businessName,
        street,
        unit_number: unitNumber,
        city,
        state,
        zip_code: zipCode,
        is_approved: false,
      });

      if (insertError) {
        console.error(insertError);
        setError("Failed to save user details. Please try again.");
        return;
      }

      // 3) Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 relative">
          <h1 className="text-3xl font-extrabold text-orange-600 text-center mb-6">
            Create Your Account
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Please fill out the form below to get started. All fields marked with
            <span className="text-red-500 mx-1">*</span>
            are required.
          </p>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Email and Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Phone and Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="Your Company LLC"
                />
              </div>
            </div>

            {/* Street and Unit */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           focus:border-orange-500 transition-all"
                placeholder="123 Main St."
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Unit Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           focus:border-orange-500 transition-all"
                placeholder="Apt 4B"
              />
            </div>

            {/* City, State, Zip in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-orange-500
                             focus:border-orange-500 transition-all"
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 font-bold text-white rounded-md
                         bg-gradient-to-r from-orange-500 to-pink-500
                         hover:from-orange-600 hover:to-pink-600
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 mt-4 text-center font-semibold">{error}</p>
          )}

          {/* Already have an account? */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-orange-600 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-4">
        <div className="text-center">
          © 2025 MoonStar Food LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
