"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import Header from "../components/header";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, updateQuantity, removeProduct, clearCart } = useCart();

  // Optional: Show suggested products at the bottom
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  // Fetch a few products from Supabase (optional)
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .limit(5);

      if (error) {
        console.error("Error fetching suggested products:", error);
      } else {
        setSuggestedProducts(data || []);
      }
    };
    fetchSuggestedProducts();
  }, []);

  // Calculate total price (as a string)
  const getTotalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  // Submit the order (no Stripe, no checks)
  const handleSubmitOrder = async () => {
    if (!user) {
      alert("You need to log in to place an order.");
      router.push("/auth/login");
      return;
    }

    try {
      // Insert a new order into Supabase
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          total: parseFloat(getTotalPrice()),
          status: "pending",
          items: cart, // Make sure 'items' is a jsonb column in your 'orders' table
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        alert("Error creating order in the database.");
        return;
      }

      alert("✅ Order placed successfully! We will contact you soon.");
      clearCart();
      router.push("/"); // Or router.push("/success") if you have a success page
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-10">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cart.length > 0 ? (
          <>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-4">Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4 flex items-center gap-4">
                      <Image
                        src={`/${item.image}`}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                      />
                      <div>
                        <p>{item.name}</p>
                      </div>
                    </td>
                    <td className="p-4 flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </td>
                    <td className="p-4">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeProduct(item.id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <h2 className="text-xl font-bold">Total: ${getTotalPrice()}</h2>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmitOrder}
              >
                Submit Order
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg">Your cart is empty.</p>
        )}

        {/* Optional: Suggested Products Section */}
        {suggestedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {suggestedProducts.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded shadow">
                  <Image
                    src={`/${product.image || "placeholder.png"}`}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="object-cover rounded mb-2"
                  />
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
