import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { CATALOG } from "@/lib/catalog";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT data_json FROM products ORDER BY created_at DESC").all() as any[];
    const customs = rows.map((r) => JSON.parse(r.data_json));
    return NextResponse.json({ products: [...customs, ...CATALOG] });
  } catch (e: any) {
    return NextResponse.json({ products: CATALOG });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, category, description, material, images, variants, packs, tiers } = body;
    if (!name || !slug || !category || !variants?.length || !tiers?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // validate tiers not overlapping
    const sorted = [...tiers].sort((a: any, b: any) => a.minQty - b.minQty);
    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i];
      const nxt = sorted[i + 1];
      if (cur.maxQty === null) return NextResponse.json({ error: "Only last tier can have maxQty null" }, { status: 400 });
      if (cur.maxQty >= nxt.minQty) return NextResponse.json({ error: `Tiers overlap: ${cur.minQty}-${cur.maxQty} and ${nxt.minQty}-${nxt.maxQty ?? "∞"}` }, { status: 400 });
    }
    const db = getDb();
    const exists = db.prepare("SELECT 1 FROM products WHERE slug = ?").get(slug);
    if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const product = {
      id: `fam-${Date.now()}`,
      slug,
      name,
      category,
      description: description || "",
      material: material || "Gold-plated",
      images: images?.length ? images : ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"],
      variants,
      packs: packs?.length ? packs : [{ id: "pack-single", name: "Single", type: "single", moq: 1, size: 1, description: "Retail" }],
      tiers,
      isNew: true,
    };

    db.prepare("INSERT INTO products (id, slug, data_json, created_at) VALUES (?, ?, ?, ?)").run(
      product.id,
      product.slug,
      JSON.stringify(product),
      new Date().toISOString()
    );

    return NextResponse.json({ ok: true, product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
