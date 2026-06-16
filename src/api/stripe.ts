export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdefghijk',
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'santhoshkrishna958@gmail.com',
};

export const STRIPE_PRODUCTS = {
  pro_monthly: {
    productId: 'prod_pro_monthly',
    priceId: 'price_pro_monthly',
    name: 'Pro Monthly',
    amount: 900,
    currency: 'usd',
  },
  ultra_monthly: {
    productId: 'prod_ultra_monthly',
    priceId: 'price_ultra_monthly',
    name: 'Ultra Monthly',
    amount: 1900,
    currency: 'usd',
  },
  pro_annual: {
    productId: 'prod_pro_annual',
    priceId: 'price_pro_annual',
    name: 'Pro Annual',
    amount: 7900,
    currency: 'usd',
  },
  ultra_annual: {
    productId: 'prod_ultra_annual',
    priceId: 'price_ultra_annual',
    name: 'Ultra Annual',
    amount: 15900,
    currency: 'usd',
  },
};

export async function createCheckoutSession() {
  throw new Error('Stripe checkout requires a backend route and is disabled until implemented.');
}

export interface StripeWebhookEvent {
  type: string
  data: { object: Record<string, unknown> }
}

export async function handlePaymentWebhook(event: StripeWebhookEvent) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('[v0] Payment succeeded:', event.data.object);
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
