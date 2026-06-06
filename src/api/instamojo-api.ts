// Instamojo Backend API Routes
// These would normally be in Vercel serverless functions (api/instamojo/*.ts)

export async function createPaymentRequest(data: {
  planId: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  description: string;
  purpose: string;
}) {
  try {
    console.log('[v0] Creating Instamojo payment request:', {
      amount: data.amount,
      email: data.email,
      phone: data.phone,
    });

    // In production, this would call your backend API
    // For now, return a demo payment URL
    const demoPaymentUrl = `https://www.instamojo.com/demo/pay?amount=${data.amount / 100}&email=${data.email}&phone=${data.phone}`;

    return {
      success: true,
      payment_url: demoPaymentUrl,
      request_id: `req_${Date.now()}`,
      amount: data.amount,
      email: data.email,
    };
  } catch (error) {
    console.error('[v0] Payment request error:', error);
    throw error;
  }
}

export async function verifyPayment(data: { paymentId: string }) {
  try {
    console.log('[v0] Verifying payment:', data.paymentId);

    // In production, this would verify with Instamojo API
    return {
      success: true,
      status: 'completed',
      payment_id: data.paymentId,
    };
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    throw error;
  }
}
