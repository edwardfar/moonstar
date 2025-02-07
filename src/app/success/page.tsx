"use client";

import React from "react";
import PrivateHeader from "../headers/privateheader";
import PublicHeader from "../headers/publicheader";
import { useAuth } from "../auth/AuthContext";

export default function SuccessPage() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      {user ? (
        <PrivateHeader handleLogout={() => {}} cartCount={0} />
      ) : (
        <PublicHeader />
      )}

      {/* Main Content */}
      <main className="flex-grow p-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Order!</h1>
          <p className="text-lg mb-6">
            Your order has been successfully placed. A confirmation email will be sent to you shortly.
          </p>
          <p className="text-gray-700">
            If you have any questions about your order, please contact our support team.
          </p>
          <div className="mt-6">
            <a
              href="/products"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
