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

  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  // Fetch suggested products (optional)
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

  // Calculate total price safely
  const getTotalPrice = () => {
    let sum = 0;
    cart.forEach((item) => {
      const numericPrice =
        typeof item.price === "number"
          ? item.price
          : parseFloat(item.price ?? "0");
      sum += numericPrice * (item.quantity || 0);
    });
    return sum.toFixed(2);
  };

  // Submit order: Insert into orders then order_items
  const handleSubmitOrder = async () => {
    if (!user) {
      alert("You need to log in to place an order.");
      router.push("/auth/login");
      return;
    }

    try {
      const totalPrice = parseFloat(getTotalPrice());
      // Insert into orders and return the inserted row
      const { data: insertedOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total: totalPrice,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Error inserting order:", orderError);
        alert("Error creating order in the database.");
        return;
      }
      if (!insertedOrder) {
        alert("No order returned from the database.");
        return;
      }

      console.log("Inserted order:", insertedOrder);
      const orderId = insertedOrder.id;

      // Insert each cart item into order_items
      const itemsToInsert = cart.map((item) => {
        const numericPrice =
          typeof item.price === "number"
            ? item.price
            : parseFloat(item.price ?? "0");

        return {
          order_id: orderId,
          product_id: item.id,
          product_name: item.name,
          price: numericPrice,
          quantity: item.quantity || 0,
          image: item.image,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error inserting order items:", itemsError);
        alert("Error creating order items in the database.");
        return;
      }

      clearCart();
      router.push("/success");
    } catch (err) {
      console.error("Unexpected error submitting order:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Header />

      {/* Add top margin so the header doesn't cover content */}
      <main className="flex-grow p-6 md:p-10 mt-20">
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
                {cart.map((item, index) => {
                  console.log("Cart item at index:", index, item);
                  if (!item) {
                    return (
                      <tr key={index}>
                        <td colSpan={5} className="p-4 text-red-500">
                          Invalid cart item
                        </td>
                      </tr>
                    );
                  }
                  // Ensure item.image is a valid string; if missing, use a remote placeholder.
                  const fallbackUrl = "https://via.placeholder.com/50";
                  const imgValue =
                    typeof item.image === "string" && item.image.length > 0
                      ? item.image
                      : fallbackUrl;
                  const imageSrc = imgValue.startsWith("http")
                    ? imgValue
                    : `/${imgValue}`;

                  // Safely convert price to a number
                  const numericPrice =
                    typeof item.price === "number"
                      ? item.price
                      : parseFloat(item.price ?? "0");

                  return (
                    <tr key={item.id ?? index} className="border-b">
                      <td className="p-4 flex items-center gap-4">
                        <Image
                          src={imageSrc}
                          alt={item.name || "No Name"}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                        <div>
                          <p>{item.name || "Unnamed Product"}</p>
                        </div>
                      </td>
                      <td className="p-4 flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded"
                        >
                          +
                        </button>
                      </td>
                      <td className="p-4">${numericPrice.toFixed(2)}</td>
                      <td className="p-4">
                        {(numericPrice * (item.quantity || 0)).toFixed(2)}
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
                  );
                })}
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

        {/* Optional: Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {suggestedProducts.map((product) => {
                const fallbackSuggestion = "https://via.placeholder.com/100";
                const suggestionImage =
                  typeof product.image === "string" && product.image.length > 0
                    ? product.image
                    : fallbackSuggestion;
                const suggestionImageSrc = suggestionImage.startsWith("http")
                  ? suggestionImage
                  : `/${suggestionImage}`;
                return (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded shadow text-center"
                  >
                    <Image
                      src={suggestionImageSrc}
                      alt={product.name || "No Name"}
                      width={100}
                      height={100}
                      className="object-cover rounded mb-2 mx-auto"
                    />
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      ${product.price?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
