# Astra AI - Quick Start Guide

## Live App
**URL**: https://aatra-ai.vercel.app

## Admin Account
- **Email**: santhoshkrishna958@gmail.com
- **Password**: Use your secure admin password from your deployment environment.
- **Dashboard**: https://aatra-ai.vercel.app/admin

## Getting Paid from Users

### Step 1: Create Stripe Account (5 minutes)
1. Go to https://dashboard.stripe.com/register
2. Sign up with your email: santhoshkrishna958@gmail.com
3. Verify email
4. Complete account setup

### Step 2: Get Your Keys (3 minutes)
1. In Stripe Dashboard, go to Settings → API Keys
2. Copy your **Publishable Key** (starts with `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_live_`)
4. Save these safely - you'll need them

### Step 3: Configure Live Mode (5 minutes)
1. Go to: https://vercel.com/dashboard
2. Select your Aatra.ai project
3. Go to Settings → Environment Variables
4. Add these 3 variables:
   ```
   STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY_HERE
   STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_HERE
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```
5. Redeploy (Vercel does this automatically when you add vars)

### Step 4: Create Products in Stripe (5 minutes)
In Stripe Dashboard → Products, create:

**Product 1: Pro Monthly**
- Price: $9.00/month
- Billing: Monthly recurring
- Price ID: `price_pro_monthly`

**Product 2: Ultra Monthly**
- Price: $19.00/month
- Billing: Monthly recurring
- Price ID: `price_ultra_monthly`

**Product 3: Pro Annual**
- Price: $79.00/year
- Billing: Annual recurring
- Price ID: `price_pro_annual`

**Product 4: Ultra Annual**
- Price: $159.00/year
- Billing: Annual recurring
- Price ID: `price_ultra_annual`

### Step 5: Set Up Webhooks (3 minutes)
1. Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://aatra-ai.vercel.app/api/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the Webhook Signing Secret
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 6: Test It (5 minutes)
1. Go to https://aatra-ai.vercel.app
2. Click "Pricing"
3. Select "Pro" plan
4. Click "Proceed to Payment"
5. Use test card: `4242 4242 4242 4242`
6. Fill in any expiry and CVC
7. Complete payment
8. Check Stripe Dashboard for the transaction

### Step 7: Go Live
1. In Stripe, switch from Test Mode to Live Mode
2. All payments now go to your bank account
3. Users can subscribe to your plans
4. You receive payments directly

## Payment Amounts

Users can upgrade to these plans:

| Plan | Price | Billing |
|------|-------|---------|
| Mini | Free | N/A |
| Pro | $9/month | Monthly or $79/year |
| Ultra | $19/month | Monthly or $159/year |

**You receive**: Full amount (Stripe takes 2.9% + $0.30 processing fee)

## Where Payments Go

All payments for santhoshkrishna958@gmail.com → Stripe account → Your bank account

Check Stripe Dashboard to:
- View all transactions
- See customer details
- Manage subscriptions
- Process payouts to your bank
- Download reports

## Support

- **User Issues**: Contact page in app (https://aatra-ai.vercel.app/contact)
- **Payment Issues**: Stripe Support: https://support.stripe.com/
- **Technical Help**: GitHub: https://github.com/Santhosh33333/Aatra.ai
- **Admin Email**: santhoshkrishna958@gmail.com

## Features for Users

✓ Free Mini plan (20 messages/day)
✓ Pro plan ($9/month or $79/year) - Unlimited messages
✓ Ultra plan ($19/month or $159/year) - API access
✓ Sign in with Google
✓ Dashboard to manage account
✓ Contact support anytime
✓ Mobile app (PWA)

## Features for You (Admin)

✓ Admin panel at `/admin`
✓ View user activity
✓ Manage subscriptions
✓ Set pricing (configurable)
✓ Contact users
✓ Analytics (coming soon)

## Next Steps

1. ✓ Set up Stripe account (now)
2. ✓ Get live API keys
3. ✓ Configure environment variables
4. ✓ Test payment flow
5. ✓ Go live!

Done! Users can now subscribe and pay. You get paid automatically.

---

**Questions?** Check DEPLOYMENT_SUMMARY.md or STRIPE_SETUP_GUIDE.md for detailed instructions.
