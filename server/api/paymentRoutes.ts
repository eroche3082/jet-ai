import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

/**
 * Create a Stripe checkout session for level unlocking
 * POST /api/payments/create-checkout-session
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { accessCode, levelToUnlock, priceId, returnUrl } = req.body;
    
    if (!accessCode || !levelToUnlock || !priceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }
    
    const successUrl = `${returnUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&code=${accessCode}&success=true`;
    const cancelUrl = `${returnUrl}/dashboard?code=${accessCode}&canceled=true`;
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        accessCode,
        levelToUnlock
      }
    });
    
    res.json({
      id: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create checkout session' 
    });
  }
});

/**
 * Verify a checkout session status
 * GET /api/payments/verify-session
 */
router.get('/verify-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }
    
    // Retrieve session
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    
    // Check payment status
    if (session.payment_status === 'paid') {
      // In a real application, you would update your database here
      // For example, mark the level as unlocked for this access code
      
      return res.json({
        success: true,
        level: session.metadata?.levelToUnlock
      });
    } else {
      return res.json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify checkout session' 
    });
  }
});

/**
 * Handle Stripe webhook events
 * POST /api/payments/webhook
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Fulfill the purchase
      if (session.payment_status === 'paid') {
        const accessCode = session.metadata?.accessCode;
        const levelToUnlock = session.metadata?.levelToUnlock;
        
        if (accessCode && levelToUnlock) {
          // In a real application, update your database to unlock this level
          console.log(`Payment completed for ${accessCode} to unlock ${levelToUnlock}`);
          
          // You would call a function like:
          // await unlockLevel(accessCode, levelToUnlock, session.payment_intent as string);
        }
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.send();
});

export default router;