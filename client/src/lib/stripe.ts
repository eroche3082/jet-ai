import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "./queryClient";

// Load the Stripe.js library with your publishable key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

/**
 * Creates a payment intent for one-time purchases
 * @param items Items to purchase
 * @param amount Amount to charge in dollars (will be converted to cents)
 */
export async function createPaymentIntent(items: { id: string }[], amount: number) {
  try {
    const response = await apiRequest("POST", "/api/create-payment-intent", { 
      items, 
      amount 
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

/**
 * Creates or retrieves an existing subscription for the user
 */
export async function getOrCreateSubscription() {
  try {
    const response = await apiRequest("POST", "/api/get-or-create-subscription");
    return await response.json();
  } catch (error) {
    console.error("Error with subscription:", error);
    throw error;
  }
}

/**
 * Retrieve available subscription plans
 */
export async function getSubscriptionPlans() {
  try {
    const response = await apiRequest("GET", "/api/subscription-plans");
    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
}
