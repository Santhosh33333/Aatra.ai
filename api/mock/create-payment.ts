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
  message?: string;
}

type MockResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: MockResponse) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function jsonError(status: number, error: string, message?: string) {
  return jsonResponse(status, message ? { error, message } : { error });
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
    const { planId, email, phone, amount } = (await readJson(req)) as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return jsonResponse(400, { error: 'Missing required fields' });
    }

    console.log('[v0] Mock Gateway: Processing payment:', { planId, email, phone, amount });

    const transactionId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const mockPaymentUrl = `${getSiteOrigin()}/payment/mock?txid=${transactionId}&amount=${amount}&email=${encodeURIComponent(email)}&plan=${encodeURIComponent(planId)}`;

    console.log('[v0] Mock Gateway: Payment simulated:', transactionId);

    return jsonResponse(200, {
      success: true,
      mode: 'mock',
      gateway: 'mock',
      transaction_id: transactionId,
      payment_url: mockPaymentUrl,
      amount,
      email,
      status: 'pending',
      message: 'Mock payment initiated. This is for testing only.',
      test_card: '4111 1111 1111 1111',
      test_expiry: '12/25',
      test_cvv: '123',
    });
  } catch (error) {
    console.error('[v0] Mock Gateway error:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
