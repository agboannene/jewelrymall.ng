// JewelryMallNG — Mock Catalog + Price Engine (SSOT)
// Mirrors PRD §6.2 + §7. Types are kept simple for mock-first (no DB).

export type PackType = "single" | "fixed" | "mixed";

export interface PriceTier {
  minQty: number;
  maxQty: number | null; // null = infinity
  price: number; // NGN per piece
}

export interface PackRule {
  id: string;
  name: string;
  type: PackType;
  moq: number;
  size: number; // total pieces in pack (for fixed/mixed) — 1 for single
  composition?: Record<string, number>; // for fixed e.g. { gold: 4, silver: 4, rosegold: 4 }
  description: string;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  attributes: { colour: string; finish: string; shape?: string };
  stock: number;
  lowStockAt: number;
  image: string; // placeholder
}

export interface ProductFamily {
  id: string;
  slug: string;
  name: string;
  category: "earrings" | "necklaces" | "bracelets" | "sets" | "rings";
  description: string;
  material: string;
  images: string[];
  variants: Variant[];
  packs: PackRule[];
  tiers: PriceTier[]; // tiers are per-product in mock (pack-agnostic for simplicity, but engine supports packId)
  isNew?: boolean;
  isWholesaleOnly?: boolean;
}

// Deterministic price engine (SSOT). Client previews, server commits.
export function getPrice(family: ProductFamily, qty: number): { unitPrice: number; tier: PriceTier } {
  const tier = family.tiers.find((t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
  if (!tier) throw new Error(`No tier for qty ${qty} in ${family.slug}`);
  return { unitPrice: tier.price, tier };
}

export function validatePack(family: ProductFamily, packId: string, selectedVariants: Record<string, number>, qty: number) {
  const pack = family.packs.find((p) => p.id === packId);
  if (!pack) return { ok: false, reason: "Pack not found" };
  if (qty < pack.moq) return { ok: false, reason: `MOQ is ${pack.moq} pcs for this pack` };
  if (pack.type === "fixed") return { ok: true };
  if (pack.type === "mixed") {
    const sum = Object.values(selectedVariants).reduce((a, b) => a + b, 0);
    if (sum !== pack.size) return { ok: false, reason: `Pick exactly ${pack.size} pieces for mixed pack (now ${sum})` };
  }
  return { ok: true };
}

export function stockStatus(variant: Variant): "in" | "low" | "out" {
  if (variant.stock <= 0) return "out";
  if (variant.stock <= variant.lowStockAt) return "low";
  return "in";
}

// Synthetic catalog — 15 families covering all PRD edge cases
export const CATALOG: ProductFamily[] = [
  {
    id: "fam-01",
    slug: "pearl-stud-essentials",
    name: "Pearl Stud Essentials",
    category: "earrings",
    description: "Everyday pearl studs — hypoallergenic, tarnish-resistant. Choose gold, silver or rose.",
    material: "Gold-plated • Hypoallergenic",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"],
    variants: [
      { id: "v01-gold", sku: "PRL-GLD-RND", name: "White Pearl — Gold", attributes: { colour: "white", finish: "gold", shape: "round" }, stock: 42, lowStockAt: 8, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" },
      { id: "v01-silver", sku: "PRL-SLV-RND", name: "White Pearl — Silver", attributes: { colour: "white", finish: "silver", shape: "round" }, stock: 3, lowStockAt: 5, image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80" },
      { id: "v01-rose", sku: "PRL-RSG-RND", name: "White Pearl — Rose Gold", attributes: { colour: "white", finish: "rosegold", shape: "round" }, stock: 18, lowStockAt: 6, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
    ],
    packs: [
      { id: "pack-single", name: "Single Pair", type: "single", moq: 1, size: 1, description: "One pair — retail" },
      { id: "pack-12-mixed", name: "Mixed 12", type: "mixed", moq: 12, size: 12, description: "Pick any 12 across colours" },
      { id: "pack-30-fixed", name: "Fixed 30 (10/10/10)", type: "fixed", moq: 30, size: 30, composition: { gold: 10, silver: 10, rosegold: 10 }, description: "Wholesale fixed" },
    ],
    tiers: [{ minQty: 1, maxQty: 11, price: 1800 }, { minQty: 12, maxQty: 29, price: 1200 }, { minQty: 30, maxQty: null, price: 950 }],
    isNew: true,
  },
  {
    id: "fam-02",
    slug: "gold-plated-hoops-mini",
    name: "Mini Gold Hoops",
    category: "earrings",
    description: "Lightweight mini hoops for daily wear. 18k gold-plated.",
    material: "18k gold-plated",
    images: ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"],
    variants: [
      { id: "v02-gold-20", sku: "HOOP-G-20", name: "Gold — 20mm", attributes: { colour: "gold", finish: "gold", shape: "round" }, stock: 64, lowStockAt: 10, image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80" },
      { id: "v02-gold-30", sku: "HOOP-G-30", name: "Gold — 30mm", attributes: { colour: "gold", finish: "gold", shape: "round" }, stock: 22, lowStockAt: 8, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "Retail" }, { id: "pack-20-fixed", name: "Pack 20", type: "fixed", moq: 20, size: 20, description: "10×20mm + 10×30mm" }],
    tiers: [{ minQty: 1, maxQty: 9, price: 2500 }, { minQty: 10, maxQty: 24, price: 1800 }, { minQty: 25, maxQty: null, price: 1450 }],
  },
  {
    id: "fam-03",
    slug: "chunky-chain-necklace",
    name: "Chunky Chain Necklace",
    category: "necklaces",
    description: "Statement chunky chain — layer it or wear solo.",
    material: "Gold / Silver plated",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80"],
    variants: [
      { id: "v03-gold", sku: "CHN-GLD", name: "Gold", attributes: { colour: "gold", finish: "gold" }, stock: 0, lowStockAt: 5, image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80" },
      { id: "v03-silver", sku: "CHN-SLV", name: "Silver", attributes: { colour: "silver", finish: "silver" }, stock: 14, lowStockAt: 5, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 5, price: 5500 }, { minQty: 6, maxQty: null, price: 4200 }],
  },
  {
    id: "fam-04",
    slug: "beaded-bracelet-stack",
    name: "Beaded Bracelet Stack (Set of 3)",
    category: "bracelets",
    description: "Pastel bead stacks — sold as set of 3. Great gift.",
    material: "Acrylic beads • Elastic",
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"],
    variants: [
      { id: "v04-pastel", sku: "BRAC-PASTEL", name: "Pastel Mix", attributes: { colour: "pastel", finish: "multi" }, stock: 30, lowStockAt: 8, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80" },
      { id: "v04-earth", sku: "BRAC-EARTH", name: "Earth Tones", attributes: { colour: "brown", finish: "multi" }, stock: 9, lowStockAt: 6, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Set of 3", type: "single", moq: 1, size: 1, description: "One set" }, { id: "pack-12-mixed", name: "Mixed 12 Sets", type: "mixed", moq: 12, size: 12, description: "Wholesale" }],
    tiers: [{ minQty: 1, maxQty: 11, price: 3200 }, { minQty: 12, maxQty: null, price: 2400 }],
  },
  {
    id: "fam-05",
    slug: "crystal-drop-earrings",
    name: "Crystal Drop Earrings",
    category: "earrings",
    description: "Sparkle drops for evenings.",
    material: "Crystal • Gold-plated hook",
    images: ["https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80"],
    variants: [
      { id: "v05-clear-gold", sku: "CRY-CLR-G", name: "Clear — Gold", attributes: { colour: "clear", finish: "gold", shape: "teardrop" }, stock: 27, lowStockAt: 6, image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&q=80" },
      { id: "v05-pink-gold", sku: "CRY-PNK-G", name: "Pink — Gold", attributes: { colour: "pink", finish: "gold", shape: "teardrop" }, stock: 12, lowStockAt: 5, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 9, price: 3800 }, { minQty: 10, maxQty: null, price: 2900 }],
  },
  {
    id: "fam-06",
    slug: "pearl-choker-set",
    name: "Pearl Choker + Earrings Set",
    category: "sets",
    description: "Bridal favourite — choker with matching studs.",
    material: "Faux pearl • Gold clasp",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"],
    variants: [{ id: "v06-white-gold", sku: "SET-PRL-WG", name: "White — Gold", attributes: { colour: "white", finish: "gold" }, stock: 16, lowStockAt: 4, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "One Set", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-6-fixed", name: "Pack 6", type: "fixed", moq: 6, size: 6, description: "Wholesale" }],
    tiers: [{ minQty: 1, maxQty: 5, price: 8500 }, { minQty: 6, maxQty: null, price: 6800 }],
  },
  {
    id: "fam-07",
    slug: "heart-pendant-necklace",
    name: "Heart Pendant Necklace",
    category: "necklaces",
    description: "Dainty heart pendant on fine chain.",
    material: "Gold-plated",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
    variants: [
      { id: "v07-gold", sku: "HRT-GLD", name: "Gold", attributes: { colour: "gold", finish: "gold", shape: "heart" }, stock: 50, lowStockAt: 10, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
      { id: "v07-rose", sku: "HRT-RSG", name: "Rose Gold", attributes: { colour: "rose", finish: "rosegold", shape: "heart" }, stock: 35, lowStockAt: 8, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-24-mixed", name: "Mixed 24", type: "mixed", moq: 24, size: 24, description: "Mixed wholesale" }],
    tiers: [{ minQty: 1, maxQty: 11, price: 3000 }, { minQty: 12, maxQty: 23, price: 2200 }, { minQty: 24, maxQty: null, price: 1800 }],
  },
  {
    id: "fam-08",
    slug: "cowrie-shell-anklet",
    name: "Cowrie Shell Anklet",
    category: "bracelets",
    description: "Beachy cowrie — adjustable.",
    material: "Cowrie • Gold chain",
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"],
    variants: [{ id: "v08-one", sku: "ANK-CWR", name: "One size", attributes: { colour: "natural", finish: "gold" }, stock: 40, lowStockAt: 10, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 9, price: 2200 }, { minQty: 10, maxQty: null, price: 1600 }],
  },
  {
    id: "fam-09",
    slug: "resin-hoop-earrings",
    name: "Resin Hoop Earrings",
    category: "earrings",
    description: "Colourful retro hoops — large.",
    material: "Resin • Gold hook",
    images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80"],
    variants: [
      { id: "v09-green", sku: "RESIN-GRN", name: "Green", attributes: { colour: "green", finish: "gold", shape: "round" }, stock: 18, lowStockAt: 6, image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&q=80" },
      { id: "v09-pink", sku: "RESIN-PNK", name: "Pink", attributes: { colour: "pink", finish: "gold", shape: "round" }, stock: 2, lowStockAt: 5, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
      { id: "v09-tortoise", sku: "RESIN-TOR", name: "Tortoise", attributes: { colour: "brown", finish: "gold", shape: "round" }, stock: 11, lowStockAt: 5, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-15-mixed", name: "Mixed 15", type: "mixed", moq: 15, size: 15, description: "Pick 15" }],
    tiers: [{ minQty: 1, maxQty: 14, price: 2800 }, { minQty: 15, maxQty: null, price: 2000 }],
  },
  {
    id: "fam-10",
    slug: "tennis-bracelet",
    name: "Tennis Bracelet",
    category: "bracelets",
    description: "Classic sparkle line bracelet.",
    material: "Cubic zirconia • Silver",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"],
    variants: [{ id: "v10-silver", sku: "TENN-SLV", name: "Silver", attributes: { colour: "clear", finish: "silver" }, stock: 13, lowStockAt: 4, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 4, price: 6200 }, { minQty: 5, maxQty: null, price: 4800 }],
  },
  {
    id: "fam-11",
    slug: "layered-gold-necklaces",
    name: "Layered Gold Necklaces (3-in-1)",
    category: "necklaces",
    description: "Three chains, one clasp — effortless stacking.",
    material: "Gold-plated 3-layer",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80"],
    variants: [{ id: "v11-gold", sku: "LAYER-GLD", name: "Gold", attributes: { colour: "gold", finish: "gold" }, stock: 21, lowStockAt: 6, image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "One set", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 7, price: 4800 }, { minQty: 8, maxQty: null, price: 3600 }],
    isWholesaleOnly: false,
  },
  {
    id: "fam-12",
    slug: "initial-pendant",
    name: "Initial Pendant Necklace",
    category: "necklaces",
    description: "Personalise with A-Z — choose gold or silver.",
    material: "Stainless steel",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
    variants: [
      { id: "v12-gold", sku: "INIT-GLD", name: "Gold", attributes: { colour: "gold", finish: "gold", shape: "letter" }, stock: 60, lowStockAt: 12, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
      { id: "v12-silver", sku: "INIT-SLV", name: "Silver", attributes: { colour: "silver", finish: "silver", shape: "letter" }, stock: 55, lowStockAt: 12, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-20-mixed", name: "Mixed 20", type: "mixed", moq: 20, size: 20, description: "Pick letters/colours" }],
    tiers: [{ minQty: 1, maxQty: 19, price: 2600 }, { minQty: 20, maxQty: null, price: 1900 }],
  },
  {
    id: "fam-13",
    slug: "hoop-earrings-plain-gold",
    name: "Classic Gold Hoops (40mm)",
    category: "earrings",
    description: "The everyday statement — hollow lightweight.",
    material: "Gold-plated",
    images: ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80"],
    variants: [{ id: "v13-gold", sku: "HOOP-40-G", name: "Gold 40mm", attributes: { colour: "gold", finish: "gold", shape: "round" }, stock: 80, lowStockAt: 15, image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-50-fixed", name: "Fixed 50", type: "fixed", moq: 50, size: 50, description: "Wholesale" }],
    tiers: [{ minQty: 1, maxQty: 11, price: 2000 }, { minQty: 12, maxQty: 49, price: 1400 }, { minQty: 50, maxQty: null, price: 1100 }],
  },
  {
    id: "fam-14",
    slug: "stackable-rings-gold",
    name: "Stackable Rings (Set of 5)",
    category: "rings",
    description: "Thin stacking rings — mix and match.",
    material: "Gold-plated",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
    variants: [{ id: "v14-gold", sku: "RING-STACK-G", name: "Gold", attributes: { colour: "gold", finish: "gold", shape: "round" }, stock: 25, lowStockAt: 8, image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&q=80" }],
    packs: [{ id: "pack-single", name: "Set of 5", type: "single", moq: 1, size: 1, description: "" }],
    tiers: [{ minQty: 1, maxQty: 9, price: 4500 }, { minQty: 10, maxQty: null, price: 3300 }],
  },
  {
    id: "fam-15",
    slug: "statement-earrings-tassel",
    name: "Tassel Statement Earrings",
    category: "earrings",
    description: "Bold tassels for events — light for their size.",
    material: "Thread • Gold cap",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"],
    variants: [
      { id: "v15-black-gold", sku: "TASSEL-BLK-G", name: "Black — Gold", attributes: { colour: "black", finish: "gold" }, stock: 7, lowStockAt: 5, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
      { id: "v15-red-gold", sku: "TASSEL-RED-G", name: "Red — Gold", attributes: { colour: "red", finish: "gold" }, stock: 0, lowStockAt: 5, image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&q=80" },
    ],
    packs: [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "" }, { id: "pack-10-mixed", name: "Mixed 10", type: "mixed", moq: 10, size: 10, description: "Wholesale" }],
    tiers: [{ minQty: 1, maxQty: 9, price: 3500 }, { minQty: 10, maxQty: null, price: 2600 }],
  },
];

export function getFamilyBySlug(slug: string) {
  return CATALOG.find((p) => p.slug === slug);
}

export function searchCatalog(query: string): ProductFamily[] {
  if (!query.trim()) return CATALOG;
  const q = query.toLowerCase();
  return CATALOG.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.variants.some((v) => v.name.toLowerCase().includes(q))
  );
}
