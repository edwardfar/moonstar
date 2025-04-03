"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import Header from "../components/header"; // Unified Header

export default function SuccessPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard (account) after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Order Confirmed!
          </h1>
          <p className="text-lg text-gray-700">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          <p className="text-gray-500 mt-2">
            A confirmation email will be sent to you shortly.
          </p>
          {user && (
            <p className="mt-4 text-gray-800 font-semibold">
              Logged in as:{" "}
              <span className="text-blue-600">{user.email}</span>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-6">
            Redirecting you to your account dashboard...
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
