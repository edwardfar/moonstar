"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getStripe from "../../../lib/stripe";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import Header from "../components/header";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart, updateQuantity, removeProduct, clearCart } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [paymentType, setPaymentType] = useState("card");

  // Fetch suggested products from Supabase
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      const { data, error } = await supabase.from("Products").select("*").limit(5);
      if (error) console.error("Error fetching suggested products:", error);
      else setSuggestedProducts(data || []);
    };
    fetchSuggestedProducts();
  }, []);

  // Calculate total quantity of items
  const getTotalQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle Checkout Process
  const handleCheckout = async () => {
    if (!user) {
      alert("You need to log in to proceed to checkout.");
      router.push("/auth/login");
      return;
    }

    try {
      if (paymentType === "card") {
        // Stripe Checkout
        const stripe = await getStripe();
        if (!stripe) throw new Error("Stripe is not initialized.");

        const { error: stripeError } = await stripe.redirectToCheckout({
          lineItems: cart.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: { name: item.name, images: [`/${item.image}`] },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          })),
          mode: "payment",
          successUrl: process.env.SUCCESS_URL || "http://localhost:3000/success",
          cancelUrl: process.env.CANCEL_URL || "http://localhost:3000/cancel",
        });

        if (stripeError) {
          console.error("Stripe Error:", stripeError);
          alert("Error processing Stripe payment.");
        }
      } else {
        // Insert order for check payments in Supabase
        const { error } = await supabase.from("orders").insert([
          {
            user_id: user.id,
            total: parseFloat(getTotalPrice()),
            status: "pending",
            items: cart,
            payment_type: "check",
          },
        ]);

        if (error) {
          console.error("Supabase Error:", error);
          alert("Error creating order in the database.");
          return;
        }

        alert("✅ Order placed successfully! Your check will be reviewed.");
        clearCart();
        router.push("/success");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-10">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {/* Payment Options */}
        <div className="mb-6">
          <label className="mr-4">
            <input type="radio" value="card" checked={paymentType === "card"} onChange={() => setPaymentType("card")} />
            Pay with Credit/Debit Card
          </label>
          <label className="ml-6">
            <input type="radio" value="check" checked={paymentType === "check"} onChange={() => setPaymentType("check")} />
            Pay with Check
          </label>
        </div>

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
                      <Image src={`/${item.image}`} alt={item.name} width={50} height={50} className="object-cover rounded" />
                      <div>
                        <p>{item.name}</p>
                      </div>
                    </td>
                    <td className="p-4 flex items-center">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 px-2 py-1 rounded">-</button>
                      <span className="px-4">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 px-2 py-1 rounded">+</button>
                    </td>
                    <td className="p-4">${item.price}</td>
                    <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="p-4">
                      <button onClick={() => removeProduct(item.id)} className="text-red-500">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <h2 className="text-xl font-bold">Total: ${getTotalPrice()}</h2>
              <button className="bg-blue-500 text-white px-6 py-2 rounded" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg">Your cart is empty.</p>
        )}
      </main>
    </div>
  );
}
