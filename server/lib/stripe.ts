import Stripe from "stripe";

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Default price ID if not specified
const DEFAULT_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_default";

/**
 * Create a payment intent for one-time purchases
 * @param amount Amount to charge in dollars (will be converted to cents)
 * @param items Items being purchased (for metadata)
 */
export async function createPaymentIntent(amount: number, items: any[]) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        items: JSON.stringify(items.map(item => item.id)),
      },
    });
    
    return paymentIntent;
  } catch (error: any) {
    console.error("Stripe payment intent error:", error);
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
}

/**
 * Create or retrieve a subscription for a user
 * @param userId User ID
 * @param options Subscription options
 */
export async function createSubscription(
  userId: number,
  options: {
    email: string;
    planId: string;
    interval: "month" | "year";
  }
) {
  try {
    // In a production app, you would retrieve or create the customer
    // For now, we'll create a new customer each time
    const customer = await stripe.customers.create({
      email: options.email,
      metadata: {
        userId: userId.toString()
      }
    });

    // Get price ID based on plan and interval
    // In a real app, you would have a mapping of plan IDs to Stripe price IDs
    const priceId = getPriceId(options.planId, options.interval);

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Extract the client secret
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    
    return {
      id: subscription.id,
      clientSecret: paymentIntent.client_secret
    };
  } catch (error: any) {
    console.error("Stripe subscription error:", error);
    throw new Error(`Error creating subscription: ${error.message}`);
  }
}

/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans() {
  try {
    // In a real app, you would fetch this from Stripe's API
    // For now, we'll return mock data that matches the frontend
    return [
      {
        id: "basic",
        name: "Basic",
        priceMonthly: 9.99,
        priceYearly: 95.9, // 20% discount on yearly
        features: [
          "Personalized travel recommendations",
          "Limited destination guides",
          "Basic itinerary planning",
          "Email support"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        priceMonthly: 19.99,
        priceYearly: 191.9, // 20% discount on yearly
        features: [
          "All Basic features",
          "Unlimited destination guides",
          "Advanced AI itinerary planning",
          "Priority customer support",
          "Exclusive deals and discounts",
          "Ad-free experience"
        ],
        popular: true
      },
      {
        id: "family",
        name: "Family",
        priceMonthly: 29.99,
        priceYearly: 287.9, // 20% discount on yearly
        features: [
          "All Premium features",
          "Up to 5 family members",
          "Group itinerary planning",
          "Family discounts",
          "Dedicated travel concierge",
          "24/7 premium support"
        ]
      }
    ];
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    throw new Error(`Error fetching subscription plans: ${error.message}`);
  }
}

/**
 * Helper function to map plan IDs to Stripe price IDs
 * In a real app, this would be fetched from a database
 */
function getPriceId(planId: string, interval: "month" | "year"): string {
  // Use environment variables if available
  if (process.env[`STRIPE_PRICE_${planId.toUpperCase()}_${interval.toUpperCase()}`]) {
    return process.env[`STRIPE_PRICE_${planId.toUpperCase()}_${interval.toUpperCase()}`] as string;
  }
  
  // Otherwise return the default price ID
  return DEFAULT_PRICE_ID;
}
