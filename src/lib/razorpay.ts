// Razorpay Payment Integration for India
// Razorpay is India's leading payment gateway

export const RAZORPAY_CONFIG = {
  // Razorpay API Key (from your dashboard)
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890abcde',
  
  // Razorpay Key Secret (backend only)
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
  
  // Admin email (where payments notifications go)
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'santhoshkrishna958@gmail.com',
  
  // Currency for India
  currency: 'INR',
};

// Payment amounts in INR
export const RAZORPAY_PLANS = {
  pro_monthly: {
    name: 'Pro Monthly',
    amount: 90000, // ₹900 in paise (1 INR = 100 paise)
    currency: 'INR',
    description: 'Unlimited messages + Advanced AI',
  },
  ultra_monthly: {
    name: 'Ultra Monthly',
    amount: 190000, // ₹1,900 in paise
    currency: 'INR',
    description: 'Everything in Pro + API access',
  },
  pro_annual: {
    name: 'Pro Annual',
    amount: 79000, // ₹790 in paise
    currency: 'INR',
    description: 'Annual subscription - Save 27%',
  },
  ultra_annual: {
    name: 'Ultra Annual',
    amount: 159000, // ₹1,590 in paise
    currency: 'INR',
    description: 'Annual subscription - Save 30%',
  },
};

// Function to create Razorpay order
export async function createRazorpayOrder(planId: string, email: string) {
  try {
    const plan = RAZORPAY_PLANS[planId as keyof typeof RAZORPAY_PLANS];
    if (!plan) throw new Error('Invalid plan');

    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        email,
        amount: plan.amount,
        currency: plan.currency,
        description: plan.description,
      }),
    });

    if (!response.ok) throw new Error('Failed to create order');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[v0] Razorpay order error:', error);
    throw error;
  }
}

// Function to verify payment
export async function verifyPayment(orderId: string, paymentId: string, signature: string) {
  try {
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    if (!response.ok) throw new Error('Payment verification failed');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    throw error;
  }
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('[v0] Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('[v0] Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
