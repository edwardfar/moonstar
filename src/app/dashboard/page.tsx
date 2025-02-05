"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import PrivateHeader from "../headers/privateheader";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  user_id: string;
  created_at: string;
  total: number;
  status: string;
  items: any;
};

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from("Orders").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <PrivateHeader handleLogout={handleLogout} />

      {/* Dashboard Content */}
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h2>

        {/* Order History */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Order History</h3>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="border-b py-2">
                  <strong>Order ID:</strong> {order.id}
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Items:</strong>{" "}
                    {order.items ? JSON.stringify(order.items) : "No items in order."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Promotions */}
        <section>
          <h3 className="text-2xl font-bold mb-4">Promotions</h3>
          <p>Get 20% off your next order!</p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 MoonStar Food LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
