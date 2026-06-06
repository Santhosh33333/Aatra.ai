// Instamojo - Free Payment Gateway for India
// Completely free with no setup fees - only commission on successful payments

export const INSTAMOJO_CONFIG = {
  // Instamojo API credentials (get from https://www.instamojo.com/developers/)
  clientId: import.meta.env.VITE_INSTAMOJO_CLIENT_ID || 'test_client_id',
  clientSecret: import.meta.env.VITE_INSTAMOJO_CLIENT_SECRET,
  apiUrl: 'https://www.instamojo.com/api/1.1/',
  
  // Admin email (where payment notifications go)
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'santhoshkrishna958@gmail.com',
  
  // Currency for India
  currency: 'INR',
};

// Payment amounts in INR
export const INSTAMOJO_PLANS = {
  pro_monthly: {
    name: 'Pro Monthly',
    amount: 900, // ₹900
    currency: 'INR',
    description: 'Unlimited messages + Advanced AI',
  },
  ultra_monthly: {
    name: 'Ultra Monthly',
    amount: 1900, // ₹1,900
    currency: 'INR',
    description: 'Everything in Pro + API access',
  },
  pro_annual: {
    name: 'Pro Annual',
    amount: 790, // ₹790
    currency: 'INR',
    description: 'Annual subscription - Save 27%',
  },
  ultra_annual: {
    name: 'Ultra Annual',
    amount: 1590, // ₹1,590
    currency: 'INR',
    description: 'Annual subscription - Save 30%',
  },
};

// Function to create payment request
export async function createInstamojPayment(planId: string, email: string, phone: string) {
  try {
    const plan = INSTAMOJO_PLANS[planId as keyof typeof INSTAMOJO_PLANS];
    if (!plan) throw new Error('Invalid plan');

    console.log('[v0] Creating Instamojo payment for:', planId);

    // Demo implementation - generates a payment link
    // In production with backend API, this would call /api/instamojo/create-payment
    const demoPaymentUrl = `https://www.instamojo.com/demo/pay?amount=${plan.amount}&email=${encodeURIComponent(email)}&phone=${phone}&plan=${planId}`;

    const data = {
      success: true,
      payment_url: demoPaymentUrl,
      request_id: `req_${Date.now()}`,
      amount: plan.amount,
      email: email,
    };

    console.log('[v0] Payment request created:', data.payment_url);
    return data;
  } catch (error) {
    console.error('[v0] Instamojo payment error:', error);
    throw error;
  }
}

// Function to verify payment
export async function verifyInstamojoPayment(paymentId: string) {
  try {
    const response = await fetch('/api/instamojo/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) throw new Error('Payment verification failed');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    throw error;
  }
}
