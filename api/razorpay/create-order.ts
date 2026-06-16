import { Buffer } from 'node:buffer';

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

type RazorpayResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: RazorpayResponse) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function jsonError(status: number, error: string, details?: unknown) {
  return jsonResponse(status, details ? { error, details } : { error });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { planId, email, phone, amount, currency, description, purpose } = (await readJson(req)) as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return jsonResponse(400, { error: 'Missing required fields' });
    }

    console.log('[v0] Razorpay: Creating payment order:', { planId, email, phone, amount });

    if (!KEY_ID || !KEY_SECRET) {
      console.log('[v0] Razorpay: Demo mode - returning test order');

      const demoOrderId = `order_demo_${Date.now()}`;
      const demoPaymentUrl = `https://checkout.razorpay.com/demo?order_id=${demoOrderId}&amount=${amount}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

      return jsonResponse(200, {
        success: true,
        mode: 'demo',
        order_id: demoOrderId,
        payment_url: demoPaymentUrl,
        key_id: 'rzp_test_demo',
        amount,
        email,
        message: 'Demo order created. Configure Razorpay credentials for production.',
      });
    }

    const orderData = {
      amount,
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      description: purpose || description || `Astra AI ${planId}`,
      customer_notify: 1,
      notes: { planId, email, phone },
    };

    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    const response = await fetch(`${RAZORPAY_API_URL}orders`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
      console.error('[v0] Razorpay API error:', data);
      return jsonError(response.status, 'Failed to create order', data);
    }

    console.log('[v0] Razorpay: Order created:', data.id);

    return jsonResponse(200, {
      success: true,
      mode: 'production',
      order_id: data.id,
      key_id: KEY_ID,
      amount: data.amount,
      email,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('[v0] Razorpay error:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
