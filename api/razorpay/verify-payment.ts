import { createHmac, timingSafeEqual } from 'node:crypto';

interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

type RazorpayResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: RazorpayResponse) {
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { orderId, paymentId, signature } = (await readJson(req)) as VerifyPaymentRequest;

    if (!orderId || !paymentId || !signature) {
      return jsonResponse(400, { error: 'Missing required fields' });
    }

    console.log('[v0] Razorpay: Verifying payment:', paymentId);

    const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

    if (!KEY_SECRET) {
      console.log('[v0] Razorpay: Demo mode - accepting payment');
      return jsonResponse(200, {
        success: true,
        mode: 'demo',
        status: 'verified',
        payment_id: paymentId,
        order_id: orderId,
      });
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = createHmac('sha256', KEY_SECRET).update(body).digest('hex');

    if (timingSafeEqualHex(expectedSignature, signature)) {
      console.log('[v0] Razorpay: Payment verified successfully');
      return jsonResponse(200, {
        success: true,
        mode: 'production',
        status: 'verified',
        payment_id: paymentId,
        order_id: orderId,
      });
    }

    console.error('[v0] Razorpay: Signature mismatch');
    return jsonError(400, 'Payment verification failed', 'Signature mismatch');
  } catch (error) {
    console.error('[v0] Razorpay verification error:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
