// Mock admin data — orders + ledger + stats (SSOT mirrors PRD §7, §10)
import { CATALOG } from "./catalog";

export type OrderStatus = "pending_payment" | "paid" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface MockOrder {
  id: string;
  reference: string;
  customer: { name: string; phone: string; address: string };
  items: { familySlug: string; familyName: string; variantName: string; sku: string; packName: string; qty: number; unitPrice: number; lineTotal: number; image: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: "delivery" | "pickup";
  status: OrderStatus;
  channel: "instagram" | "tiktok" | "whatsapp" | "direct" | "simulator";
  createdAt: string;
  history: { status: OrderStatus; at: string; actor: string; note?: string }[];
}

export interface LedgerEntry {
  id: string;
  at: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  delta: number;
  reason: "sale" | "restock" | "adjustment" | "return";
  actor: string;
  orderRef?: string;
}

function mkHistory(statuses: OrderStatus[]): MockOrder["history"] {
  return statuses.map((s, i) => ({
    status: s,
    at: new Date(Date.now() - (statuses.length - i) * 3600 * 1000).toISOString(),
    actor: i === 0 ? "system" : i === 1 ? "Paystack" : "Fola (staff)",
  }));
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "o1",
    reference: "JMNG-2026-8A12F3",
    customer: { name: "Ada Okoro", phone: "0803 123 4567", address: "12 Allen Ave, Ikeja, Lagos (Island)" },
    items: [
      { familySlug: "pearl-stud-essentials", familyName: "Pearl Stud Essentials", variantName: "White Pearl — Gold", sku: "PRL-GLD-RND", packName: "Mixed 12", qty: 12, unitPrice: 1200, lineTotal: 14400, image: CATALOG[0].variants[0].image },
      { familySlug: "heart-pendant-necklace", familyName: "Heart Pendant Necklace", variantName: "Gold", sku: "HRT-GLD", packName: "Single", qty: 2, unitPrice: 3000, lineTotal: 6000, image: CATALOG[6].variants[0].image },
    ],
    subtotal: 20400,
    deliveryFee: 2500,
    total: 22900,
    deliveryMethod: "delivery",
    status: "processing",
    channel: "instagram",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    history: mkHistory(["pending_payment", "paid", "processing"]),
  },
  {
    id: "o2",
    reference: "JMNG-2026-B4K9P1",
    customer: { name: "Chioma N.", phone: "0810 987 6543", address: "Shop 14, Wuse Market, Abuja" },
    items: [{ familySlug: "classic-gold-hoops-40mm", familyName: "Classic Gold Hoops (40mm)", variantName: "Gold 40mm", sku: "HOOP-40-G", packName: "Mixed 12", qty: 50, unitPrice: 1100, lineTotal: 55000, image: CATALOG[12].variants[0].image }],
    subtotal: 55000,
    deliveryFee: 3500,
    total: 58500,
    deliveryMethod: "delivery",
    status: "paid",
    channel: "whatsapp",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    history: mkHistory(["pending_payment", "paid"]),
  },
  {
    id: "o3",
    reference: "JMNG-2026-CQ2M77",
    customer: { name: "Tolu A.", phone: "0706 222 3344", address: "Pickup — Ikeja" },
    items: [{ familySlug: "tennis-bracelet", familyName: "Tennis Bracelet", variantName: "Silver", sku: "TENN-SLV", packName: "Single", qty: 1, unitPrice: 6200, lineTotal: 6200, image: CATALOG[9].variants[0].image }],
    subtotal: 6200,
    deliveryFee: 0,
    total: 6200,
    deliveryMethod: "pickup",
    status: "packed",
    channel: "tiktok",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    history: mkHistory(["pending_payment", "paid", "processing", "packed"]),
  },
  {
    id: "o4",
    reference: "JMNG-2026-D1ZZ09",
    customer: { name: "Emeka Stores", phone: "0805 555 1212", address: "15 Balogun Market, Lagos Island" },
    items: [{ familySlug: "resin-hoop-earrings", familyName: "Resin Hoop Earrings", variantName: "Green", sku: "RESIN-GRN", packName: "Single", qty: 15, unitPrice: 2000, lineTotal: 30000, image: CATALOG[8].variants[0].image }],
    subtotal: 30000,
    deliveryFee: 2000,
    total: 32000,
    deliveryMethod: "delivery",
    status: "shipped",
    channel: "direct",
    createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    history: mkHistory(["pending_payment", "paid", "processing", "packed", "shipped"]),
  },
  {
    id: "o5",
    reference: "JMNG-2026-E99X12",
    customer: { name: "Blessing K.", phone: "0812 333 4455", address: "Failed — payment mismatch" },
    items: [{ familySlug: "chunky-chain-necklace", familyName: "Chunky Chain Necklace", variantName: "Gold", sku: "CHN-GLD", packName: "Single", qty: 1, unitPrice: 5500, lineTotal: 5500, image: CATALOG[2].variants[0].image }],
    subtotal: 5500,
    deliveryFee: 2500,
    total: 8000,
    deliveryMethod: "delivery",
    status: "pending_payment",
    channel: "simulator",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    history: mkHistory(["pending_payment"]),
  },
];

export const MOCK_LEDGER: LedgerEntry[] = [
  { id: "l1", at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), variantId: "v01-gold", sku: "PRL-GLD-RND", productName: "Pearl Stud Essentials", variantName: "White Pearl — Gold", delta: -12, reason: "sale", actor: "system", orderRef: "JMNG-2026-8A12F3" },
  { id: "l2", at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), variantId: "v13-gold", sku: "HOOP-40-G", productName: "Classic Gold Hoops (40mm)", variantName: "Gold 40mm", delta: -50, reason: "sale", actor: "system", orderRef: "JMNG-2026-B4K9P1" },
  { id: "l3", at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), variantId: "v09-pink", sku: "RESIN-PNK", productName: "Resin Hoop Earrings", variantName: "Pink", delta: -1, reason: "sale", actor: "system", orderRef: "JMNG-2026-RA11" },
  { id: "l4", at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), variantId: "v01-silver", sku: "PRL-SLV-RND", productName: "Pearl Stud Essentials", variantName: "White Pearl — Silver", delta: +20, reason: "restock", actor: "Fola (staff)" },
  { id: "l5", at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), variantId: "v03-gold", sku: "CHN-GLD", productName: "Chunky Chain Necklace", variantName: "Gold", delta: -2, reason: "adjustment", actor: "Owner" },
  { id: "l6", at: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), variantId: "v04-pastel", sku: "BRAC-PASTEL", productName: "Beaded Bracelet Stack", variantName: "Pastel Mix", delta: -12, reason: "sale", actor: "system", orderRef: "JMNG-2026-CQ2M77" },
];
