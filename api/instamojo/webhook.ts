import type { NextApiRequest, NextApiResponse } from 'next';

interface WebhookPayload {
  payment_id: string;
  status: string;
  amount: string;
  buyer_email: string;
  buyer_phone: string;
  custom_fields?: Record<string, unknown>;
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const payload = req.body as WebhookPayload;

    console.log('[v0] Webhook received:', {
      paymentId: payload.payment_id,
      status: payload.status,
      email: payload.buyer_email,
    });

    // Process payment status
    switch (payload.status) {
      case 'completed':
        // Payment successful - activate subscription
        console.log('[v0] Payment completed:', payload.payment_id);
        
        // TODO: Update database with subscription
        // - Create/update subscription record
        // - Activate user's plan
        // - Send confirmation email
        
        // For now, just log
        console.log('[v0] Subscription activated for:', payload.buyer_email);
        break;

      case 'pending':
        console.log('[v0] Payment pending:', payload.payment_id);
        // TODO: Send pending notification email
        break;

      case 'failed':
        console.log('[v0] Payment failed:', payload.payment_id);
        // TODO: Send payment failure notification
        break;

      case 'bounced':
        console.log('[v0] Payment bounced:', payload.payment_id);
        // TODO: Handle bounced payment
        break;

      default:
        console.log('[v0] Unknown payment status:', payload.status);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({
      success: true,
      message: 'Webhook processed',
      payment_id: payload.payment_id,
    });
  } catch (error) {
    console.error('[v0] Webhook error:', error);
    
    // Still return 200 to prevent Instamojo retries on error
    return res.status(200).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
