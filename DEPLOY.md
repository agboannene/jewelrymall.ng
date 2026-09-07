# Deploy to Vercel — Temporary URL (2 minutes)

This project is **Vercel-ready** (Next.js 16, `vercel.json` included). No env vars needed for mock.

## Option A: One-command deploy (fastest)

In your terminal (not opencode sandbox — your real terminal):

```bash
cd "C:\Users\Ann Ene Agbo\Documents\Projects\Jewelrymallng"

# install vercel CLI once
npm i -g vercel

# deploy — follow prompts, accept defaults
vercel

# when asked:
# ? Set up and deploy? Y
# ? Which scope? → your Vercel account
# ? Link to existing project? N
# ? Project name? jewelrymallng  (or accept)
# ? Directory? ./

# then for prod URL:
vercel --prod
```

You will get:
- Preview: `https://jewelrymallng-xxx.vercel.app`
- Prod: `https://jewelrymallng.vercel.app` (or similar)

Share that URL — it has the full store + `/admin` + `/simulator`.

## Option B: GitHub → Vercel (recommended for team)

1. Create empty GitHub repo (e.g., `jewelrymallng`) — do NOT init with README
2. Push:

```bash
cd "C:\Users\Ann Ene Agbo\Documents\Projects\Jewelrymallng"
git branch -M main
git remote add origin https://github.com/YOUR_USER/jewelrymallng.git
git push -u origin main
```

3. Go to https://vercel.com/new → Import `jewelrymallng` → Framework auto-detected as Next.js → Deploy (no env vars).
4. Every `git push` auto-deploys.

## What deploys

- Storefront `/` + PDP `/product/pearl-stud-essentials` etc.
- Cart + Checkout (mock Paystack) + Track `/track`
- WhatsApp Simulator `/simulator`
- **Admin** `/admin` → Overview, `/admin/products`, `/admin/orders`, `/admin/inventory`

All mock data — zero external keys. When you have Paystack/Meta keys, add them in Vercel → Settings → Environment Variables and redeploy.

## Custom domain (later)

Vercel → Settings → Domains → add `jewelrymallng.com` (Cloudflare DNS per `docs/JewelryMallNG_Infrastructure_Costs.pdf`). Keep free Vercel URL as staging.

## Netcup later (per Infrastructure doc)

This Vercel deploy is temporary for demo. For prod on netcup RS1000:

```bash
npm run build
# Docker + Caddy per PRD §13 → same code, same env
```
