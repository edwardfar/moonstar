import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    console.log("pk_live_51Nu71vClxrcaecMncyg1hkuR4Ux4lPhvUPrAGZyVFPydMXaBgOU3y2J6JnDmPsSHmC1ZQNMBysXV6AQV3WhzKjN100oMpeiG2i:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    console.log("Stripe Loaded:", stripePromise);
  }
  return stripePromise;
};

export default getStripe;
