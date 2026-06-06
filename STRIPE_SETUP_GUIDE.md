# Stripe Payment Integration Setup Guide

## Overview
This guide sets up Stripe payment processing for Astra AI. Payments will be received directly to your Stripe account (santhoshkrishna958@gmail.com).

## Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with email: santhoshkrishna958@gmail.com
3. Verify your email and complete account setup
4. In Dashboard, go to Settings → API Keys
5. Copy your keys:
   - **Publishable Key** (starts with pk_)
   - **Secret Key** (starts with sk_) - Keep this private!

## Step 2: Update Environment Variables

Update `.env.local` in your project:

```
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
VITE_ADMIN_EMAIL=santhoshkrishna958@gmail.com
```

## Step 3: Create Products and Prices in Stripe

In Stripe Dashboard → Products:

**Product 1: Pro Monthly**
- Price: $9.00/month
- Billing: Monthly recurring
- Price ID: price_pro_monthly

**Product 2: Ultra Monthly**
- Price: $19.00/month
- Billing: Monthly recurring
- Price ID: price_ultra_monthly

**Product 3: Pro Annual**
- Price: $79.00/year
- Billing: Annual recurring
- Price ID: price_pro_annual

**Product 4: Ultra Annual**
- Price: $159.00/year
- Billing: Annual recurring
- Price ID: price_ultra_annual

## Step 4: Set Up Webhooks

In Stripe Dashboard → Webhooks:

1. Click "Add endpoint"
2. URL: `https://aatra-ai.vercel.app/api/webhook`
3. Events to listen:
   - payment_intent.succeeded
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copy Webhook Secret (starts with whsec_)
5. Add to `.env.local`:
   ```
   VITE_STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

## Step 5: Backend API Routes

Create these Vercel serverless functions:

### `/api/checkout` (POST)
Handles checkout session creation:
```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { priceId, email, returnUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: returnUrl + '?status=success',
      cancel_url: returnUrl + '?status=cancelled',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### `/api/webhook` (POST)
Handles Stripe webhooks:
```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const body = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Update user subscription in database
        break;
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object);
        // Create subscription record
        break;
      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        // Update subscription record
        break;
      case 'customer.subscription.deleted':
        console.log('Subscription cancelled:', event.data.object);
        // Cancel subscription in database
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

## Step 6: Update Frontend

The checkout page already integrates with Stripe:
1. User clicks "Proceed to Payment"
2. Session is created via `/api/checkout`
3. Redirect to Stripe Checkout
4. After payment, user returns to success page
5. Subscription stored in database

## Payment Flow

```
User Clicks "Upgrade to Pro"
        ↓
Pricing → Checkout Page (/checkout?plan=pro)
        ↓
User Reviews Plan & Offers
        ↓
Clicks "Proceed to Payment"
        ↓
API: /api/checkout → Creates Stripe Session
        ↓
Redirects to Stripe Checkout
        ↓
User Enters Card Details
        ↓
Payment Processed
        ↓
Stripe Webhook: payment_intent.succeeded
        ↓
Backend: Update User Subscription
        ↓
Redirect to Success Page
        ↓
User Gets Access to Pro Features
```

## Receiving Payments

All payments go directly to: **santhoshkrishna958@gmail.com**

In Stripe Dashboard, you can:
- View all transactions
- Check payout schedule
- Download payment reports
- Set up automatic payouts to your bank

## Testing

### Test Cards (Stripe Dashboard in Test Mode)
- Success: 4242 4242 4242 4242
- Failed: 4000 0000 0000 0002
- Expiry: Any future date
- CVC: Any 3 digits

### Test Flow
1. Go to http://localhost:5173/checkout?plan=pro
2. Click "Proceed to Payment"
3. Use test card 4242 4242 4242 4242
4. Complete payment
5. Check Stripe Dashboard for transaction

## Security Notes

- Keep SECRET_KEY private (backend only)
- Use LIVE keys in production
- Enable 3D Secure for fraud prevention
- Set up SCA (Strong Customer Authentication)
- Monitor chargeback rate
- Use webhook signature verification

## Support

For Stripe support: https://support.stripe.com/
For Astra AI support: santhoshkrishna958@gmail.com
