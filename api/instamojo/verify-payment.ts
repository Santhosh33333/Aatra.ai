import { VercelRequest, VercelResponse } from '@vercel/node';

const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/';
const CLIENT_ID = process.env.VITE_INSTAMOJO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.VITE_INSTAMOJO_CLIENT_SECRET || '';

interface VerifyPaymentRequest {
  paymentId: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId } = req.body as VerifyPaymentRequest;

    if (!paymentId) {
      return res.status(400).json({
        error: 'Missing paymentId',
      });
    }

    console.log('[v0] Verifying payment:', paymentId);

    // In demo mode, return success
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.log('[v0] Demo mode: Returning success for payment verification');
      return res.status(200).json({
        success: true,
        mode: 'demo',
        status: 'completed',
        payment_id: paymentId,
        message: 'Payment verified in demo mode',
      });
    }

    // Production: Verify with Instamojo API
    const response = await fetch(`${INSTAMOJO_API_URL}payments/${paymentId}/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': CLIENT_ID,
        'X-Auth-Token': CLIENT_SECRET,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[v0] Instamojo verification error:', data);
      return res.status(response.status).json({
        error: 'Payment verification failed',
        details: data,
      });
    }

    console.log('[v0] Payment verified:', {
      id: data.payment?.id,
      status: data.payment?.status,
      amount: data.payment?.amount,
    });

    return res.status(200).json({
      success: true,
      mode: 'production',
      status: data.payment?.status,
      payment_id: data.payment?.id,
      amount: data.payment?.amount,
      email: data.payment?.buyer_email,
    });
  } catch (error) {
    console.error('[v0] Error verifying payment:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
