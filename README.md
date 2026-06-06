# 🚀 Astra AI — Full Deployment Guide

A production-ready AI chat SaaS with Clerk auth, Admin panel, and OpenAI integration.  
**Completely free to host on Vercel with your own domain.**

---

## ⚡ Deploy in 5 Steps (15 minutes total)

### Step 1 — Push to GitHub

1. Go to [github.com](https://github.com) → click **New repository**
2. Name it `astra-ai`, set to **Public** (free) or Private, click **Create**
3. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit — Astra AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/astra-ai.git
git push -u origin main
```

---

### Step 2 — Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up free with GitHub
2. Click **"Add New Project"** → Import your `astra-ai` repo
3. Vercel auto-detects Vite — leave all settings default
4. **Before clicking Deploy**, add Environment Variables:

| Variable | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_ZmFpci1saW9uZmlzaC0xNS5jbGVyay5hY2NvdW50cy5kZXYk` |
| `VITE_OPENAI_API_KEY` | Your OpenAI key from platform.openai.com |
| `VITE_DEFAULT_MODEL` | `gpt-4o-mini` |
| `VITE_DAILY_LIMIT` | `20` |

5. Click **Deploy** — done! You get a free `*.vercel.app` URL instantly.

---

### Step 3 — Add Your Custom Domain (Free on Vercel)

1. In Vercel dashboard → Your project → **Settings → Domains**
2. Click **Add Domain** → type your domain (e.g. `astra.yourdomain.com`)
3. Vercel shows you DNS records to add — go to your domain registrar:
   - **Namecheap / GoDaddy / Cloudflare**: Add the CNAME or A record Vercel gives you
4. Wait 5–10 minutes → your domain is live with free HTTPS ✓

> **Free domain options:** Get a free domain at [freenom.com](https://freenom.com) (.tk/.ml/.ga) or [afraid.org](https://freedns.afraid.org) for free subdomains.

---

### Step 4 — Configure Clerk (Auth)

Your Clerk publishable key is already set. Now configure redirect URLs:

1. Go to [clerk.com](https://clerk.com) → Sign in → Your App
2. Go to **Configure → Paths** and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`  
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`
3. Go to **Configure → Domains** → Add your Vercel URL (e.g. `https://astra-ai.vercel.app`)
4. After adding custom domain, add it to Clerk too

---

### Step 5 — Access Admin Panel

Your admin panel is at: `https://yourdomain.com/admin`

**Admin credentials:**
- Email: `santhoshkrishna958@gmail.com`
- Password: `300703S#s`

> ⚠️ Change the password in `src/lib/adminConfig.ts` before going live!

---

## 🔐 Security Notes

### Change Admin Password
Edit `src/lib/adminConfig.ts`:
```ts
const credentials = {
  email: 'your-new-email@gmail.com',
  passwordHash: btoa('YourNewPassword123'),
};
```

### Keep .env Secret
The `.gitignore` already excludes `.env`. Never paste your OpenAI key in public code.

---

## 📁 Project Structure

```
astra-v2/
├── src/
│   ├── pages/
│   │   ├── AdminPanel.tsx      # Admin control panel (/admin)
│   │   ├── Dashboard.tsx       # User dashboard (/dashboard)
│   │   ├── SignInPage.tsx      # Clerk sign-in (/sign-in)
│   │   └── SignUpPage.tsx      # Clerk sign-up (/sign-up)
│   ├── sections/
│   │   ├── ChatWidget.tsx      # AI chat with daily limits
│   │   ├── Navigation.tsx      # Nav with auth state
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── adminConfig.ts      # Admin credentials (change password here!)
│   │   └── adminStore.ts       # Settings + usage tracking
│   └── App.tsx                 # Routes
├── .env.example                # Copy to .env and fill values
├── vercel.json                 # SPA routing for Vercel
└── .github/workflows/
    └── deploy.yml              # Auto-deploy on git push
```

---

## 🛣️ Routes

| URL | Page | Who can access |
|---|---|---|
| `/` | Landing page | Everyone |
| `/sign-in` | Clerk sign-in | Logged-out users |
| `/sign-up` | Clerk sign-up | Logged-out users |
| `/dashboard` | User dashboard | Signed-in users only |
| `/admin` | Admin panel | Admin only (password required) |

---

## 🔑 Environment Variables Reference

| Variable | Where to get it | Required |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | clerk.com → API Keys | ✅ Yes |
| `VITE_OPENAI_API_KEY` | platform.openai.com | ✅ Yes |
| `VITE_DEFAULT_MODEL` | Set to `gpt-4o-mini` | Optional |
| `VITE_DAILY_LIMIT` | Any number (e.g. `20`) | Optional |

---

## 🤖 Auto-Deploy (GitHub Actions)

Every time you push to `main`, it auto-builds and deploys to Vercel.

Add these secrets in **GitHub → Settings → Secrets → Actions**:

| Secret | Where to get |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | clerk.com |
| `VITE_OPENAI_API_KEY` | platform.openai.com |
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Run `vercel` CLI once, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same file as above |

---

## 💡 Free Tier Limits

| Service | Free Limit |
|---|---|
| **Vercel** | Unlimited deploys, 100GB bandwidth/month |
| **Clerk** | 10,000 monthly active users |
| **OpenAI** | Pay-per-use (gpt-4o-mini is ~$0.00015/1K tokens) |

---

## 🆘 Troubleshooting

**White screen after deploy?**  
→ Check Vercel logs → Make sure all env vars are set → Check `vercel.json` exists

**Clerk auth not working?**  
→ Add your Vercel URL to Clerk Dashboard → Configure → Domains

**Admin panel not loading?**  
→ Make sure `vercel.json` has the SPA rewrite rule (it does by default)

**Build failing?**  
→ Run `npm run build` locally first to see errors
