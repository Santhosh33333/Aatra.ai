const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/';
const CLIENT_ID = process.env.VITE_INSTAMOJO_CLIENT_ID || process.env.INSTAMOJO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.VITE_INSTAMOJO_CLIENT_SECRET || process.env.INSTAMOJO_CLIENT_SECRET || '';

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

type PaymentResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: PaymentResponse) {
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

function getSiteOrigin() {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  return (vercelUrl || process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { planId, email, phone, amount, purpose } = (await readJson(req)) as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return jsonResponse(400, {
        error: 'Missing required fields',
        required: ['email', 'phone', 'amount', 'planId'],
      });
    }

    console.log('[v0] Creating Instamojo payment request:', { planId, email, phone, amount });

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.log('[v0] Demo mode: Instamojo credentials not configured');

      return jsonResponse(200, {
        success: true,
        mode: 'demo',
        payment_url: `https://www.instamojo.com/demo/pay?amount=${amount / 100}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&plan=${encodeURIComponent(planId)}`,
        request_id: `req_demo_${Date.now()}`,
        amount,
        email,
        message: 'Demo payment URL generated. Configure Instamojo credentials for production.',
      });
    }

    const payload = new URLSearchParams();
    payload.append('purpose', purpose || `Astra AI ${planId}`);
    payload.append('amount', (amount / 100).toString());
    payload.append('buyer_name', email.split('@')[0]);
    payload.append('email', email);
    payload.append('phone', phone);
    payload.append('redirect_url', `${getSiteOrigin()}/checkout-success`);
    payload.append('webhook', `${getSiteOrigin()}/api/instamojo/webhook`);

    const response = await fetch(`${INSTAMOJO_API_URL}payment-requests/`, {
      method: 'POST',
      headers: {
        'X-Api-Key': CLIENT_ID,
        'X-Auth-Token': CLIENT_SECRET,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
      console.error('[v0] Instamojo API error:', data);
      return jsonError(response.status, 'Failed to create payment request', data);
    }

    const paymentRequest = (data.payment_request || {}) as Record<string, unknown>;

    console.log('[v0] Payment request created successfully:', paymentRequest.id);

    return jsonResponse(200, {
      success: true,
      mode: 'production',
      payment_url: paymentRequest.longurl || paymentRequest.shorturl,
      request_id: paymentRequest.id,
      amount: paymentRequest.amount,
      email: paymentRequest.email,
    });
  } catch (error) {
    console.error('[v0] Error creating payment:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
