// Multi-Gateway Payment Library
// Supports: Instamojo, Razorpay, PayU, Mock

export type GatewayType = 'instamojo' | 'razorpay' | 'payu' | 'mock';

export interface GatewayConfig {
  id: GatewayType;
  name: string;
  description: string;
  logo: string;
  paymentMethods: string[];
  fee: string;
  isLive: boolean;
  supportEmail: string;
}

export const GATEWAYS: Record<GatewayType, GatewayConfig> = {
  instamojo: {
    id: 'instamojo',
    name: 'Instamojo',
    description: 'Completely FREE payment gateway with 0% UPI fee',
    logo: 'https://instamojo.com/logo.png',
    paymentMethods: ['UPI', 'Cards', 'NetBanking', 'Wallets'],
    fee: '2.9% (0% for UPI)',
    isLive: false,
    supportEmail: 'support@instamojo.com',
  },
  razorpay: {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Premium payment gateway with advanced features',
    logo: 'https://razorpay.com/logo.png',
    paymentMethods: ['UPI', 'Cards', 'NetBanking', 'Wallets', 'EMI'],
    fee: '2% + ₹0',
    isLive: false,
    supportEmail: 'support@razorpay.com',
  },
  payu: {
    id: 'payu',
    name: 'PayU',
    description: 'Largest payment gateway in India',
    logo: 'https://payu.in/logo.png',
    paymentMethods: ['UPI', 'Cards', 'NetBanking', 'Wallets', 'EMI'],
    fee: '2% + ₹0',
    isLive: false,
    supportEmail: 'support@payu.in',
  },
  mock: {
    id: 'mock',
    name: 'Mock Gateway',
    description: 'Test gateway for development (no real payments)',
    logo: '',
    paymentMethods: ['Test Card'],
    fee: 'Free',
    isLive: true,
    supportEmail: 'test@example.com',
  },
};

export interface PaymentRequest {
  gateway: GatewayType;
  planId: string;
  email: string;
  phone: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  gateway: GatewayType;
  mode: 'demo' | 'production' | 'mock';
  payment_url?: string;
  order_id?: string;
  transaction_id?: string;
  amount: number;
  email: string;
  error?: string;
}

// Create payment with selected gateway
export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const { gateway, planId, email, phone, amount, currency = 'INR', description } = request;

    console.log('[v0] Creating payment with gateway:', gateway);

    let endpoint = '';
    switch (gateway) {
      case 'instamojo':
        endpoint = '/api/instamojo/create-payment';
        break;
      case 'razorpay':
        endpoint = '/api/razorpay/create-order';
        break;
      case 'payu':
        endpoint = '/api/payu/create-payment';
        break;
      case 'mock':
        endpoint = '/api/mock/create-payment';
        break;
      default:
        throw new Error('Unknown gateway');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        email,
        phone,
        amount,
        currency,
        description: description || `Astra AI ${planId}`,
        purpose: `Astra AI ${planId}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment creation failed');
    }

    const data = await response.json();

    return {
      success: true,
      gateway,
      mode: (data as Record<string, unknown>).mode as 'demo' | 'production' | 'mock',
      payment_url: (data as Record<string, unknown>).payment_url as string,
      order_id: (data as Record<string, unknown>).order_id as string,
      transaction_id: (data as Record<string, unknown>).transaction_id as string,
      amount,
      email,
    };
  } catch (error) {
    console.error('[v0] Payment creation error:', error);
    return {
      success: false,
      gateway: request.gateway,
      mode: 'demo',
      amount: request.amount,
      email: request.email,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    };
  }
}

// Verify payment with selected gateway
export async function verifyPayment(
  gateway: GatewayType,
  paymentData: Record<string, unknown>
): Promise<Record<string, unknown>> {
  try {
    let endpoint = '';
    switch (gateway) {
      case 'instamojo':
        endpoint = '/api/instamojo/verify-payment';
        break;
      case 'razorpay':
        endpoint = '/api/razorpay/verify-payment';
        break;
      case 'payu':
        endpoint = '/api/payu/verify-payment';
        break;
      case 'mock':
        endpoint = '/api/mock/verify-payment';
        break;
      default:
        throw new Error('Unknown gateway');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    throw error;
  }
}

// Get available gateways
export function getAvailableGateways(): GatewayConfig[] {
  return Object.values(GATEWAYS);
}

// Get gateway config
export function getGatewayConfig(gateway: GatewayType): GatewayConfig {
  const config = GATEWAYS[gateway];
  if (!config) {
    throw new Error(`Unknown gateway: ${gateway}`);
  }
  return config;
}
