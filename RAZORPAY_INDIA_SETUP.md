# Razorpay Payment Integration for India

## Overview
Razorpay is India's leading payment gateway. All payments will be received in your bank account in INR (Indian Rupees).

## Step 1: Create Razorpay Account

1. Go to https://razorpay.com/
2. Click "Sign Up"
3. Enter your details (use: santhoshkrishna958@gmail.com)
4. Complete KYC verification:
   - Upload Aadhaar or PAN
   - Verify email and phone
   - Business details (if applicable)
5. Bank account linking:
   - Add your bank account for payouts
   - Razorpay will verify with 2 small deposits

## Step 2: Get API Keys

1. Log in to Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to Settings → API Keys
3. Copy your keys:
   - **Key ID** (Publishable Key - starts with `rzp_live_`)
   - **Key Secret** (Private Key - keep this safe!)

## Step 3: Update Environment Variables

In your `.env.local` file:

```
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
VITE_RAZORPAY_KEY_SECRET=rzp_live_YOUR_SECRET_KEY_HERE
VITE_ADMIN_EMAIL=santhoshkrishna958@gmail.com
```

## Step 4: Payment Plans in INR

Your users see these prices:

| Plan | Price | Billing |
|------|-------|---------|
| Mini | Free | N/A |
| Pro | ₹900/month | Monthly or ₹790/year |
| Ultra | ₹1,900/month | Monthly or ₹1,590/year |

**In paise (Razorpay uses paise):**
- Pro Monthly: 90000 paise (₹900)
- Ultra Monthly: 190000 paise (₹1,900)
- Pro Annual: 79000 paise (₹790)
- Ultra Annual: 159000 paise (₹1,590)

## Step 5: Testing Razorpay

### Test Mode
1. In Razorpay Dashboard, switch to **Test Mode**
2. Go to https://aatra-ai.vercel.app/checkout?plan=pro
3. Click "Proceed to Payment"
4. Use test card: **4111 1111 1111 1111**
5. Enter any future expiry and CVC
6. Complete payment
7. Check Razorpay Dashboard for the test transaction

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failed**: 4000 0000 0000 0002
- **3D Secure**: 4000 0200 0000 0000

## Step 6: Go Live

1. In Razorpay Dashboard, switch to **Live Mode**
2. Verify your bank account (if not already done)
3. Users can now make real payments
4. Payments go directly to your bank account

## How Users Pay

1. User clicks "Proceed to Payment"
2. Razorpay Checkout opens
3. User can pay with:
   - Credit/Debit Card (Visa, Mastercard, AmEx)
   - UPI (Google Pay, PhonePe, Paytm, BHIM)
   - NetBanking
   - Wallet
   - EMI options
4. Payment processed securely
5. Subscription activated immediately

## Payment Settlement

**Razorpay fees:**
- Credit/Debit Card: 2% + ₹0 (for plans)
- UPI: 0% + ₹0 (Zero fee for business payments)
- NetBanking: 0% (Zero fee)

**Example:**
- User pays ₹900
- Razorpay fee (2%): ₹18
- You receive: ₹882

**Settlement:** 
- Payouts every day to your linked bank account
- Processing time: T+1 (next business day)

## Webhooks (Optional)

For automatic subscription updates:

1. Razorpay Dashboard → Settings → Webhooks
2. Add endpoint: `https://aatra-ai.vercel.app/api/razorpay/webhook`
3. Events to subscribe:
   - payment.authorized
   - payment.failed
   - subscription.activated
   - subscription.cancelled

## Support

- **Razorpay Support**: https://support.razorpay.com/
- **Razorpay Docs**: https://razorpay.com/docs/
- **India Payment Methods**: https://razorpay.com/payment-methods/
- **Your Admin Email**: santhoshkrishna958@gmail.com

## Advantages of Razorpay

✓ Made for India - Supports Indian payment methods
✓ UPI payments (0% fee) - Most popular in India
✓ Instant payouts to bank account
✓ Multiple payment options
✓ 24/7 customer support
✓ Easy KYC process
✓ Dashboard analytics
✓ Subscription management

## Receiving Payments

All payments go directly to your bank account linked in Razorpay:

1. Razorpay Dashboard → Accounts & Payouts
2. View settlement history
3. Check payouts to your bank
4. Download statements for accounting

## Next Steps

1. Create Razorpay account at https://razorpay.com/
2. Complete KYC verification
3. Link your bank account
4. Get API keys from dashboard
5. Add keys to .env.local
6. Test with test card
7. Switch to Live Mode
8. Users can now pay!

Total setup time: ~30 minutes

---

**All your payments in Indian Rupees (₹) go directly to santhoshkrishna958@gmail.com**
