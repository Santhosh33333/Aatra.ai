import type { NextApiRequest, NextApiResponse } from 'next';

interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

interface ErrorResponse {
  error: string;
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
    const { orderId, paymentId, signature } = req.body as VerifyPaymentRequest;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('[v0] Razorpay: Verifying payment:', paymentId);

    // In production, verify signature with Razorpay secret
    // For now, accept all signatures in demo mode
    const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
    
    if (!KEY_SECRET) {
      // Demo mode
      console.log('[v0] Razorpay: Demo mode - accepting payment');
      return res.status(200).json({
        success: true,
        mode: 'demo',
        status: 'verified',
        payment_id: paymentId,
        order_id: orderId,
      });
    }

    // Production: Verify with HMAC SHA256
    const crypto = require('crypto');
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === signature) {
      console.log('[v0] Razorpay: Payment verified successfully');
      return res.status(200).json({
        success: true,
        mode: 'production',
        status: 'verified',
        payment_id: paymentId,
        order_id: orderId,
      });
    } else {
      console.error('[v0] Razorpay: Signature mismatch');
      return res.status(400).json({
        error: 'Payment verification failed',
        message: 'Signature mismatch',
      });
    }
  } catch (error) {
    console.error('[v0] Razorpay verification error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
