# Astra AI - API Endpoints Documentation

## Backend API Endpoints for Instamojo Payment Processing

All endpoints are serverless functions deployed on Vercel.

### Base URL
```
https://aatra-ai.vercel.app/api/instamojo
```

---

## 1. Create Payment Request

### Endpoint
```
POST /api/instamojo/create-payment
```

### Description
Creates a payment request with Instamojo and returns a payment URL for the user to complete payment.

### Request Body
```json
{
  "planId": "pro_monthly",
  "email": "user@example.com",
  "phone": "9876543210",
  "amount": 90000,
  "currency": "INR",
  "description": "Unlimited messages + Advanced AI",
  "purpose": "Astra AI Pro Monthly"
}
```

### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| planId | string | Yes | Plan identifier (pro_monthly, ultra_monthly, pro_annual, ultra_annual) |
| email | string | Yes | Customer email address |
| phone | string | Yes | Customer phone number (10-digit Indian mobile) |
| amount | number | Yes | Amount in paise (multiply INR by 100) |
| currency | string | Yes | Currency code (INR) |
| description | string | Yes | Payment description |
| purpose | string | Yes | Payment purpose for invoice |

### Response - Success (200)
```json
{
  "success": true,
  "mode": "production",
  "payment_url": "https://www.instamojo.com/pay/[payment_id]/",
  "request_id": "req_12345",
  "amount": "900",
  "email": "user@example.com"
}
```

### Response - Demo Mode (No Credentials)
```json
{
  "success": true,
  "mode": "demo",
  "payment_url": "https://www.instamojo.com/demo/pay?amount=900&email=user@example.com&phone=9876543210&plan=pro_monthly",
  "request_id": "req_demo_1686382800000",
  "amount": 900,
  "email": "user@example.com",
  "message": "Demo payment URL generated. Configure Instamojo credentials for production."
}
```

### Response - Error (400, 500)
```json
{
  "error": "Missing required fields",
  "required": ["email", "phone", "amount", "planId"]
}
```

### cURL Example
```bash
curl -X POST https://aatra-ai.vercel.app/api/instamojo/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "pro_monthly",
    "email": "user@example.com",
    "phone": "9876543210",
    "amount": 90000,
    "currency": "INR",
    "description": "Unlimited messages + Advanced AI",
    "purpose": "Astra AI Pro Monthly"
  }'
```

---

## 2. Verify Payment

### Endpoint
```
POST /api/instamojo/verify-payment
```

### Description
Verifies the status of a payment with Instamojo.

### Request Body
```json
{
  "paymentId": "payment_12345"
}
```

### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| paymentId | string | Yes | Instamojo payment ID to verify |

### Response - Success (200)
```json
{
  "success": true,
  "mode": "production",
  "status": "completed",
  "payment_id": "payment_12345",
  "amount": "900",
  "email": "user@example.com"
}
```

### Response - Demo Mode
```json
{
  "success": true,
  "mode": "demo",
  "status": "completed",
  "payment_id": "payment_demo_12345",
  "message": "Payment verified in demo mode"
}
```

### Payment Status Values
- `completed` - Payment successful
- `pending` - Payment pending (user hasn't completed)
- `failed` - Payment failed
- `bounced` - Payment bounced

### cURL Example
```bash
curl -X POST https://aatra-ai.vercel.app/api/instamojo/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "payment_12345"
  }'
```

---

## 3. Payment Webhook

### Endpoint
```
POST /api/instamojo/webhook
```

### Description
Webhook endpoint for Instamojo to notify about payment status changes. This is called automatically by Instamojo, not manually.

### Webhook Registration
1. Go to Instamojo Dashboard → Settings → Webhooks
2. Add webhook endpoint: `https://aatra-ai.vercel.app/api/instamojo/webhook`
3. Select events to listen for

### Instamojo Webhook Payload
```json
{
  "payment_id": "payment_12345",
  "status": "completed",
  "amount": "900",
  "buyer_email": "user@example.com",
  "buyer_phone": "9876543210",
  "custom_fields": {
    "plan": "pro_monthly"
  }
}
```

### Webhook Response
```json
{
  "success": true,
  "message": "Webhook processed",
  "payment_id": "payment_12345"
}
```

### Webhook Events Handled
- `completed` - Subscription activated
- `pending` - Payment under verification
- `failed` - Send failure notification
- `bounced` - Handle bounced payment

---

## Configuration

### Environment Variables
Set these in Vercel project settings:

```
VITE_INSTAMOJO_CLIENT_ID=your_instamojo_key_id
VITE_INSTAMOJO_CLIENT_SECRET=your_instamojo_secret
VITE_ADMIN_EMAIL=santhoshkrishna958@gmail.com
VERCEL_URL=https://aatra-ai.vercel.app
```

### Demo Mode
If credentials are not set, the API returns demo URLs for testing.

---

## Payment Flow

```
1. User enters email and phone on checkout page
2. Frontend calls POST /api/instamojo/create-payment
3. Backend creates payment request with Instamojo
4. Returns payment_url to frontend
5. User redirected to Instamojo Checkout
6. User completes payment
7. Instamojo sends webhook to /api/instamojo/webhook
8. Backend updates subscription in database
9. User's plan is activated
```

---

## Amount Conversion

Instamojo API uses paise (₹ / 100):
- 1 INR = 100 paise
- ₹900 = 90000 paise
- ₹1,900 = 190000 paise

Frontend sends paise values to backend.

---

## Error Handling

### Missing Required Fields (400)
```json
{
  "error": "Missing required fields",
  "required": ["email", "phone", "amount", "planId"]
}
```

### Instamojo API Error (varies)
```json
{
  "error": "Failed to create payment request",
  "details": {
    "status_code": 400,
    "message": "Invalid email"
  }
}
```

### Server Error (500)
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## Testing

### Test Payment
1. Go to checkout: https://aatra-ai.vercel.app/checkout?plan=pro
2. Enter email: test@example.com
3. Enter phone: 9876543210
4. Click "Proceed to Payment"
5. Redirected to Instamojo payment page

### Test Cards (Instamojo Demo)
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- Any future expiry and CVC

---

## Production Setup

### Step 1: Configure Instamojo Credentials
1. Create account at https://www.instamojo.com/
2. Get API keys from dashboard
3. Add to Vercel environment variables

### Step 2: Set Up Webhook
1. Dashboard → Settings → Webhooks
2. Add: `https://aatra-ai.vercel.app/api/instamojo/webhook`
3. Select events to listen

### Step 3: Test End-to-End
1. Create test payment
2. Verify webhook receipt
3. Confirm subscription in database

### Step 4: Go Live
- Switch Instamojo from test to live mode
- Update environment variables with live credentials
- Redeploy to Vercel

---

## Deployment

The API endpoints are automatically deployed to Vercel when code is pushed:

```bash
git push origin file-full
vercel --prod
```

Current deployment: https://aatra-ai.vercel.app

---

## Support

- **Instamojo API**: https://www.instamojo.com/api/1.1/
- **Instamojo Docs**: https://www.instamojo.com/api/docs/
- **Admin Email**: santhoshkrishna958@gmail.com
