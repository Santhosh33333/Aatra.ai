const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/';
const CLIENT_ID = process.env.VITE_INSTAMOJO_CLIENT_ID || process.env.INSTAMOJO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.VITE_INSTAMOJO_CLIENT_SECRET || process.env.INSTAMOJO_CLIENT_SECRET || '';

interface VerifyPaymentRequest {
  paymentId: string;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
  message?: string;
}

type VerifyResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: VerifyResponse) {
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
    const { paymentId } = (await readJson(req)) as VerifyPaymentRequest;

    if (!paymentId) {
      return jsonResponse(400, { error: 'Missing paymentId' });
    }

    console.log('[v0] Verifying payment:', paymentId);

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.log('[v0] Demo mode: Returning success for payment verification');
      return jsonResponse(200, {
        success: true,
        mode: 'demo',
        status: 'completed',
        payment_id: paymentId,
        message: 'Payment verified in demo mode',
      });
    }

    const response = await fetch(`${INSTAMOJO_API_URL}payments/${paymentId}/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': CLIENT_ID,
        'X-Auth-Token': CLIENT_SECRET,
      },
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
      console.error('[v0] Instamojo verification error:', data);
      return jsonError(response.status, 'Payment verification failed', data);
    }

    const payment = (data.payment || {}) as Record<string, unknown>;

    console.log('[v0] Payment verified:', {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
    });

    return jsonResponse(200, {
      success: true,
      mode: 'production',
      status: payment.status,
      payment_id: payment.id,
      amount: payment.amount,
      email: payment.buyer_email,
    });
  } catch (error) {
    console.error('[v0] Error verifying payment:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
