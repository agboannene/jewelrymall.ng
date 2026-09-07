import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { MOCK_ORDERS } from "@/lib/admin";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100").all() as any[];
    const orders = rows.map((r) => ({
      id: r.id,
      reference: r.reference,
      customer: { name: r.customer_name, phone: r.customer_phone, address: r.customer_address },
      deliveryMethod: r.delivery_method,
      deliveryZone: r.delivery_zone,
      deliveryFee: r.delivery_fee,
      subtotal: r.subtotal,
      total: r.total,
      status: r.status,
      channel: r.channel,
      items: JSON.parse(r.items_json),
      createdAt: r.created_at,
      history: [{ status: r.status, at: r.created_at, actor: "system" }],
    }));
    // merge mock + real (real first)
    const merged = [...orders, ...MOCK_ORDERS];
    return NextResponse.json({ orders: merged, realCount: orders.length });
  } catch (e: any) {
    return NextResponse.json({ orders: MOCK_ORDERS, error: e.message }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, zone, items, subtotal, total, deliveryFee, channel } = body;
    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const db = getDb();
    const id = crypto.randomUUID();
    const reference = `JMNG-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO orders (id, reference, customer_name, customer_phone, customer_address, delivery_method, delivery_zone, delivery_fee, subtotal, total, status, channel, items_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      reference,
      customer.name,
      customer.phone,
      customer.address || "",
      zone?.id === "pickup" ? "pickup" : "delivery",
      zone?.label || "Lagos Island",
      deliveryFee || 0,
      subtotal || 0,
      total || 0,
      "paid",
      channel || "direct",
      JSON.stringify(items),
      now
    );

    // ledger entries
    const insertLedger = db.prepare(`INSERT INTO ledger (id, at, sku, product_name, variant_name, delta, reason, actor, order_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const it of items) {
      insertLedger.run(crypto.randomUUID(), now, it.sku || it.variantName || "SKU", it.familyName || "Product", it.variantName || "Variant", -Math.abs(it.qty || 1), "sale", "system", reference);
    }

    return NextResponse.json({ ok: true, reference, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
