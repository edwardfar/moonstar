"use client"; // Add this at the top for client-side rendering
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import
import { supabase } from "../../../../lib/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registeringAs, setRegisteringAs] = useState("Individual");
  const [street, setStreet] = useState("");
  const [unitNumber, setUnitNumber] = useState(""); // Optional field
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState(""); // New state
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const { error: insertError } = await supabase.from('users').insert({
        id: data.user?.id,
        email,
        company_name: companyName,
        registering_as: registeringAs,
        is_approved: false,
        street: street, // Replace with your state variable
        unit_number: unitNumber,       // Optional
        city: city,            // Ensure you're using `address_city` here
        state: state,
        zip_code: zipCode,             // Ensure you match the column name in Supabase
    });    
      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
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
        <label className="block">
          Company Name <span className="text-gray-400">(Optional)</span>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block">
          Registering As: <span className="text-red-500">*</span>
          <select
            value={registeringAs}
            onChange={(e) => setRegisteringAs(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Individual">Individual</option>
            <option value="Retailer">Retailer</option>
            <option value="Distributor">Distributor</option>
          </select>
        </label>
        <label className="block">
          Street Address <span className="text-red-500">*</span>
          <input
            type="text"
            placeholder="Street Address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          Unit Number <span className="text-gray-400">(Optional)</span>
          <input
            type="text"
            placeholder="Unit Number"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block">
          City <span className="text-red-500">*</span>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          State <span className="text-red-500">*</span>
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          Zip Code <span className="text-red-500">*</span>
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
