import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../CartContext";
import getStripe from "../../../lib/stripe"; // Import Stripe

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [checkImage, setCheckImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paymentType, setPaymentType] = useState("card"); // Default: Credit Card

  // ✅ Calculate total cart price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // ✅ Handle file selection for check image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCheckImage(event.target.files[0]);
    }
  };

  // ✅ Upload check image to Supabase
  const uploadCheckImage = async (file: File) => {
    if (!file) return null;
    if (!user || !user.id) {
      alert("You must be logged in to upload a check image.");
      return null;
    }

    setUploading(true);
    
    try {
      const filePath = `checks/${user.id}-${Date.now()}.${file.name.split(".").pop()}`;

      const { data, error } = await supabase.storage
        .from("check_images")
        .upload(filePath, file);

      if (error) {
        console.error("❌ Error uploading check image:", error);
        alert("Failed to upload check image. Please try again.");
        setUploading(false);
        return null;
      }

      // ✅ Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from("check_images")
        .getPublicUrl(filePath);

      setUploading(false);
      return publicUrlData.publicUrl || null;
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("An error occurred while uploading the check image.");
      setUploading(false);
      return null;
    }
  };

  // ✅ Handle checkout process
  const handleCheckout = async () => {
    if (!user) {
      alert("You need to log in to proceed to checkout.");
      router.push("/auth/login");
      return;
    }

    try {
      let checkImageUrl = null;

      // 🟢 Case: User selects "Check" payment
      if (paymentType === "check") {
        if (!checkImage) {
          alert("Please upload a check image.");
          return;
        }

        checkImageUrl = await uploadCheckImage(checkImage);

        // ✅ Store check payment order in Supabase (No Stripe)
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
        return;
      }

      // 🟢 Case: User selects "Credit Card" payment
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe is not initialized.");
      }

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
        console.error("❌ Stripe Error:", stripeError);
        alert("Error processing Stripe payment.");
      }
    } catch (error) {
      console.error("❌ Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <h2 className="text-xl font-bold mb-4">Total: ${getTotalPrice()}</h2>

      {/* ✅ Select Payment Method */}
      <div className="mb-6">
        <label className="mr-4">
          <input
            type="radio"
            value="card"
            checked={paymentType === "card"}
            onChange={() => setPaymentType("card")}
          />
          Pay with Credit/Debit Card
        </label>
        <label className="ml-6">
          <input
            type="radio"
            value="check"
            checked={paymentType === "check"}
            onChange={() => setPaymentType("check")}
          />
          Pay with Check
        </label>
      </div>

      {/* ✅ Show file upload ONLY if "Check" is selected */}
      {paymentType === "check" && (
        <label className="block mb-4">
          <span className="text-gray-700">Upload Check Image</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 p-2 border rounded" />
        </label>
      )}

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
