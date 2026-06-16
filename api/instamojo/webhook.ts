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

function jsonResponse(status: number, body: WebhookResponse) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
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
    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  }

  try {
    const payload = (await readJson(req)) as WebhookPayload;

    console.log('[v0] Webhook received:', {
      paymentId: payload.payment_id,
      status: payload.status,
      email: payload.buyer_email,
    });

    switch (payload.status) {
      case 'completed':
        console.log('[v0] Payment completed:', payload.payment_id);
        console.log('[v0] Subscription activated for:', payload.buyer_email);
        break;
      case 'pending':
        console.log('[v0] Payment pending:', payload.payment_id);
        break;
      case 'failed':
        console.log('[v0] Payment failed:', payload.payment_id);
        break;
      case 'bounced':
        console.log('[v0] Payment bounced:', payload.payment_id);
        break;
      default:
        console.log('[v0] Unknown payment status:', payload.status);
    }

    return jsonResponse(200, {
      success: true,
      message: 'Webhook processed',
      payment_id: payload.payment_id,
    });
  } catch (error) {
    console.error('[v0] Webhook error:', error);

    return jsonResponse(200, {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
