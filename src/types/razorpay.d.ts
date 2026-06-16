declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export interface RazorpayResponse {
  razorpay_payment_id?: string
  razorpay_order_id?: string
  razorpay_signature?: string
  [key: string]: unknown
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
}
