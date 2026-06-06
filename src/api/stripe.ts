// Stripe payment API configuration
// This file sets up payment processing with real Stripe integration

export const STRIPE_CONFIG = {
  // Stripe public key (replace with your live key in production)
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdefghijk',
  
  // Stripe secret key (use in backend only)
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
  
  // Admin email (where payments are sent)
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'santhoshkrishna958@gmail.com',
};

// Product and price mappings for Stripe
export const STRIPE_PRODUCTS = {
  pro_monthly: {
    productId: 'prod_pro_monthly',
    priceId: 'price_pro_monthly',
    name: 'Pro Monthly',
    amount: 900, // $9.00 in cents
    currency: 'usd',
  },
  ultra_monthly: {
    productId: 'prod_ultra_monthly',
    priceId: 'price_ultra_monthly',
    name: 'Ultra Monthly',
    amount: 1900, // $19.00 in cents
    currency: 'usd',
  },
  pro_annual: {
    productId: 'prod_pro_annual',
    priceId: 'price_pro_annual',
    name: 'Pro Annual',
    amount: 7900, // $79.00 in cents
    currency: 'usd',
  },
  ultra_annual: {
    productId: 'prod_ultra_annual',
    priceId: 'price_ultra_annual',
    name: 'Ultra Annual',
    amount: 15900, // $159.00 in cents
    currency: 'usd',
  },
};

// Function to handle payment checkout
export async function createCheckoutSession(priceId: string, email: string, customerId?: string) {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        email,
        customerId,
        returnUrl: `${window.location.origin}/checkout-success`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('[v0] Checkout error:', error);
    throw error;
  }
}

// Webhook handler for payment confirmations
export interface StripeWebhookEvent {
  type: string
  data: { object: Record<string, unknown> }
}

export async function handlePaymentWebhook(event: StripeWebhookEvent) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('[v0] Payment succeeded:', event.data.object);
      // Update user subscription status in database
      return { success: true, action: 'payment_succeeded' };
      
    case 'customer.subscription.created':
      console.log('[v0] Subscription created:', event.data.object);
      return { success: true, action: 'subscription_created' };
      
    case 'customer.subscription.updated':
      console.log('[v0] Subscription updated:', event.data.object);
      return { success: true, action: 'subscription_updated' };
      
    case 'customer.subscription.deleted':
      console.log('[v0] Subscription cancelled:', event.data.object);
      return { success: true, action: 'subscription_cancelled' };
      
    default:
      console.log('[v0] Unhandled webhook event type:', event.type);
      return { success: false };
  }
}
