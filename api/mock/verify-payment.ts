import type { NextApiRequest, NextApiResponse } from 'next';

interface VerifyPaymentRequest {
  transactionId: string;
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
    const { transactionId } = req.body as VerifyPaymentRequest;

    if (!transactionId) {
      return res.status(400).json({ error: 'Missing transactionId' });
    }

    console.log('[v0] Mock Gateway: Verifying payment:', transactionId);

    // Simulate payment verification
    const isSuccessful = !transactionId.includes('fail');
    const status = isSuccessful ? 'completed' : 'failed';

    console.log('[v0] Mock Gateway: Payment verified:', { transactionId, status });

    return res.status(200).json({
      success: isSuccessful,
      mode: 'mock',
      gateway: 'mock',
      transaction_id: transactionId,
      status: status,
      amount: 900,
      email: 'test@mock.com',
      message: `Mock payment ${status}`,
    });
  } catch (error) {
    console.error('[v0] Mock Gateway verification error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
