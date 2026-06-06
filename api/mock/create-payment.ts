import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, unknown> | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, email, phone, amount, currency, description, purpose } = req.body as PaymentRequest;

    if (!email || !phone || !amount || !planId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('[v0] Mock Gateway: Processing payment:', { planId, email, phone, amount });

    // Generate a unique transaction ID
    const transactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment processing
    const mockPaymentUrl = `https://aatra-ai.vercel.app/payment/mock?txid=${transactionId}&amount=${amount}&email=${email}&plan=${planId}`;

    console.log('[v0] Mock Gateway: Payment simulated:', transactionId);

    return res.status(200).json({
      success: true,
      mode: 'mock',
      gateway: 'mock',
      transaction_id: transactionId,
      payment_url: mockPaymentUrl,
      amount: amount,
      email: email,
      status: 'pending',
      message: 'Mock payment initiated. This is for testing only.',
      test_card: '4111 1111 1111 1111',
      test_expiry: '12/25',
      test_cvv: '123',
    });
  } catch (error) {
    console.error('[v0] Mock Gateway error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
