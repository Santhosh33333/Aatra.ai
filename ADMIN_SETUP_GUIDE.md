# Astra AI - Multi-Gateway Payment System
## Admin Step-by-Step Setup Guide

---

## Overview

Your Astra AI payment system supports **4 payment gateways**:

1. **Instamojo** - FREE gateway (0% UPI fee) ✓ Ready
2. **Razorpay** - Premium gateway (2% fee)
3. **PayU** - Enterprise gateway (2% fee)
4. **Mock Gateway** - Testing gateway ✓ Ready

---

## Part 1: Live Website & Checkout Page

### Step 1: Access the Checkout Page

**Live URL**: https://aatra-ai.vercel.app/checkout?plan=pro

**What you'll see:**
```
Left Side (Plan Details):
- Pro Plan features list
- Monthly price: ₹900
- You save: ₹900/month
- Special Offers section

Right Side (Order Summary):
- Payment Gateway Selector (4 buttons)
  ✓ Instamojo (selected by default)
  ○ Razorpay
  ○ PayU
  ○ Mock Gateway
  
- Email input field
- Phone input field
- Total: ₹900
- "Proceed to Payment" button
```

### Step 2: Test With Mock Gateway

**To test payment flow WITHOUT real money:**

1. Go to: https://aatra-ai.vercel.app/checkout?plan=pro
2. Click **"Mock Gateway"** button
3. Fill in email: test@example.com
4. Fill in phone: 9876543210
5. Click **"Proceed to Payment"**
6. Mock payment will be simulated
7. Status will show "Test payment initiated"

This is perfect for testing the checkout UI and flow!

---

## Part 2: Gateway Setup (Choose One or More)

### Setup Order (Recommended)

**Priority 1**: Configure Instamojo (Already FREE and ready)
**Priority 2**: Configure Razorpay (Most popular)
**Priority 3**: Configure PayU (Largest network)

---

## INSTAMOJO SETUP (Already Included)

### Status: ✓ Free & Ready

### What You Get:
- **0% fee for UPI payments** (most common in India)
- 2.9% fee for card payments
- Instant payouts to your bank
- No setup fees, no monthly charges
- Supports: UPI, Cards, NetBanking, Wallets

### How to Activate:

**Step 1: Create Account (2 minutes)**
1. Go to: https://www.instamojo.com/
2. Click "Sign Up"
3. Email: santhoshkrishna958@gmail.com
4. Phone: Your phone number
5. Verify email

**Step 2: Complete KYC (5 minutes)**
1. Go to dashboard: https://www.instamojo.com/dashboard/
2. Settings → Account
3. Fill business details
4. Choose "Business" account type
5. Save

**Step 3: Get API Credentials (2 minutes)**
1. Dashboard → Settings → API & Webhooks
2. Copy: **Client ID**
3. Copy: **Client Secret**

**Step 4: Add to Vercel (5 minutes)**
1. Go to: https://vercel.com/dashboard
2. Select: "aatra-ai" project
3. Click: Settings → Environment Variables
4. Add new variables:
   ```
   Name: VITE_INSTAMOJO_CLIENT_ID
   Value: [Your Client ID from Step 3]
   
   Name: VITE_INSTAMOJO_CLIENT_SECRET
   Value: [Your Client Secret from Step 3]
   ```
5. Click: Save
6. Vercel will auto-redeploy

**Step 5: Set Webhook (2 minutes)**
1. Instamojo dashboard → Settings → Webhooks
2. Add URL: https://aatra-ai.vercel.app/api/instamojo/webhook
3. Select events: Payment completed, failed, bounced
4. Save

**Step 6: Test It! (1 minute)**
1. Go to: https://aatra-ai.vercel.app/checkout?plan=pro
2. Select: "Instamojo"
3. Enter email and phone
4. Click: "Proceed to Payment"
5. Instamojo checkout opens
6. Use test card: 4111 1111 1111 1111
7. Expiry: 12/25, CVV: 123
8. Complete test payment

**✓ You're receiving real payments!**

---

## RAZORPAY SETUP

### Status: Available (Needs API Keys)

### What You Get:
- 2% + ₹0 transaction fee
- Advanced features & analytics
- Supports: UPI, Cards, NetBanking, Wallets, EMI
- India's #2 payment gateway

### How to Activate:

**Step 1: Create Account (3 minutes)**
1. Go to: https://razorpay.com/
2. Click "Sign Up"
3. Choose: "Business Account"
4. Email: santhoshkrishna958@gmail.com
5. Verify email

**Step 2: Complete KYC (10 minutes)**
1. Dashboard: https://dashboard.razorpay.com
2. Go to: Settings → Account
3. Fill business details
4. Upload document (Aadhaar or PAN)
5. Phone verification
6. Submit

**Step 3: Link Bank Account (5 minutes)**
1. Settings → Payouts
2. Add Bank Account
3. Enter account number & IFSC
4. Razorpay sends 2 small deposits
5. Verify with amounts
6. Payouts activated

**Step 4: Get API Keys (1 minute)**
1. Settings → API Keys
2. Copy: **Key ID**
3. Copy: **Key Secret**

**Step 5: Add to Vercel (5 minutes)**
1. Vercel Dashboard → aatra-ai project
2. Settings → Environment Variables
3. Add variables:
   ```
   Name: RAZORPAY_KEY_ID
   Value: [Your Key ID]
   
   Name: RAZORPAY_KEY_SECRET
   Value: [Your Key Secret]
   ```
4. Save (auto-redeploy)

**Step 6: Test It!**
1. https://aatra-ai.vercel.app/checkout?plan=pro
2. Click: "Razorpay"
3. Enter email & phone
4. Click: "Proceed to Payment"
5. Razorpay checkout opens
6. Test card: 4111 1111 1111 1111
7. Complete payment

---

## PAYU SETUP

### Status: Available (Needs API Keys)

### What You Get:
- 2% + ₹0 transaction fee
- Largest payment gateway in India
- Supports: UPI, Cards, NetBanking, Wallets, EMI
- Best support network

### How to Activate:

**Step 1: Create Account (5 minutes)**
1. Go to: https://www.payu.in/merchant-account
2. Sign Up
3. Email: santhoshkrishna958@gmail.com
4. Phone verification

**Step 2: Complete KYC (15 minutes)**
1. Upload business documents
2. Verify phone & email
3. Wait for approval (usually instant)

**Step 3: Link Bank Account (5 minutes)**
1. Account Settings → Bank Details
2. Add your bank account
3. Complete verification

**Step 4: Get API Keys (2 minutes)**
1. Account Settings → API Details
2. Copy: **Merchant Key**
3. Copy: **Merchant Salt**

**Step 5: Add to Vercel (5 minutes)**
1. Vercel Dashboard → aatra-ai
2. Settings → Environment Variables
3. Add variables:
   ```
   Name: PAYU_MERCHANT_KEY
   Value: [Your Merchant Key]
   
   Name: PAYU_MERCHANT_SALT
   Value: [Your Merchant Salt]
   ```
4. Save

**Step 6: Test It!**
1. https://aatra-ai.vercel.app/checkout?plan=pro
2. Click: "PayU"
3. Enter email & phone
4. Click: "Proceed to Payment"
5. PayU checkout opens
6. Complete test payment

---

## Part 3: Monitoring & Testing

### View All 4 Gateways

Admin Page: https://aatra-ai.vercel.app/admin-gateways

(Shows setup status, documentation, and quick test buttons for each gateway)

### Test Each Gateway

**Mock Gateway** (Always works):
- No setup needed
- Use for UI testing
- Shows "Test payment" status

**Instamojo** (After Step-by-step above):
- Real payments
- 0% UPI fee
- Daily payouts

**Razorpay** (After setup above):
- Real payments
- 2% fee
- Advanced dashboard

**PayU** (After setup above):
- Real payments
- 2% fee
- Largest network

---

## Part 4: Payment Flow Explanation

### What Happens When User Pays

```
1. User selects plan (Pro: ₹900)
2. Chooses payment gateway (Instamojo/Razorpay/PayU/Mock)
3. Enters email & phone
4. Clicks "Proceed to Payment"
   ↓
5. Backend API called: /api/[gateway]/create-payment
6. Payment request created with gateway
7. User redirected to gateway checkout page
   ↓
8. User completes payment (enters card/UPI)
9. Gateway processes payment
   ↓
10. Webhook received: /api/[gateway]/webhook
11. Subscription activated
12. Confirmation email sent
    ↓
13. Money transferred to your bank (next business day)
```

---

## Part 5: Revenue Breakdown

### Example: 100 users subscribe to Pro (₹900/month)

**Total Revenue**: ₹90,000/month

**Instamojo** (If UPI payment):
- Your fee: 2.9%
- You receive: ₹87,390/month

**Razorpay** (Card payment):
- Your fee: 2%
- You receive: ₹88,200/month

**PayU** (Card payment):
- Your fee: 2%
- You receive: ₹88,200/month

### Settlement Timeline

All gateways: **Daily payouts to your linked bank account**
- Processing time: T+1 (next business day)
- No minimum payout amount
- Automatic every day

---

## Part 6: Troubleshooting

### Payment Gateway Not Working

**Check:**
1. Environment variables added to Vercel?
   - Go to Settings → Environment Variables
   - Verify API keys are correct
   - No extra spaces or typos

2. API keys valid?
   - Test with gateway's documentation
   - Verify credentials in gateway dashboard

3. Webhook configured?
   - Each gateway needs webhook URL
   - URL format: https://aatra-ai.vercel.app/api/[gateway]/webhook

### Payment Showing "Demo Mode"

**Reason**: API credentials not configured

**Solution**:
1. Add credentials to Vercel environment variables
2. Redeploy: `vercel --prod`
3. Try payment again

### Payment Received but Subscription Not Activated

**Reason**: Webhook not configured or not processing

**Solution**:
1. Check gateway dashboard → Webhooks
2. Verify webhook URL is exactly: 
   - https://aatra-ai.vercel.app/api/[gateway]/webhook
3. Check payment status in gateway dashboard

---

## Part 7: Support Resources

### Instamojo
- Support: https://support.instamojo.com/
- Phone: 1800-258-6288 (Toll-free)
- Email: support@instamojo.com

### Razorpay
- Support: https://razorpay.com/support/
- Phone: +91-22-4141-1500
- Email: support@razorpay.com

### PayU
- Support: https://www.payu.in/support
- Phone: 1860-500-7500
- Email: support@payu.in

### Your Admin
- Email: santhoshkrishna958@gmail.com
- Website: https://aatra-ai.vercel.app
- Dashboard: https://vercel.com/dashboard

---

## Summary: 3 Steps to Get Paid

### Minimum Setup (15 minutes)
1. Create Instamojo account (Free)
2. Get API credentials
3. Add to Vercel environment variables
4. Users can now pay you money!

### Recommended Setup (1 hour)
1. Setup Instamojo (Free, 0% UPI fee)
2. Setup Razorpay (For card payments)
3. Setup PayU (Backup option)
4. Test all three
5. Monitor payments

### Full Production (2 hours)
1. Setup all 3 real gateways
2. Configure webhooks
3. Test with real test cards
4. Monitor first payments
5. Celebrate your first revenue! 🎉

---

## Next Steps

1. **Today**: Setup Instamojo (Free, takes 15 minutes)
2. **This Week**: Setup Razorpay (Most popular)
3. **Next Week**: Setup PayU (Enterprise ready)
4. **Monitor**: Track payments in gateway dashboards
5. **Scale**: Receive daily payouts to your bank

**You're now ready to receive real payments from users!**

All payments go directly to your bank account: santhoshkrishna958@gmail.com
