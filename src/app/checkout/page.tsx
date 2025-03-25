"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User object:", user); // Debugging log
      if (user.email) {
        setUserEmail(user.email);
        console.log("Captured User Email:", user.email);
      } else {
        console.error("User email is not available.");
      }
    }
  }, [user]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("You need to log in to proceed to checkout.");
      router.push("/auth/login");
      return;
    }

    if (!userEmail) {
      alert("Unable to retrieve your email. Please log in again.");
      console.error("Email is null or undefined.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_id: user.id,
        user_email: userEmail || "no-email@unknown.com", // Prevent null email
        total: parseFloat(getTotalPrice()),
        status: "pending",
        items: JSON.stringify(cart), // Ensure cart is stored correctly as JSON
        payment_type: "check",
      };

      console.log("Order Data to Insert:", orderData);

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        alert("Error creating order in the database.");
        setLoading(false);
        return;
      }

      alert("✅ Order placed successfully! Your order is being reviewed.");
      clearCart();
      router.push("/success");
    } catch (error) {
      console.error("❌ Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <h2 className="text-xl font-bold mb-4">Total: ${getTotalPrice()}</h2>

      <button
        className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Order"}
      </button>
    </div>
  );
}
