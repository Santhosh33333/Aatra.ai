import type { NextApiRequest, NextApiResponse } from 'next';

const RAZORPAY_API_URL = 'https://api.razorpay.com/v1/';
const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

interface PaymentRequest {
  planId: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  description: string;
  purpose: string;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, unknown> | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, email, phone, amount, currency, description, purpose } = req.body as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('[v0] Razorpay: Creating payment order:', { planId, email, phone, amount });

    // Demo mode - no credentials
    if (!KEY_ID || !KEY_SECRET) {
      console.log('[v0] Razorpay: Demo mode - returning test order');
      
      const demoOrderId = `order_demo_${Date.now()}`;
      const demoPaymentUrl = `https://checkout.razorpay.com/demo?order_id=${demoOrderId}&amount=${amount}&email=${email}&phone=${phone}`;

      return res.status(200).json({
        success: true,
        mode: 'demo',
        order_id: demoOrderId,
        payment_url: demoPaymentUrl,
        key_id: 'rzp_test_demo',
        amount: amount,
        email: email,
        message: 'Demo order created. Configure Razorpay credentials for production.',
      });
    }

    // Production mode - create order with Razorpay API
    const orderData = {
      amount: amount, // In paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      description: purpose || description || `Astra AI ${planId}`,
      customer_notify: 1,
      notes: {
        planId,
        email,
        phone,
      },
    };

    // Razorpay API uses Basic Auth
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    const response = await fetch(`${RAZORPAY_API_URL}orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[v0] Razorpay API error:', data);
      return res.status(response.status).json({
        error: 'Failed to create order',
        details: data,
      });
    }

    console.log('[v0] Razorpay: Order created:', (data as Record<string, unknown>).id);

    return res.status(200).json({
      success: true,
      mode: 'production',
      order_id: (data as Record<string, unknown>).id,
      key_id: KEY_ID,
      amount: (data as Record<string, unknown>).amount,
      email: email,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('[v0] Razorpay error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
