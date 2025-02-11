"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [checkImage, setCheckImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCheckImage(event.target.files[0]);
    }
  };

  const uploadCheckImage = async (file: File) => {
    if (!file) return null;
    if (!user || !user.id) {
      alert("You must be logged in to upload a check image.");
      return null;
    }

    setUploading(true);

    try {
      const filePath = `checks/${user.id}-${Date.now()}.${file.name.split(".").pop()}`;

      const { error } = await supabase.storage.from("check_images").upload(filePath, file);
      if (error) {
        console.error("❌ Error uploading check image:", error);
        alert("Failed to upload check image. Please try again.");
        setUploading(false);
        return null;
      }

      const { data: publicUrlData } = supabase.storage.from("check_images").getPublicUrl(filePath);
      setUploading(false);
      return publicUrlData.publicUrl || null;
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("An error occurred while uploading the check image.");
      setUploading(false);
      return null;
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("You need to log in to proceed to checkout.");
      router.push("/auth/login");
      return;
    }

    try {
      if (!checkImage) {
        alert("Please upload a check image.");
        return;
      }

      const checkImageUrl = await uploadCheckImage(checkImage);

      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          total: parseFloat(getTotalPrice()),
          status: "pending",
          items: cart,
          payment_type: "check",
          check_image_url: checkImageUrl || null,
        },
      ]);

      if (error) {
        console.error("❌ Supabase Error:", error);
        alert("Error creating order in the database.");
        return;
      }

      alert("✅ Order placed successfully! Your check will be reviewed.");
      clearCart();
      router.push("/success");
    } catch (error) {
      console.error("❌ Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <h2 className="text-xl font-bold mb-4">Total: ${getTotalPrice()}</h2>

      <label className="block mb-4">
        <span className="text-gray-700">Upload Check/Wire Transfer Screenshot</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 p-2 border rounded" />
      </label>

      <button
        className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleCheckout}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit Order"}
      </button>
    </div>
  );
}
