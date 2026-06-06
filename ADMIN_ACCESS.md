# Admin Page Access Guide

## Admin Pages Available

### 1. Admin Panel
**URL:** `/admin`
**Direct Link:** https://www.yuvers.in/admin
**Purpose:** Main administration control center

**Features:**
- General settings configuration
- API & Keys management
- AI Models management
- Theme customization
- Contact form settings
- Logo upload (drag & drop)

**Access:** Email + Password authentication required

---

### 2. Payment Gateways
**URL:** `/admin-gateways`
**Direct Link:** https://www.yuvers.in/admin-gateways
**Purpose:** Payment gateway configuration

**Features:**
- Configure payment methods
- Manage payment integrations
- Set gateway preferences

---

## How to Access Admin Pages

### From Dashboard
1. Log in to your account
2. Go to Dashboard (`/dashboard`)
3. In the **left sidebar**, scroll down past the main navigation
4. Under **Admin** section, you'll see two links:
   - **Admin Panel** (with Lock icon)
   - **Payment Gateways** (with Zap icon)
5. Click either link to access

### Direct URLs
- Admin Panel: `https://www.yuvers.in/admin`
- Payment Gateways: `https://www.yuvers.in/admin-gateways`

---

## Admin Panel Login

**Login Screen:**
- Email field: Enter admin email
- Password field: Enter admin password
- Access Panel button: Click to authenticate

**Credentials:**
Ask your system administrator for login credentials.

**After Login:**
You'll see 5 tabs:
1. **General** - Site settings
2. **API & Keys** - API configuration
3. **Models** - AI model management
4. **Theme** - Appearance settings
5. **Contact** - Contact form settings

---

## Navigation Features

### Dashboard Sidebar Navigation

**Main Section:**
- Chat
- Usage
- Profile
- Settings

**Admin Section (New):**
- Admin Panel
- Payment Gateways

Each admin link includes:
- Descriptive icon (Lock for admin, Zap for payments)
- Hover animation showing chevron arrow
- Click to navigate to respective admin page

---

## Admin Panel Features

### General Tab
- Site name and description
- Daily free tier usage limit
- Default settings

### API & Keys Tab
- API key management
- Secret keys
- Integration credentials

### Models Tab
- Add new AI models
- Configure model tiers (Free, Pro, Ultra)
- Set model descriptions
- Remove models

### Theme Tab
- Upload custom logo
- Set brand colors
- Customize appearance
- Logo preview

### Contact Tab
- Manage contact form
- Email settings
- Message templates

---

## Save and Logout

**Save Changes:**
- Click "Save Changes" button in header
- Button shows "Saved!" when successful
- Settings persist in localStorage

**Logout:**
- Click "Logout" button in header
- Returns to login screen
- Clears admin session

---

## Deployed Status

✅ **Live at:** https://www.yuvers.in
✅ **Admin Panel:** https://www.yuvers.in/admin
✅ **Payment Gateways:** https://www.yuvers.in/admin-gateways
✅ **Dashboard Navigation:** Updated with admin links

---

## Technical Details

### Routes
- `/admin` - Admin Panel (requires authentication)
- `/admin-gateways` - Payment Gateways (requires authentication)

### Authentication
- Email/Password based
- Verified via adminConfig
- Session stored in component state

### Storage
- Settings: localStorage (`adminSettings`)
- Logo: localStorage (`admin_logo`)
- Automatic persistence on save

### Logging
- Login attempts logged
- Settings changes logged
- Errors logged with details
- Logo upload/remove tracked

---

## Troubleshooting

**Can't find admin links:**
- Make sure you're logged in
- View should show sidebar on desktop
- Check that Dashboard page loads properly

**Admin login fails:**
- Verify email/password are correct
- Check caps lock
- Try pressing Enter instead of clicking button

**Settings not saving:**
- Click "Save Changes" button
- Check browser console for errors
- Ensure localStorage is enabled

**Payment gateway page blank:**
- May require additional setup
- Check admin-gateways component
- See admin for configuration

---

## Security Notes

- Admin access is password protected
- Credentials should be shared securely
- Change admin password regularly
- Don't share admin credentials

---

**Admin pages are now fully integrated into your Astra AI dashboard!**
