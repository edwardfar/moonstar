"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import PrivateHeader from "../headers/privateheader";
import PublicHeader from "../headers/publicheader";
import { useAuth } from "../auth/AuthContext";
import Image from "next/image";
import getStripe from "../../../lib/stripe"; // Ensure the path is correct

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  // Fetch cart items from localStorage
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartItems);
  }, []);

  // Fetch suggested products from Supabase
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      const { data, error } = await supabase.from("Products").select("*").limit(5);
      if (error) {
        console.error("Error fetching suggested products:", error);
      } else {
        setSuggestedProducts(data || []);
      }
    };
    fetchSuggestedProducts();
  }, []);

  // Update cart in localStorage
  const updateCart = (updatedCart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Increase product quantity
  const increaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    updateCart(updatedCart);
  };

  // Decrease product quantity
  const decreaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  // Remove product from cart
  const removeProduct = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Checkout logic
  const handleCheckout = async () => {
    if (!user) {
      alert("You need to log in to proceed to checkout.");
      return;
    }

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe is not initialized.");
      }

      const { data, error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          total: parseFloat(getTotalPrice()),
          status: "pending",
          items: cart,
          payment_type: "card",
        },
      ]);

      if (error) {
        console.error("Error creating order:", error);
        return;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [`https://www.moonstarfood.us/${item.image}`],
              metadata: { barcode: item.barcode }, // Include barcode in metadata
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "https://www.moonstarfood.us/success",
        cancel_url: "https://www.moonstarfood.us/cancel",
      });

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      {user ? (
        <PrivateHeader handleLogout={() => {}} cartCount={cart.length} />
      ) : (
        <PublicHeader />
      )}

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
                {cart.map((item, index) => (
                  <tr key={index} className="border-b">
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
                        <p className="text-sm text-gray-600">Barcode: {item.barcode}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decreaseQuantity(index)}
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(index)}
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4">${item.price.toFixed(2)}</td>
                    <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => removeProduct(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Total: ${getTotalPrice()}</h2>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </main>
    </div>
  );
}
