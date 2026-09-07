# JewelryMallNG — Design System
**Version:** 1.0 | **Date:** 7 September 2026 | **ID:** JMNG-DS-0907 | **Brand Ref:** BRAND.md (Midnight Sparkle)

> Production-ready design system for the mobile-first storefront + staff dashboard + WhatsApp AI touchpoints. Tokens → Foundations → Components → Patterns → Code. Built for Next.js + Tailwind + shadcn/ui + Prisma on a single VPS.

---

## Table of Contents
1. [Principles](#1-principles)
2. [Tokens](#2-tokens)
3. [Foundations](#3-foundations)
4. [Layout & Grid](#4-layout--grid)
5. [Components](#5-components)
6. [Patterns (Commerce-Specific)](#6-patterns-commerce-specific)
7. [Dashboard Components](#7-dashboard-components)
8. [Motion & Feedback](#8-motion--feedback)
9. [Accessibility](#9-accessibility)
10. [Code Implementation](#10-code-implementation)
11. [Assets & Handover](#11-assets--handover)
12. [Governance](#12-governance)

---

## 1. Principles

1.  **Mobile-first, Touch-always:** Design at 360px first, 44px min hit target, thumb-reach primary actions.
2.  **Clarity is Luxury:** Wholesale tier tables read at a glance; tabular numbers; honest stock states.
3.  **One Truth, Everywhere:** Web, dashboard, and WhatsApp share tokens, copy, and states.
4.  **Performant Sparkle:** Gold is an accent, not a cost — lazy images, WebP, no heavy fonts.
5.  **Accessible by Default:** WCAG 2.1 AA: contrast ≥4.5:1, keyboard nav, visible focus, alt text.
6.  **Consistent, Not Boring:** Lozenge + sparkle repeat with restraint (60-30-10 color rule).

---

## 2. Tokens

### 2.1 Colour (Tailwind-ready)

```ts
// tailwind.config.ts → theme.extend.colors
colors: {
  plum:    { DEFAULT: '#2B0F2B', light: '#4A204A', dusk: '#1A0A1A' },
  gold:    { DEFAULT: '#C9A86A', light: '#E8C99A', dark: '#A3864E' },
  blush:   { DEFAULT: '#E8AFAF', muted: '#D99A9A', pale: '#F9E8E8' },
  cream:   { DEFAULT: '#FFF7F0', paper: '#FDF6EE', card: '#FFFFFF' },
  ink:     { DEFAULT: '#1A1A1E', muted: '#4B4B55', faint: '#8A8A94' },
  success: { DEFAULT: '#1B7A5A', bg: '#E6F4EE' },
  warning: { DEFAULT: '#C98A1A', bg: '#FFF4E0' },
  danger:  { DEFAULT: '#9B2C2C', bg: '#FBEAEA' },
  border:  '#EDE8E0',
}
```

**Contrast Checks (AA):**
- Plum `#2B0F2B` on Cream `#FFF7F0` → 15.2:1 ✓ (body, headers)
- Ink `#1A1A1E` on Cream → 16:1 ✓
- Gold `#C9A86A` alone on Cream → 2.1:1 ✗ — never for body text; use Gold only for accents/borders/badges with Plum bg.

**Gradients (decorative only):**
```css
--grad-gold: linear-gradient(135deg, #C9A86A 0%, #E8C99A 50%, #C9A86A 100%);
--grad-plum: linear-gradient(180deg, #2B0F2B 0%, #1A0A1A 100%);
```

### 2.2 Typography

**Families:**
- Display/Serif: `Canela` / `Cormorant Garamond` (headlines, brand) — fallback `Georgia`
- Body/Sans: `Inter` / `General Sans` — fallback `system-ui`
- Optional badge: `Space Grotesk`

**Scale (Major Third 1.25):**

| Token | Desktop | Mobile | Weight | Line | Usage |
|---|---|---|---|---|---|
| `text-display` | 48px | 32px | 500 serif | 1.0 | Hero |
| `text-h1` | 36px | 28px | 600 | 1.11 | Page title |
| `text-h2` | 28px | 22px | 600 | 1.14 | Section |
| `text-h3` | 20px | 18px | 600 | 1.4 | Card title |
| `text-body` | 16px | 15px | 400 | 1.62 | Body |
| `text-small` | 14px | 13px | 400 | 1.42 | Caption, tier rows |
| `text-label` | 12px | 11px | 600 caps | 1.33 | Badge |
| `text-price` | 18px | 16px | 700 tabular | 1.33 | Prices (`tabular-nums`) |

```css
.text-price { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.text-label { letter-spacing: 0.08em; text-transform: uppercase; }
```

### 2.3 Spacing (4px base)
`0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128` — use `gap-4/6/8` for grids, `p-4/6` for cards, `py-12/16` for sections.

### 2.4 Radii & Shadows

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Inputs, small badges |
| `radius-md` | 12px | Cards, buttons |
| `radius-lg` | 16px | Product cards, drawers |
| `radius-full` | 9999px | Pills, badges |
| `shadow-card` | `0 4px 24px rgba(43,15,43,0.08)` | Product cards |
| `shadow-lift` | `0 8px 32px rgba(43,15,43,0.14)` | Hover, drawer |
| `shadow-plum` | `0 2px 12px rgba(43,15,43,0.22)` | Sticky header |

### 2.5 Borders & Focus
- Border: `1px solid #EDE8E0` (cream) or `1px solid rgba(43,15,43,0.12)`.
- Focus ring: `0 0 0 3px rgba(201,168,106,0.35)` + `outline: 2px solid #2B0F2B` offset 2px.

### 2.6 Z-Index Scale
`base 0, card 1, sticky 10, drawer 30, modal 40, toast 50, tooltip 60`

### 2.7 Breakpoints
`xs: 360px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px` — design starts at `xs`.

---

## 3. Foundations

### 3.1 Iconography
- **Library:** Lucide React (1.5px stroke, rounded, 20/24px grid).
- **Colors:** Plum for default, Gold for active, Ink muted for disabled.
- **Custom:** `Diamond`, `Lozenge-JM`, `Sparkle-Star (4pt)`, `Pack-Box`, `Wholesale-Tag`.

### 3.2 Elevation
Cards rest at `shadow-card`; on hover lift to `shadow-lift` + `translate-y-[-2px]`. No heavy drop shadows.

### 3.3 Imagery Rules
- Ratio: catalog **1:1** (square), hero **16:9**, reels **4:5**.
- Max side: 1600px, format WebP/AVIF, lazy except LCP hero.
- Alt: required (`alt="Gold-plated pearl stud earrings — close-up on model"`) — AI and a11y depend on it.
- Overlay: on busy photos, add `Pearl Cream 92%` card behind text for legibility.

---

## 4. Layout & Grid

### 4.1 Storefront Grid
- **Container:** `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`
- **Product Grid:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6` — 2 cols on mobile is P0.
- **PDP:** `lg:grid-cols-[1.1fr_0.9fr] gap-8` (gallery left, buy box sticky right at `top-24`).
- **Section padding:** `py-12 lg:py-16` (air = luxury).

### 4.2 Dashboard Shell
- Sidebar (Plum dusk) `w-[264px]` collapses to icons at `lg` below; top bar with search + notifications; content `bg-cream paper`.

---

## 5. Components

### 5.1 Button

| Variant | Classes | Use |
|---|---|---|
| **Primary** | `bg-plum text-cream hover:bg-plum-light focus:ring-gold` | Add to cart, Checkout, Save |
| **Gold** | `bg-gold text-plum hover:bg-gold-light` (gradient shimmer on hover) | Hero CTA only (1 per view) |
| **Secondary** | `bg-white border border-plum/12 text-plum hover:bg-cream` | View details, Cancel |
| **Ghost** | `text-plum hover:bg-plum/6` | Icon actions |
| **Danger** | `bg-danger text-white` | Delete tier, cancel order |

- Sizes: `sm h-9 px-4 text-sm`, `md h-11 px-6`, `lg h-12 px-8 text-base` — min 44px hit target includes padding.
- Loading: spinner + `aria-busy`, disabled opacity 0.5.
- Icon-only: `w-11 h-11` with `aria-label`.

**Code (shadcn):**
```tsx
<Button variant="default" size="lg" className="bg-plum text-cream rounded-md shadow-plum">
  Add to Cart — ₦ 1,200
</Button>
```

### 5.2 Input / Select / Textarea
- Height 44px, `rounded-md border border-border bg-white px-4`, placeholder `text-ink-faint`, error `border-danger + text-danger text-small`.
- Select: Radix-based, same height, chevron Plum.
- Validation: inline message + `aria-invalid`.

### 5.3 Card (Base)
```tsx
<div className="rounded-lg bg-white border border-border shadow-card p-4 sm:p-6">
```
Product card variant: `rounded-lg overflow-hidden` + image 1:1.

### 5.4 Badge / Pill
- `WHOLESALE` — `bg-plum text-cream text-label px-2.5 py-1 rounded-full`
- `LOW` — `bg-warning-bg text-warning border border-warning/20`
- `NEW` — `bg-blush-pale text-plum border border-blush`
- Price tier active: `bg-plum text-cream`, inactive `bg-white border`.

### 5.5 Navigation
- **Header (Sticky):** `h-14 sm:h-16 bg-plum text-cream`, logo (Cream), nav links `text-cream/90 hover:text-gold`, cart badge Gold dot.
- **Mobile nav:** Bottom sheet drawer, thumb-reach.
- **Breadcrumbs:** `Home / Necklaces / Pearl Stud` — `text-small text-ink-muted`, current `text-plum font-medium`.

### 5.6 Other Primitives
- **Tooltip:** Plum bg, Cream text, 12px radius, 8px padding.
- **Toast:** White card, left accent bar (success Emerald etc.), auto-dismiss 4s.
- **Modal/Dialog:** `max-w-lg rounded-lg`, overlay `bg-plum/60 backdrop-blur-sm`, close X.
- **Tabs:** Pill style (tier selector), active Plum.

---

## 6. Patterns (Commerce-Specific)

### 6.1 Product Card
```
[Image 1:1, bg-cream]
[Badge top-left: WHOLESALE SAVE / LOW]
[Wishlist heart top-right]
[Title 2 lines max, text-h3]
[Variant dots: ● gold ● silver ● rose]
[Price: ₦ 1,200 /pc (12+)  ~~₦1,800~~  • tabular]
[Subtle hover lift + quick-add button]
```
States: default, hover (lift), OOS (grayscale 20% + overlay "Out of Stock"), low (amber dot).

### 6.2 PDP — Buy Box
- **Gallery:** Main image + 4-6 thumbnails (scroll on mobile), zoom on click.
- **Title + SKU + Stock badge** (inline).
- **Variant selectors:**
  - Colour: swatch circles (32px) with checkmark + label, keyboard navigable.
  - Pack: radio cards `( ) Single  (•) Pack of 12 — Pick colours  [?]`
  - For mixed packs: colour picker grid with counters (`+ / -`), sum badge `6/6 selected ✓`.
- **Quantity:** Stepper `[-] 12 [+]` + tier nudge `Add 2 more for ₦200 off each!` (Blush pill).
- **Tier Table (Pill Tabs):**
  ```
  [1-11  ₦1,800 ] [12-29  ₦1,200 ●] [30+  ₦950 ]
   ^ active = Plum bg, others white border
  ```
- **Price summary:** `Unit: ₦1,200 × 12 = ₦14,400` + delivery estimate link.
- **Actions:** `Add to Cart (Plum, full-width, lg)` + `Chat on WhatsApp (Ghost with green icon)` secondary.
- **Trust row:** `✓ Paystack Verified • ✓ 7-day policy • ✓ Real stock` (12px, Ink muted).
- **Sticky on desktop:** buy box stays visible while gallery scrolls.

### 6.3 Cart & Cart Drawer
- Drawer slides right, `w-[420px] max-w-[92vw]`, Plum header `Your Bag (3)`.
- Line item: thumb 64px, title, variant, qty stepper, line total tabular, remove (Ghost).
- Summary: subtotal, delivery (calculated after address), total (large tabular), `Checkout →` Gold shimmer button.
- Empty: illustration + "Your mall bag is empty" + `Shop New In`.

### 6.4 Checkout (Single Page, 3 Sections)
1. **Details:** name, phone, email (optional), address, delivery method (radio: Delivery / Pickup).
2. **Delivery fee:** shows by zone after address; pickup = free + instruction.
3. **Order summary + Pay:** reference preview, Paystack button (verified badge). Form validates Zod; sticky summary on desktop.

### 6.5 Search & Filters
- Search bar with `⌕ Search studs, sets, packs...` + debounce, results dropdown with products + "View all".
- Filters as URL state: `?colour=gold&finish=plated&shape=round&price=1000-5000` — shareable, server-rendered.
- Mobile: filter drawer bottom sheet, active count badge.

### 6.6 Order Confirmation / Track
- Hero checkmark (Emerald), reference `JMNG-2026-8A12F3`, status stepper (dots + line), items, total, "Chat about this order" (pre-filled WA).

### 6.7 Trust & Policy Blocks
- Policy pages: Cream bg, max-w-prose 65ch, H2 serif, generous whitespace, anchor nav.

---

## 7. Dashboard Components

### 7.1 Shell
- Sidebar Plum dusk, Gold active indicator (left 3px bar), Cream text, icons Lucide.
- Stat cards: `bg-white rounded-lg p-5`, label `text-label`, value `text-h2 tabular`, sparkline.

### 7.2 Data Table
- Header `bg-cream-paper text-label text-ink-muted`, row `hover:bg-cream`, selection checkbox Plum.
- Pagination `text-small`, Plum active page.
- Bulk bar: appears on select, `bg-plum text-cream` with actions.

### 7.3 Order Status Timeline
```
● pending_payment (grey) → ● paid (Emerald) → ● processing → ● packed → ● delivered
└─ timestamp + actor (System • Fola • Paystack) + note
```

### 7.4 Conversation Inbox (WhatsApp)
- Left list: avatar, name, last message, escalation tag (Amber = handoff), unread Gold dot.
- Right thread: bubble `bg-white` (customer) vs `bg-blush-pale` (AI) vs `bg-plum text-cream` (staff), timestamps, tool-chip `↳ price.get → ₦1,200 ✓`.
- Handoff banner: Amber `AI summary: ... • Take over` button (Plum).

### 7.5 Inventory Ledger
- Table: date, variant (thumb+SKU), delta (`+12` Emerald / `-1` muted), reason pill, actor, order link.
- Low-stock banner: Amber bg with `Re-stock` CTA.

---

## 8. Motion & Feedback

- **Duration:** `150ms` micro, `250ms` panel, `300ms` price count.
- **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out).
- **Hover:** `transition: transform 150ms, box-shadow 150ms`.
- **Price tier flip:** `animate-[count_300ms]` (visually tabulate).
- **Loading:** skeleton `bg-cream-paper animate-pulse`, not spinner for cards.
- **Respect:** `prefers-reduced-motion` → disable shimmer/lift.

---

## 9. Accessibility

- Color contrast: enforce Plum/Cream and Ink/Cream; never Gold text alone.
- Focus: always visible (Gold ring + Plum outline); order = visual order.
- Hit targets: ≥44×44, spacing ≥8 between.
- Alt text mandatory; decorative images `aria-hidden`.
- Forms: `label ↔ input` linked, errors with `aria-describedby`.
- Tables: `scope="col"`, captions.
- Keyboard: product swatches are `radiogroup`, quantity stepper reachable, drawer traps focus.
- Test with axe + keyboard + VoiceOver before merge.

---

## 10. Code Implementation

### 10.1 Tailwind Config (Tokens as CSS Vars for Theming)
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: '#2B0F2B',
        gold: '#C9A86A',
        blush: '#E8AFAF',
        cream: '#FFF7F0',
        ink: '#1A1A1E',
        border: '#EDE8E0',
      },
      fontFamily: {
        serif: ['Canela', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'General Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: { md: '12px', lg: '16px' },
      boxShadow: {
        card: '0 4px 24px rgba(43,15,43,0.08)',
        lift: '0 8px 32px rgba(43,15,43,0.14)',
      },
    },
  },
} satisfies Config
```

```css
/* globals.css */
:root {
  --bg: #FFF7F0;
  --text: #1A1A1E;
  --plum: #2B0F2B;
  --gold: #C9A86A;
}
html { -webkit-font-smoothing: antialiased; }
body { background: var(--bg); color: var(--text); font-family: var(--font-sans); }
h1,h2,h3 { font-family: var(--font-serif); color: var(--plum); }
.text-price { font-variant-numeric: tabular-nums; }
```

### 10.2 Component Usage (shadcn/ui)
```bash
npx shadcn@latest init -d
npx shadcn@latest add button card input select dialog drawer badge tabs toast
```
Extend `components/ui/button.tsx` with `gold` variant.

### 10.3 Product Card Component (Sketch)
```tsx
// components/shop/ProductCard.tsx
export function ProductCard({ product, price, stock }: Props) {
  return (
    <article className="group rounded-lg bg-white border border-border shadow-card hover:shadow-lift hover:-translate-y-0.5 transition overflow-hidden">
      <div className="aspect-square bg-cream relative">
        <Image src={product.image} alt={product.alt} fill className="object-cover" sizes="(min-width:1024px)25vw,50vw" />
        {product.badge && <Badge className="absolute left-2 top-2 bg-plum text-cream">{product.badge}</Badge>}
      </div>
      <div className="p-3">
        <h3 className="font-serif text-[15px] leading-5 line-clamp-2">{product.name}</h3>
        <p className="mt-1 text-price text-plum font-bold">₦ {price.toLocaleString('en-NG')} <span className="font-normal text-ink-muted text-small">/pc (12+)</span></p>
      </div>
    </article>
  )
}
```

### 10.4 Tier Pill (Price Engine)
```tsx
<Tabs defaultValue="12-29" className="flex gap-2">
  {tiers.map(t => (
    <TabsTrigger key={t.label} value={t.label} className="rounded-full border px-4 py-2 data-[state=active]:bg-plum data-[state=active]:text-cream">
      {t.label} — ₦ {t.price.toLocaleString()}
    </TabsTrigger>
  ))}
</Tabs>
```

### 10.5 File Structure
```
app/
  (shop)/ page.tsx, collections/, product/[slug]/
  checkout/  globals.css
components/
  ui/ (shadcn)  shop/ (ProductCard, BuyBox, TierTable, CartDrawer)  dashboard/ (StatCard, OrderTimeline, Inbox)
lib/
  price.ts  stock.ts  format.ts (NGN, WAT dates)
```

---

## 11. Assets & Handover

### 11.1 Icon & Pattern Exports
- `brand/icon_JM.svg`, `brand/sparkle.svg`, `brand/lozenge_grid.svg` (5% opacity).
- Favicon `32/180/512` + OG `1200×630` (Plum bg, Gold icon, Cream wordmark).

### 11.2 Image Pipeline
- Upload → validate → generate 400/800/1200 WebP+AVIF → store R2 (`/product/{family}/{variant}_{w}.webp`) → CDN via Cloudflare.
- Enforce alt on upload; block publish if missing.

### 11.3 Checklist for Implementer
- [ ] Tokens in `tailwind.config.ts` + CSS vars
- [ ] shadcn primitives themed (button gold, focus ring)
- [ ] ProductCard, PDP BuyBox, TierTable, CartDrawer built and 360px-tested
- [ ] Checkout, packing list, track order styled
- [ ] Dashboard shell + table + timeline
- [ ] axe + Lighthouse (mobile) passes before merge

---

## 12. Governance

- **Source:** This doc + `BRAND.md` + Figma (to be created from this spec) are SSOT. No ad-hoc colours.
- **Change:** Token change → PR with before/after screenshots on 360px + 1280px + contrast check.
- **Versioning:** `JMNG-DS-0907` → bump date on breaking token change; keep changelog at top.
- **Reference:** `docs/PRD.md` §5-§12 for behaviour; this doc for look & feel. If conflict, PRD wins on behaviour, this doc on visual.

---

*Build with restraint: let Cream breathe, let Plum anchor, let Gold whisper. That's how JewelryMallNG looks expensive without looking expensive to build.*
