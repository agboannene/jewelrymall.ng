import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const results = searchCatalog(q).slice(0, 10).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    priceFrom: Math.min(...p.tiers.map((t) => t.price)),
    image: p.images[0],
    stock: p.variants.reduce((a, v) => a + v.stock, 0),
  }));
  return NextResponse.json({ q, count: results.length, results, source: "approved catalogue 2026-09-07" });
}
