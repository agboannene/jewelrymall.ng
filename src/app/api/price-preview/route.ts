import { NextRequest, NextResponse } from "next/server";
import { CATALOG, getPrice } from "@/lib/catalog";
import { z } from "zod";

const Schema = z.object({ familyId: z.string(), qty: z.number().int().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const family = CATALOG.find((f) => f.id === parsed.data.familyId);
  if (!family) return NextResponse.json({ error: "Family not found" }, { status: 404 });
  try {
    const { unitPrice, tier } = getPrice(family, parsed.data.qty);
    return NextResponse.json({ unitPrice, tier, lineTotal: unitPrice * parsed.data.qty, source: "approved catalogue 2026-09-07" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
