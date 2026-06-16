import { createHash } from 'node:crypto';

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

type PayuResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: PayuResponse) {
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
    const { planId, email, phone, amount } = (await readJson(req)) as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return jsonResponse(400, { error: 'Missing required fields' });
    }

    console.log('[v0] PayU: Creating payment request:', { planId, email, phone, amount });

    const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
    const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';

    if (!MERCHANT_KEY || !MERCHANT_SALT) {
      console.log('[v0] PayU: Demo mode - returning test payment URL');

      const txnId = `txn_demo_${Date.now()}`;
      const demoPaymentUrl = `https://secure.payu.in/demo/payment?txnid=${txnId}&amount=${amount / 100}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&productinfo=${encodeURIComponent(planId)}`;

      return jsonResponse(200, {
        success: true,
        mode: 'demo',
        txn_id: txnId,
        payment_url: demoPaymentUrl,
        amount,
        email,
        message: 'Demo payment URL created. Configure PayU credentials for production.',
      });
    }

    const txnId = `txn_${Date.now()}`;
    const productInfo = `Astra AI ${planId}`;
    const hashString = `${MERCHANT_KEY}|${txnId}|${amount / 100}|${productInfo}|${email}|${phone}|||||||||||${MERCHANT_SALT}`;
    const hash = createHash('sha512').update(hashString).digest('hex');

    const params = new URLSearchParams();
    params.append('key', MERCHANT_KEY);
    params.append('txnid', txnId);
    params.append('amount', (amount / 100).toString());
    params.append('productinfo', productInfo);
    params.append('firstname', email.split('@')[0]);
    params.append('email', email);
    params.append('phone', phone);
    params.append('surl', `${getSiteOrigin()}/api/payu/success`);
    params.append('furl', `${getSiteOrigin()}/api/payu/failure`);
    params.append('hash', hash);

    const paymentUrl = `https://secure.payu.in/_payment?${params.toString()}`;

    console.log('[v0] PayU: Payment URL generated');

    return jsonResponse(200, {
      success: true,
      mode: 'production',
      txn_id: txnId,
      payment_url: paymentUrl,
      amount,
      email,
      message: 'Payment URL created successfully',
    });
  } catch (error) {
    console.error('[v0] PayU error:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
