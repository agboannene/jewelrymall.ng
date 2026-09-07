# JewelryMallNG — Mock-First MVP

**Status:** MVP scaffold ready (no external deps needed). Built from `docs/PRD.md` + `docs/BRAND.md` + `docs/DESIGN_SYSTEM.md`.

## Quick Start (Local, No Keys Needed)

```bash
# from project root: C:\Users\Ann Ene Agbo\Documents\Projects\Jewelrymallng
npm install
npm run dev
# open http://localhost:3000
```

> If `npm install` takes >2 min on your network, it will still succeed — let it finish. The first install is the longest (Next 16 + React 19).

## What Works Without Any External Access

| Feature | Mock | Prod swap |
|---|---|---|
| **Catalog** 15 synthetic products (pearl studs → tassel earrings) | `src/lib/catalog.ts` (SSOT) | Replace fixtures with Prisma + R2 — same `getPrice()` |
| **Tier pricing** 3-tier wholesale, MOQ, pack validation | Client preview + `POST /api/price-preview` | Same engine, server = truth |
| **Cart** persistent, moq & stock guards, tier re-price on qty change | `src/lib/cart.tsx` (localStorage) | Swap to DB cart later |
| **Checkout** delivery zones (Island/Mainland/Abuja/Pickup) + subtotal → total | Mock Paystack verify (`JMNG-2026-XXXXXX`) | Swap `handlePay` to Paystack inline + webhook verify |
| **Track Order** OTP 1234 (10m/3 tries mock) | `/track` | Wire to `/api/orders/status` + SMS |
| **WhatsApp Simulator** RAG + guardrails + handoff | `/simulator` (`botReply`) | Wire to Meta Cloud API webhook + OpenAI tool calling — same `botReply` logic |
| **APIs** `GET /api/catalog/search?q=pearl` , `POST /api/price-preview` | Live | Same endpoints prod |

## Routes

- `/` — Hero + 2/3/4 grid, filters `?q=` + `?cat=`, wholesale nudge
- `/product/[slug]` — Gallery + variant swatches + pack radios + `TierTable` + qty stepper + WhatsApp deep link
- `/checkout` — Form + zone fees + mock Paystack
- `/track` — OTP flow (1234)
- `/simulator` — WhatsApp AI mock (test: "refund" → handoff, "photo match" → 0.65 threshold, "price" → catalogue cite)

## Design System

Tokens in `src/app/globals.css` — Midnight Plum `#2B0F2B`, Radiant Gold `#C9A86A`, Pearl Cream `#FFF7F0`. See `docs/DESIGN_SYSTEM.md` for Tailwind config, components, and code snippets.

## Synthetic Catalog Logic

- `CATALOG` 15 families covers every PRD edge: `single` vs `fixed` vs `mixed` packs, MOQ 1→50, tiers `1-11 / 12-29 / 30+`, in/low/out stock, 5 categories.
- `getPrice(family, qty)` — deterministic, server truth. Client previews, checkout commits.
- Try: Pearl Stud Essentials — pick Mixed 12 → qty 12 → `₦1,200` auto, add 18 more → `₦950` tier.

## Swapping to Prod (when you get access)

```env
# .env.local (when ready)
PAYSTACK_LIVE_KEY=pk_live_...
PAYSTACK_SECRET=sk_live_...
META_WA_TOKEN=...
META_WA_PHONE_ID=...
CLOUDINARY_OR_R2_BUCKET=...
DATABASE_URL=postgresql://...
```

1. Domain: point `jewelrymallng.com` → Cloudflare → netcup Caddy → `next start`
2. Paystack: replace `handlePay()` with `PaystackPop.newTransaction()` + server webhook verify
3. WhatsApp: replace `botReply()` with LLM tool calling (`catalog.search`, `price.get`)
4. Catalog: run `prisma db push` + seed script from `CATALOG` → admin CRUD

## Docs

- `docs/PRD.md` — full spec (§16 QA matrix)
- `docs/BRAND.md` — Midnight Sparkle identity
- `docs/DESIGN_SYSTEM.md` — tokens + components
- `AGENT.md` — self-improving agent (read on every session)

## Next Build Steps

- Dashboard `/admin` (products/orders/ledger) — schema in PRD §7
- Prisma + R2 image pipeline
- Real LLM (GPT-4o-mini) + vision for image match
- Playwright E2E (retail + wholesale checkout)

---
Mock-first ≠ fake — it proves the hardest parts (price engine + stock + handoff) without waiting for credentials.
