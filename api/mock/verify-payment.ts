interface VerifyPaymentRequest {
  transactionId: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

type MockResponse = Record<string, unknown> | ErrorResponse;

function jsonResponse(status: number, body: MockResponse) {
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
    const { transactionId } = (await readJson(req)) as VerifyPaymentRequest;

    if (!transactionId) {
      return jsonResponse(400, { error: 'Missing transactionId' });
    }

    console.log('[v0] Mock Gateway: Verifying payment:', transactionId);

    const isSuccessful = !transactionId.includes('fail');
    const status = isSuccessful ? 'completed' : 'failed';

    console.log('[v0] Mock Gateway: Payment verified:', { transactionId, status });

    return jsonResponse(200, {
      success: isSuccessful,
      mode: 'mock',
      gateway: 'mock',
      transaction_id: transactionId,
      status,
      amount: 900,
      email: 'test@mock.com',
      message: `Mock payment ${status}`,
    });
  } catch (error) {
    console.error('[v0] Mock Gateway verification error:', error);
    return jsonError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error');
  }
}
