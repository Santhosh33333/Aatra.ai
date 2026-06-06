import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';

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
    const { planId, email, phone, amount } = req.body as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('[v0] PayU: Creating payment request:', { planId, email, phone, amount });

    const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
    const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';

    // Demo mode - no credentials
    if (!MERCHANT_KEY || !MERCHANT_SALT) {
      console.log('[v0] PayU: Demo mode - returning test payment URL');
      
      const txnId = `txn_demo_${Date.now()}`;
      const demoPaymentUrl = `https://secure.payu.in/demo/payment?txnid=${txnId}&amount=${amount / 100}&email=${email}&phone=${phone}&productinfo=${planId}`;

      return res.status(200).json({
        success: true,
        mode: 'demo',
        txn_id: txnId,
        payment_url: demoPaymentUrl,
        amount: amount,
        email: email,
        message: 'Demo payment URL created. Configure PayU credentials for production.',
      });
    }

    // Production mode - create payment with PayU
    const txnId = `txn_${Date.now()}`;
    const productInfo = `Astra AI ${planId}`;

    // Generate hash for PayU
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
    params.append('surl', `${process.env.VERCEL_URL || 'https://aatra-ai.vercel.app'}/api/payu/success`);
    params.append('furl', `${process.env.VERCEL_URL || 'https://aatra-ai.vercel.app'}/api/payu/failure`);
    params.append('hash', hash);

    const paymentUrl = `https://secure.payu.in/_payment?${params.toString()}`;

    console.log('[v0] PayU: Payment URL generated');

    return res.status(200).json({
      success: true,
      mode: 'production',
      txn_id: txnId,
      payment_url: paymentUrl,
      amount: amount,
      email: email,
      message: 'Payment URL created successfully',
    });
  } catch (error) {
    console.error('[v0] PayU error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
