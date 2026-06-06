import type { NextApiRequest, NextApiResponse } from 'next';

// Instamojo API Configuration
const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/';
const CLIENT_ID = process.env.VITE_INSTAMOJO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.VITE_INSTAMOJO_CLIENT_SECRET || '';

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
  required?: string[];
  details?: unknown;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, unknown> | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, email, phone, amount, currency, description, purpose } = req.body as PaymentRequest;

    // Validate required fields
    if (!email || !phone || !amount || !planId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'phone', 'amount', 'planId'],
      });
    }

    console.log('[v0] Creating Instamojo payment request:', {
      planId,
      email,
      phone,
      amount,
    });

    // In development/test mode, return demo URL
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.log('[v0] Demo mode: Instamojo credentials not configured');
      
      const demoPaymentUrl = `https://www.instamojo.com/demo/pay?amount=${amount}&email=${encodeURIComponent(
        email
      )}&phone=${phone}&plan=${planId}`;

      return res.status(200).json({
        success: true,
        mode: 'demo',
        payment_url: demoPaymentUrl,
        request_id: `req_demo_${Date.now()}`,
        amount,
        email,
        message: 'Demo payment URL generated. Configure Instamojo credentials for production.',
      });
    }

    // Production: Create payment request with Instamojo API
    const payload = new URLSearchParams();
    payload.append('purpose', purpose || `Astra AI ${planId}`);
    payload.append('amount', (amount / 100).toString()); // Convert paise to rupees
    payload.append('buyer_name', email.split('@')[0]); // Extract name from email
    payload.append('email', email);
    payload.append('phone', phone);
    payload.append('redirect_url', `${process.env.VERCEL_URL || 'https://aatra-ai.vercel.app'}/checkout-success`);
    payload.append('webhook', `${process.env.VERCEL_URL || 'https://aatra-ai.vercel.app'}/api/instamojo/webhook`);

    const response = await fetch(`${INSTAMOJO_API_URL}payment-requests/`, {
      method: 'POST',
      headers: {
        'X-Api-Key': CLIENT_ID,
        'X-Auth-Token': CLIENT_SECRET,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[v0] Instamojo API error:', data);
      return res.status(response.status).json({
        error: 'Failed to create payment request',
        details: data,
      });
    }

    console.log('[v0] Payment request created successfully:', (data as Record<string, unknown>).payment_request?.id);

    return res.status(200).json({
      success: true,
      mode: 'production',
      payment_url: (data as Record<string, Record<string, unknown>>).payment_request?.longurl || (data as Record<string, Record<string, unknown>>).payment_request?.shorturl,
      request_id: (data as Record<string, Record<string, unknown>>).payment_request?.id,
      amount: (data as Record<string, Record<string, unknown>>).payment_request?.amount,
      email: (data as Record<string, Record<string, unknown>>).payment_request?.email,
    });
  } catch (error) {
    console.error('[v0] Error creating payment:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

