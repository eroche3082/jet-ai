// Stripe session creation and management
import { apiRequest } from '@/lib/queryClient';

interface CreateSessionParams {
  accessCode: string;
  levelToUnlock: string;
  returnUrl?: string;
}

interface StripeSessionResponse {
  id: string;
  url: string;
}

/**
 * Creates a Stripe checkout session for level unlocking
 */
export async function createCheckoutSession(params: CreateSessionParams): Promise<StripeSessionResponse> {
  const { accessCode, levelToUnlock, returnUrl } = params;
  
  // Determine prices based on level
  const priceId = getPriceIdForLevel(levelToUnlock);
  
  try {
    const response = await apiRequest('POST', '/api/payments/create-checkout-session', {
      accessCode,
      levelToUnlock,
      priceId,
      returnUrl: returnUrl || window.location.origin
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
}

/**
 * Helper function to map level names to price IDs
 */
function getPriceIdForLevel(level: string): string {
  // This would be configured with actual price IDs from Stripe dashboard
  const priceMappings: Record<string, string> = {
    'Level 4': 'price_1ODNMgEvEaIYEfm1lOBGK1p9', // Basic level
    'Level 5': 'price_1ODNMgEvEaIYEfm1lOBGK2p0', // Advanced level
    'Level 6': 'price_1ODNMgEvEaIYEfm1lOBGK3p1', // Premium level
  };
  
  return priceMappings[level] || priceMappings['Level 4']; // Default to Level 4 pricing
}

/**
 * Verifies payment status from session ID
 */
export async function verifyPaymentStatus(sessionId: string): Promise<{success: boolean, level?: string}> {
  try {
    const response = await apiRequest('GET', `/api/payments/verify-session?session_id=${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false };
  }
}

/**
 * Process success or cancellation from Stripe redirect
 */
export async function handleStripeRedirect(): Promise<{success: boolean, level?: string, accessCode?: string}> {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const accessCode = urlParams.get('code');
  
  if (!sessionId || !accessCode) {
    return { success: false };
  }
  
  try {
    const result = await verifyPaymentStatus(sessionId);
    return {
      ...result,
      accessCode
    };
  } catch (error) {
    console.error('Error handling stripe redirect:', error);
    return { success: false };
  }
}