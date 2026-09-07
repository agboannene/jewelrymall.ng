# JewelryMallNG — Product Requirements Document (PRD)
**Version:** 1.0 | **Date:** 7 September 2026 | **Author:** Hiddekel Studio / OpenCode Analysis | **ID:** JMNG-PRD-0907

> Single source of truth for website, staff dashboard, and WhatsApp AI. This PRD expands the 3 Sep 2026 Build Plan into buildable requirements.

---

## Table of Contents
1. [Executive Summary & Insights](#1-executive-summary--insights)
2. [Goals, Non-Goals, Success Metrics](#2-goals-non-goals-success-metrics)
3. [Users & Personas](#3-users--personas)
4. [Scope & Release Plan](#4-scope--release-plan)
5. [Information Architecture & Sitemap](#5-information-architecture--sitemap)
6. [Functional Requirements](#6-functional-requirements)
7. [Product Model (Data Design)](#7-product-model-data-design)
8. [Buying Journey (Detailed)](#8-buying-journey-detailed)
9. [WhatsApp AI Requirements](#9-whatsapp-ai-requirements)
10. [Staff Dashboard Requirements](#10-staff-dashboard-requirements)
11. [Tracking, Analytics & Attribution](#11-tracking-analytics--attribution)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Architecture & Stack (Recommended)](#13-architecture--stack-recommended)
14. [Security, Privacy & Compliance](#14-security-privacy--compliance)
15. [Operations, Backup & Monitoring](#15-operations-backup--monitoring)
16. [Acceptance Criteria & QA Plan](#16-acceptance-criteria--qa-plan)
17. [Risks, Assumptions & Dependencies](#17-risks-assumptions--dependencies)
18. [Open Questions & Decision Log](#18-open-questions--decision-log)
19. [Appendix](#19-appendix)

---

## 1. Executive Summary & Insights

### 1.1 Project Folder Analysis (Actual State 07 Sep 2026)

| Observation | Insight / Implication |
|---|---|
| Directory contains only `docs/` with 3 PDFs, zero code. | Greenfield build. No legacy migration. PRD must act as build blueprint, not audit. |
| Source PDFs: Executive Summary, Build Plan v1.2, Infrastructure Costs v1.2. All dated 03 Sep 2026, single vendor (Hiddekel Studio). | Vision is consolidated but pre-technical. Need translation from commercial promise → engineering spec. |
| Core promise: *One system* for website + stock + orders + payments + staff work + WhatsApp AI sharing same approved data. | Requires strict single source of truth (SSOT). Anti-pattern to avoid: duplicated product data in WhatsApp vs. Web. Enforce API-first product service. |
| Target: Retail *and* wholesale with complex variants: colours, finishes, shapes, pack options (mixed/fixed), minimum quantities, quantity-tier pricing. | Data model is the hardest problem. Simple Shopify-like variants will fail. Need `Product Family → Variant → PackRule → PriceTier` model. |
| Nigerian market, NGN pricing, Instagram/TikTok as primary acquisition, WhatsApp as primary support channel. | Mobile-first, low-bandwidth optimised, WhatsApp-native (deep links, catalog sync), Paystack/Flutterwave for NGN, attribution for social links. |
| Infrastructure: netcup RS 1000 G12 (8GB RAM, 4 vCPU, 256GB NVMe), Cloudflare Free, PostgreSQL on-server, R2 for images/backups. Budget ₦270k/yr. | Monolith-friendly. Recommend Dockerized Next.js + Postgres + Prisma on single VPS, Cloudflare Tunnel/CDN, R2 for media, not microservices. |
| Timeline: 3 weeks from kickoff (requirements + identity Days 1-3, commerce Days 4-10, AI Days 8-15, QA Days 16-19, Launch 20-21). | Aggressive but feasible with phased MVP. Must prioritize P0 vs P1 clearly. Identity approval is declared critical path. |
| Explicit non-goals: IG/TikTok DM automation, ads, content creation, photography, packaging, logistics, native app. | Prevent scope creep. PRD must enforce boundary and define extensibility points. |
| No telemetry, no existing product catalog, no code conventions yet. | Opportunity to set foundations: analytics, SEO, accessibility, and engineering standards from day one. |

### 1.2 Problem Statement
Retail and wholesale jewelry customers in Nigeria discover products on Instagram/TikTok but struggle to get correct prices (tiered by quantity/pack), confirm stock, and pay with confidence. Staff juggle DMs, manual price lookups, and disconnected stock sheets. No single system records source attribution or enables self-serve checkout while remaining trusted on WhatsApp.

### 1.3 Solution Vision
A mobile-first storefront + unified staff dashboard + WhatsApp AI assistant sharing one approved catalog, price engine, inventory ledger, and order lifecycle. Customer can discover → configure (variant/pack/qty) → see correct price instantly → pay via verified online payment → track order. Staff can manage catalog, stock, orders, payments, and escalated chats in one place.

---

## 2. Goals, Non-Goals, Success Metrics

### 2.1 Goals (P0)
- Increase conversion from social traffic to paid orders.
- Eliminate price/stock misquotes between web, WhatsApp, and staff.
- Enable wholesale quantity pricing without confusing retail buyers.
- Automate 60-70% of routine WhatsApp enquiries with safe handoff.
- Provide staff with < 3-click order/customer lookup.

### 2.2 Non-Goals (V1)
- Native mobile app
- Instagram/TikTok DM bots (only link attribution)
- Marketplace integration (Jumia/Konga)
- Advanced loyalty, BNPL, multi-currency
- Automated logistics/3PL

### 2.3 Success Metrics (First 90 Days Post-Launch)

| Metric | Target | Measurement |
|---|---|---|
| Checkout conversion (visit → paid) | ≥ 2.5% | Plausible/PostHog funnel |
| WhatsApp AI containment (resolved without staff) | 55-70% | AI handoff rate |
| AI hallucination rate | 0% on price/stock/policy | QA audit |
| Order payment verification latency | < 60s p95 | Webhook logs |
| Mobile LCP | < 2.5s on 3G | Lighthouse / Cloudflare |
| Stock accuracy | 99% | Physical vs system audit |
| Staff order handling time | −40% vs DM baseline | Time tracking |

---

## 3. Users & Personas

### 3.1 Primary Personas
1.  **Amara — Retail Buyer (22-34, Lagos/Abuja):** Discovers on IG, wants 1-3 pieces, price-sensitive, pays on mobile, wants fast answers on WhatsApp, fears fake/counterfeit.
2.  **Chioma — Wholesale Reseller (28-45):** Buys 20-100 pcs, needs quantity breaks, mixed packs, negotiates via WhatsApp, repeats monthly, needs invoice/receipt.
3.  **Fola — Store Staff/Admin:** Manages products, confirms payments (screenshots ≠ proof), updates stock, packs orders, answers escalated chats.
4.  **Owner/Manager:** Needs sales, channel, product, and staff reports; controls roles/permissions.

### 3.2 User Stories (Highlights)
- As Amara, I can select colour/finish and see price update instantly so I don't have to ask.
- As Chioma, I can add 50 pcs mixed colours to cart and get wholesale price automatically, with MOQ enforced.
- As Chioma, I can send a photo on WhatsApp and get 3 catalogue matches with links.
- As Fola, I can verify payment via gateway before marking paid, and never trust a screenshot.
- As Owner, I can see which IG/TikTok link drove each sale.

---

## 4. Scope & Release Plan

### 4.1 Phased Roadmap (Aligned to 3-Week Build Plan)

| Phase | Timeline | Scope | Exit Criteria |
|---|---|---|---|
| **MVP (V1.0)** | Weeks 1-3 (Days 1-21) | Identity applied, storefront (home, collections, PLP, PDP, cart, checkout), product family/variant/pack/tier model, cart price engine, Paystack/Flutterwave, inventory ledger, orders with status history, packing list, staff dashboard (products, orders, stock, customers, staff RBAC, reports), WhatsApp AI (catalog Q&A, image match v1, order status w/ OTP, handoff), attribution (UTM, wa.link), QA/backup/restore, training | All acceptance tests pass, backup restore verified |
| **V1.1 (30-day support)** | Weeks 4-7 | Bug fixes, performance tuning, content entry, AI prompt refinements based on real chats | CSAT ≥ 4.2/5 |
| **V1.2 (Post-support)** | Month 3+ | Wishlist, reviews, coupon codes, abandoned cart WhatsApp nudge (opt-in), advanced reports (cohort, best sellers), R2 image optimisation | Prioritised backlog |

### 4.2 Priority Matrix

| Feature | Priority | Rationale |
|---|---|---|
| Variant/pack/tier pricing, stock ledger, verified payments | P0 | Revenue & trust critical |
| WhatsApp product Q&A, link sharing, handoff | P0 | Core differentiator |
| Image-to-product matching | P0 (v1) / P1 (fine-tuned) | Needs guardrails |
| Attribution (UTM + channel reports) | P0 | Proves ROI |
| Wishlist, reviews, coupons | P1 | Engagement |
| BNPL, loyalty, multi-currency | P2 | Future |

---

## 5. Information Architecture & Sitemap

### 5.1 Storefront Sitemap
```
Home
├── New In / Collections (e.g., Necklaces, Earrings, Bracelets, Sets, Wholesale Packs)
├── Search (with filters: category, colour, finish, shape, price, stock)
├── Product Detail (PDP): gallery, variant selectors, pack selector, quantity, tier price table, stock badge, add to cart, WhatsApp CTA
├── Cart (line items with variant, pack, qty, tier price, subtotal)
├── Checkout (customer details, delivery/pickup, delivery fee rules, order summary, payment)
├── Order Confirmation / Track Order (via reference + phone OTP)
├── About / Contact / FAQs / Policies (delivery, returns, refunds, cancellations)
└── Wholesale (explainer, MOQ, how packs work)
```

### 5.2 Dashboard IA
```
Dashboard (KPIs)
├── Products (Families → Variants → Images → Packs → Tiers → Stock)
├── Orders (List, Detail, Status Timeline, Payment Verification, Packing List)
├── Inventory (Ledger, Low-Stock Alerts, Adjustments)
├── Customers (Profiles, Order History, Conversations)
├── Conversations (WhatsApp threads, AI summaries, handoff queue)
├── Staff & Roles (Invite, RBAC)
├── Reports (Sales, Product, Channel, Handoff)
└── Settings (Store, Delivery Rules, Payments, WhatsApp, API keys)
```

---

## 6. Functional Requirements

### 6.1 Storefront (Mobile-First, SEO, A11y)
- **FR-SF-01:** Responsive, mobile-first (< 360px base), touch 44px targets, offline-aware cart persistence (localStorage + server sync).
- **FR-SF-02:** SSR/SSG for PDP/PLP for SEO; meta, OG, JSON-LD (Product), sitemap.xml, robots.txt.
- **FR-SF-03:** Search with debounce, typo tolerance, filters as URL state (shareable/faceted).
- **FR-SF-04:** PDP shows tier price table: e.g., 1-9 pcs ₦X, 10-29 ₦Y, 30+ ₦Z. Price recalculates on variant/pack/qty change without page reload.
- **FR-SF-05:** Stock badges: In Stock / Low (≤ threshold) / Out. Add-to-cart disabled if OOS or below MOQ.
- **FR-SF-06:** Cart: quantity stepper enforces MOQ and pack increments; inline warnings; persistent across sessions.
- **FR-SF-07:** WhatsApp CTA on PDP/Cart: pre-filled message with product link + variant context.

### 6.2 Products, Variations, Packs & Pricing
- **FR-PP-01: Product Family** — e.g., "Pearl Stud Pack". Family has base description, category, tags, default images.
- **FR-PP-02: Variant Dimensions** — Up to 4 axes: `colour`, `finish` (gold/silver/rose), `shape`, `size`. Variant = combination. Each variant has SKU, barcode (optional), images, stock.
- **FR-PP-03: Pack Rules**
  - `fixed` pack: e.g., "Pack of 12: 3 gold, 3 silver, 6 rose" — customer cannot change composition.
  - `mixed` pack: e.g., "Pick any 6 colours from available" — UI for selection, validated server-side.
  - `single` (no pack) for retail pieces.
- **FR-PP-04: MOQ** — Per family or per pack type (e.g., wholesale packs MOQ 12). Enforced in cart and checkout.
- **FR-PP-05: Quantity Price Tiers** — Tier table per family/pack: `minQty, maxQty (null = infinity), retailPrice, wholesalePrice` or unified. Engine picks correct price based on line quantity. Tiers must not overlap; validation on save.
- **FR-PP-06: Price Calculation** — Deterministic server function `getPrice(familyId, variantIds, packId, qty) → unitPrice, lineTotal`. Client previews but server is source of truth at checkout.
- **FR-PP-07: Images** — Up to 12 per family + per variant, orderable, web-optimised (WebP/AVIF), stored on R2.

### 6.3 Cart & Checkout
- **FR-CC-01:** Guest checkout with phone + name + email (optional) + delivery address/pickup selection.
- **FR-CC-02:** Delivery fee engine: by zone/area or flat; free shipping threshold configurable. Pickup = ₦0 with instructions.
- **FR-CC-03:** Order reference: `JMNG-YYYY-XXXXXX` (human readable, unique, indexed).
- **FR-CC-04:** Tax: VAT handling configurable (prices inclusive/exclusive).
- **FR-CC-05:** Payment: integrate Paystack (preferred Nigeria) with verify webhook. Order stays `pending_payment` until provider confirms. No manual "mark paid" without verification (admin override logged with reason).
- **FR-CC-06:** Idempotency: prevent double charge on refresh; payment reference linked to order.

### 6.4 Orders, Fulfilment & Delivery
- **FR-OD-01: Status Lifecycle** — `pending_payment → paid → processing → packed → shipped/out_for_delivery → delivered` + `cancelled`, `refunded`, `failed_payment`. Every transition timestamped + actor (system/staff/customer).
- **FR-OD-02: Packing List** — Auto-generated PDF/print view per order with SKU, variant, qty, images.
- **FR-OD-03: Customer Updates** — SMS/WhatsApp/email on `paid`, `shipped`, `delivered` (opt-in, rate-limited).
- **FR-OD-04: Returns/Refunds/Cancellations** — Policy-gated; refund request creates ticket, requires approval, never auto-refunds.

### 6.5 Inventory
- **FR-IN-01: Stock per Variant** — Integer, never negative. Ledger table for every change: `delta, reason (sale, restock, adjustment, return), actor, orderId`.
- **FR-IN-02: Low-stock warnings** — Threshold per variant; dashboard alert + optional WhatsApp/email to staff.
- **FR-IN-03: Concurrency** — Row-level lock on checkout to prevent oversell. If stock insufficient at payment verification, order goes to `failed_payment` / `on_hold` with staff action.
- **FR-IN-04: Stock History** — Auditable, exportable CSV.

### 6.6 Policies & Content
- FR-PC-01: CMS for FAQs, policies, About, Contact — editable by Owner, versioned, used by both web and AI (SSOT).
- FR-PC-02: Footer/policy pages must exist before payment gateway approval.

---

## 7. Product Model (Data Design)

### 7.1 Entity Diagram (Simplified)
```
ProductFamily 1──* Variant (sku, attributes JSONB, stock, images)
       1──* PackRule (type: single|fixed|mixed, MOQ, composition JSONB)
       1──* PriceTier (packRuleId nullable, minQty, maxQty, price)
       1──* ProductImage (url, alt, sortOrder, variantId nullable)
Order 1──* OrderItem (familyId, variantId, packRuleId, qty, unitPrice snapshot, lineTotal)
     1──* OrderStatusHistory
     1──  Payment (provider, reference, status, verifiedAt)
StockLedger *──1 Variant
Customer 1──* Order, 1──* Conversation
```

### 7.2 Key Tables (Prisma-style)
```prisma
model ProductFamily { id, slug unique, name, description, categoryId, isActive, createdAt }
model Variant { id, familyId, sku unique, attributes Json, stock Int, lowStockAt Int, images ...}
model PackRule { id, familyId, name, type, moq Int, composition Json, isActive }
model PriceTier { id, familyId, packRuleId?, minQty, maxQty Int?, price Decimal, currency String }
model Order { id, reference unique, customerId, status, subtotal, deliveryFee, total, deliveryMethod, address Json, createdAt }
model OrderItem { id, orderId, familyId, variantId, packRuleId, qty, unitPrice, lineTotal }
model StockLedger { id, variantId, delta Int, reason String, actorId, orderId?, createdAt }
```

### 7.3 Business Rules
- Tier `maxQty = null` means infinity (last tier).
- Tiers for same family+pack must be contiguous and non-overlapping; validator rejects gaps if `requireContiguous=true`.
- Mixed packs: sum of selected variant quantities must equal pack size.

---

## 8. Buying Journey (Detailed)

| Step | Actor | System Behaviour | Edge/Validation |
|---|---|---|---|
| 1. Discover | Customer | UTM/wa.me params captured in cookie + localStorage; first-touch & last-touch stored | Gracefully ignore if no UTM |
| 2. Configure | Customer | Variant/pack/qty selectors → `POST /api/price-preview` → instant price | Show "Wholesale price unlocked at 10+" nudge |
| 3. Cart | Customer | Cart persisted; MOQ/pack validation; cross-sell suggestions | Warn if tier boundary next (e.g., "Add 2 more for ₦500 off each") |
| 4. Checkout | Customer | Validates stock snapshot; creates Order `pending_payment`; returns payment init | Race: re-check stock at verify |
| 5. Pay | Gateway | Paystack inline/redirect; webhook `charge.success` → verify amount matches order total (± allowed rounding) | Mismatch → flag for review, don't auto-mark paid |
| 6. Confirm | System | Mark `paid`, decrement stock via ledger, send confirmation (WhatsApp + email), generate packing list | Idempotent webhook handling |
| 7. Fulfil | Staff | Update `processing → packed → shipped → delivered` | Every change audited |

---

## 9. WhatsApp AI Requirements

### 9.1 Capabilities (Must / Must NOT — from Build Plan)

| Must | Must NOT (Guardrails) |
|---|---|
| Answer product/price/pack/delivery/pickup/order questions from SSOT | Invent product, price, stock, delivery date, discount, payment result |
| Search live catalogue, send correct product/cart link | Treat screenshot as proof of payment |
| Image-assisted product matching (customer photo → top 3 matches with confidence) | Pretend match is certain when confidence < threshold (e.g., 0.65) |
| Safe order-status check after identity verification (phone + order ref OTP) | Approve refunds/discounts/credit/exceptions |
| Summarise and hand off to staff | Reveal another customer's data |

### 9.2 Flow
```
Inbound (Meta Cloud API) → Webhook Verify → Session (phone+24h window)
   → Intent (LLM + tools) → Tool Call (product.search / price.get / stock.get / order.status)
   → Response (with source citations: "From approved catalogue 2026-09-07")
   → If escalation trigger → Create Handoff Ticket → Notify Staff Dashboard + WhatsApp
```

### 9.3 Handoff Triggers (Auto-escalate)
- Complaint, refund, payment dispute, custom delivery, low confidence, repeated question, user says "agent/human".

### 9.4 Identity Verification for Order Status
- Require `orderReference + phone OTP` (4-digit) before revealing status. OTP expires 10m, 3 attempts max. Log every access.

### 9.5 AI Implementation Notes
- LLM: low-cost vision-capable (e.g., GPT-4o-mini / Luna tier per Infrastructure doc). Set budget alerts.
- RAG: approved catalog + FAQs + policies as vector/text store, re-indexed on product update. No training on customer chats without consent.
- Prompts versioned in repo; temperature 0.2 for factual answers.
- Every AI answer logged with `promptVersion, toolsCalled, sourcesUsed` for audit.

### 9.6 Image Matching
- Use CLIP-style embedding or LLM vision to rank catalogue images; return top 3 with scores. Threshold: <0.65 → "Not sure, here are close options — want a person to confirm?"
- Do NOT use image match as checkout — must go via PDP link.

---

## 10. Staff Dashboard Requirements

### 10.1 Roles (RBAC)
| Role | Permissions |
|---|---|
| Owner | All + staff invite, pricing tiers, reports, settings |
| Manager | Products, orders, inventory, conversations, reports |
| Staff | Orders (fulfilment), inventory adjustments, conversations (assigned) |
| Viewer | Read-only reports |

### 10.2 Orders
- List with filters: status, date, payment status, delivery method, search by reference/phone.
- Detail: customer, items (with variant images), price breakdown, payment proof (gateway reference, not screenshot), status timeline, internal notes, packing list print, change status with reason.
- Bulk: mark packed/shipped (with confirmation modal).

### 10.3 Products
- CRUD for families, variants, packs, tiers, images (drag-sort). Validation as per §6.2. Preview price.
- Duplicate family flow for fast entry.

### 10.4 Conversations
- Inbox: open / AI-handled / handed-off / closed. Filter by escalation reason.
- Thread view: full transcript, AI summary, product/order context chips, "Take over" → staff becomes responder, AI pauses for 24h or until closed.

### 10.5 Reports (Basic V1)
- Sales: revenue, orders, AOV, by day/week/month, by status.
- Product: best sellers by qty/revenue, low stock.
- Channel: orders/revenue by UTM source (IG, TikTok, WhatsApp, Direct).
- Handoff: volume, reason breakdown, staff response time.

---

## 11. Tracking, Analytics & Attribution

- FR-TR-01: Capture UTM (`source/medium/campaign/content/term`) + `fbclid/gclid` + `wa_source` on entry; persist 30 days; attach to Order.
- FR-TR-02: Cloudflare Web Analytics + PostHog/Plausible (privacy-friendly) for funnels; no heavy GTM before consent.
- FR-TR-03: WhatsApp entry links: `wa.me/<number>?text=JMNG_<slug>` → parsed and attributed.
- FR-TR-04: Dashboard reports read from Order attribution fields, not only client-side analytics (server truth).

---

## 12. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | LCP <2.5s, INP <200ms on Moto G / 3G; image CDN via Cloudflare + R2; lazy-load, priority hints |
| Availability | 99.5% monthly; health endpoint `/health`; uptime monitor (UptimeRobot/Cloudflare) |
| Security | HTTPS everywhere, HSTS, CSP, CSRF, rate limit auth/webhooks, dependency SBOM |
| Data | Daily encrypted backup to R2 off-site; weekly restore drill (as per Build Plan) |
| Scalability | Single VPS sufficient for launch (8GB RAM); stateless app for future horizontal; queue for webhooks/AI |
| Accessibility | WCAG 2.1 AA; keyboard nav, focus states, alt text, color contrast ≥4.5:1 |
| SEO | Canonical, meta, OG, sitemap, breadcrumbs, schema.org Product/Offer |
| Localisation | Currency NGN (₦), locale en-NG, Lagos timezone (WAT) |

---

## 13. Architecture & Stack (Recommended)

### 13.1 Choice & Rationale
- **Next.js 15 (App Router) + TypeScript** — SSR/SSG, image optimisation, API routes unified. Best for SEO + mobile performance.
- **PostgreSQL + Prisma** — Robust for relational product model; ledger; on netcup (no managed DB cost).
- **Tailwind CSS + shadcn/ui** — Rapid luxury theming; consistent design system.
- **Auth: NextAuth / Auth.js** — Staff auth with email+OTP or password+2FA; customer is guest (phone ref).
- **Payments: Paystack** — Nigeria-optimised, webhook verification, inline checkout. Fallback: Flutterwave.
- **WhatsApp: Meta Cloud API** — Direct (no intermediary vendor fee). Webhook + 24h window handling.
- **AI: OpenAI-compatible API (GPT-4o-mini / Luna-tier) + Vercel AI SDK** — Tool calling, vision, budget caps.
- **Storage: Cloudflare R2** — Images + backups; free-tier generous.
- **Deploy: Docker + Caddy/Nginx + PM2 on netcup Ubuntu 24.04; Cloudflare DNS/Proxy; GitHub Actions CI.**
- **Queue/Background:** BullMQ + Redis (on VPS) for webhooks, stock, emails.

### 13.2 High-Level Diagram
```
[Cloudflare DNS/CDN/SSL] → [Caddy on netcup:443] → [Next.js (Node) :3000]
                                ├── / (SSR storefront)
                                ├── /api/* (REST + webhooks)
                                ├── /admin/* (dashboard, auth-protected)
                                └── /api/whatsapp/webhook (Meta)
                                         ↕
                               [Postgres] + [Redis queue] + [R2 (images/backups)]
                                         ↕
                               [Paystack API] [Meta WhatsApp Cloud] [OpenAI API]
```

### 13.3 Env & Cost Alignment
- Fits Infrastructure doc: one VPS, one .com, R2 free tier, no paid DB. AI/WhatsApp pay-as-you-go with caps.

---

## 14. Security, Privacy & Compliance

- **Auth:** Staff passwords argon2/bcrypt, 2FA optional, session 12h expiry, RBAC checked server-side on every route.
- **Payments:** Never log card PAN; verify webhook signature + amount; idempotency key.
- **WhatsApp:** Verify Meta webhook token; encrypt phone at rest; OTP for order lookup.
- **Privacy:** Minimal PII (name, phone, address); retention 24 months; export/delete on request (NDPA 2023 Nigeria aligned + GDPR principles).
- **OWASP:** Param sanitisation, Zod validation on all inputs, rate limit (60 req/min IP), audit log for admin actions.

---

## 15. Operations, Backup & Monitoring

- **Backups:** Daily `pg_dump` encrypted → R2 (`backups/YYYY-MM-DD.sql.gpg`); 30-day retention; restore test weekly (automated + manual verified).
- **Monitoring:** Health check, uptime ping, Sentry for errors, PostHog for events, AI spend dashboard (daily cron alerts if > ₦X).
- **Logs:** Structured JSON, 14-day hot, R2 cold. No PII in logs.
- **Runbook:** "Payments failing → check Paystack status, webhook logs, retries queue" — included in handover notes.

---

## 16. Acceptance Criteria & QA Plan

### 16.1 Test Matrix (From Build Plan + Expanded)
| Area | Test Case | Pass Criteria |
|---|---|---|
| Commerce | Add variant/pack/qty → price = tier table | Exact match, server = client |
| Commerce | MOQ enforcement, mixed pack validation | Block checkout with clear error |
| Stock | Concurrent checkout of last item | One succeeds, one fails gracefully |
| Payments | Paystack test charge → webhook → `paid` | <60s, stock decremented, email sent |
| Payments | Screenshot upload | Never marks paid without gateway verify |
| WhatsApp | Ask price/stock/policy → correct SSOT answer | Matches dashboard data, cited |
| WhatsApp | Image match low confidence → disclaimer + handoff offer | Score <0.65 handled |
| WhatsApp | Order status without OTP | Denied; with OTP → correct status |
| Roles | Staff vs Owner permissions | RBAC enforced server-side |
| Mobile | iPhone SE + Tecno/Infinix 360px, 3G | No overlap, LCP <2.5s |
| Backup | Restore to staging from R2 dump | Data intact, app boots |

### 16.2 UAT Checklist (Owner Sign-off)
- [ ] 15 complex products entered and verified
- [ ] Test orders paid via Paystack test mode (success + failure)
- [ ] WhatsApp handoff to staff works with context
- [ ] Reports show correct channel attribution
- [ ] Packing list prints correctly

---

## 17. Risks, Assumptions & Dependencies

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Identity approval delay | High | Shifts 3-week timeline | Single approver, 24h feedback SLA (Build Plan condition) |
| Paystack KYC/settlement delay | Medium | Blocks verified payments | Confirm account before Day 4; sandbox first |
| Meta WhatsApp number approval | Medium | AI blocked | Use test number in parallel; start verification Day 1 |
| Complex pack rules confuse UI | Medium | Conversion drop | User testing with 5 wholesale customers; progressive disclosure |
| AI hallucination on price | Low (with guardrails) | Trust loss | Tool-only answers; audit logs; 0 tolerance |
| netcup VAT/currency shift | Low | Budget variance | Use ₦270k as ceiling, refund delta per doc |

**Assumptions:** One decision-maker, 10-20 complex sample products Day 1, delivery policy text provided, domain choice confirmed.

**Dependencies:** Domain registration, Meta Business Manager, Paystack keys, product sample.

---

## 18. Open Questions & Decision Log

| # | Question | Owner | Decision (Date) |
|---|---|---|---|
| 1 | Payment provider: Paystack vs Flutterwave vs both? | Owner | **Recommend Paystack primary** (better webhook tooling); add Flutterwave if needed V1.1 |
| 2 | Delivery fee model: per-zone list vs flat + free threshold? | Owner | Need zone list from client |
| 3 | WhatsApp number: new vs existing? | Owner | Must be Cloud API-capable (not regular app) |
| 4 | AI model final choice (cost vs vision quality) | Tech | Recommend GPT-4o-mini tier; set ₦15k/mo cap initially |
| 5 | Returns policy: 3-day, 7-day, or no returns for jewelry? | Owner | Await policy text |

---

## 19. Appendix

### 19.1 Glossary
- **Pack:** Bundle of variants sold as one line item (fixed or mixed).
- **Tier:** Quantity break defining unit price.
- **SSOT:** Single Source of Truth.
- **Handoff:** Transfer from AI to human staff.

### 19.2 References
- JMNG-ES-0903 v1.0 Executive Summary
- JMNG-BP-0903 v1.2 Build Plan
- JMNG-IC-0903 v1.2 Infrastructure Costs
- Build Plan acceptance checklist (to be attached to service agreement)

### 19.3 Next Actions (per "What happens next")
1. Confirm domain, payment method, product/wholesale rules, staff roles, approver.
2. Sign service agreement + testing checklist.
3. Receive start payment (₦770k) + infrastructure allowance.
4. Day 1 workshop: product sample + brand brief.

---

*This PRD is the build contract. Any change to P0 features requires written approval and timeline re-estimation.*
