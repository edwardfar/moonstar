import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51QpjEeLbCJAppMgjp3uIIjqsBbCsfaKk6xeHSORMRLkvDQo0Pg8HdMxfztDGPWBaXXBPq8H49JRDuLsoabP3mxpp000tcmOcAC"); // Replace with your Stripe Publishable Key
  }
  return stripePromise;
};

export default getStripe;
