"use client";
import { useState } from "react";
import { ProductFamily, getPrice, stockStatus } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import TierTable from "./TierTable";
import { useCart } from "@/lib/cart";
import Link from "next/link";

export default function ProductBuyBox({ family }: { family: ProductFamily }) {
  const [variantId, setVariantId] = useState(family.variants[0]?.id);
  const [packId, setPackId] = useState(family.packs[0]?.id);
  const [qty, setQty] = useState(family.packs[0]?.moq || 1);
  const [msg, setMsg] = useState<string | null>(null);
  const { addLine } = useCart();

  const variant = family.variants.find((v) => v.id === variantId)!;
  const pack = family.packs.find((p) => p.id === packId)!;
  const status = stockStatus(variant);
  const { unitPrice } = getPrice(family, qty);
  const lineTotal = unitPrice * qty;
  const nextTier = family.tiers.find((t) => t.minQty > qty);
  const saveHint = nextTier ? `Add ${nextTier.minQty - qty} more for ${formatNGN(nextTier.price)} /pc` : null;

  function handleAdd() {
    const res = addLine({
      familyId: family.id,
      familySlug: family.slug,
      familyName: family.name,
      variantId: variant.id,
      variantName: variant.name,
      image: variant.image,
      packId: pack.id,
      packName: pack.name,
      qty,
    });
    if (!res.ok) setMsg(res.reason || "Error");
    else setMsg("Added to bag ✓");
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-5 lg:sticky lg:top-20 self-start">
      <span className="text-label bg-cream-paper border border-border px-2.5 py-1 rounded-full capitalize">{family.category}</span>
      <h1 className="font-serif text-2xl mt-3 leading-tight">{family.name}</h1>
      <p className="text-sm text-ink-muted mt-2">{family.material}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status === "in" ? "bg-success" : status === "low" ? "bg-warning" : "bg-danger"}`} />
        <span className={`text-xs font-semibold ${status === "in" ? "text-success" : status === "low" ? "text-warning" : "text-danger"}`}>
          {status === "in" ? `In stock • ${variant.stock} left` : status === "low" ? `Low • Only ${variant.stock} left` : "Out of stock"}
        </span>
        <span className="text-xs text-ink-faint ml-auto">SKU {variant.sku}</span>
      </div>

      {/* Variants */}
      <div className="mt-6">
        <p className="text-sm font-semibold">Colour / Finish</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {family.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${variantId === v.id ? "bg-plum text-cream border-plum" : "bg-white border-border hover:border-plum/30"}`}
            >
              <img src={v.image} alt="" className="w-6 h-6 rounded-full object-cover" />
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Packs */}
      <div className="mt-6">
        <p className="text-sm font-semibold">Pack <span className="text-ink-muted font-normal">— {pack.description}</span></p>
        <div className="grid gap-2 mt-2">
          {family.packs.map((p) => (
            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${packId === p.id ? "border-plum bg-cream-paper" : "border-border bg-white hover:border-plum/20"}`}>
              <input type="radio" name="pack" checked={packId === p.id} onChange={() => { setPackId(p.id); setQty(p.moq); }} className="accent-plum" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name} <span className="text-ink-muted font-normal">• MOQ {p.moq} • {p.type}</span></p>
                <p className="text-xs text-ink-muted">{p.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="mt-6">
        <p className="text-sm font-semibold">Quantity price (auto-applies)</p>
        <div className="mt-2">
          <TierTable tiers={family.tiers} qty={qty} onPick={(q) => setQty(q)} />
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-semibold">Quantity</span>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setQty(Math.max(pack.moq, qty - 1))} className="w-9 h-9 rounded-full border border-border grid place-items-center hover:bg-cream">−</button>
          <input value={qty} onChange={(e) => setQty(Math.max(pack.moq, parseInt(e.target.value) || pack.moq))} className="w-16 text-center border border-border rounded-lg py-1.5 text-sm font-semibold" />
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full border border-border grid place-items-center hover:bg-cream">+</button>
        </div>
      </div>
      {saveHint && <p className="mt-2 text-xs bg-blush-pale border border-blush text-plum px-3 py-2 rounded-full inline-flex">💡 {saveHint}</p>}

      <div className="mt-4 bg-cream-paper rounded-lg p-3 border border-border">
        <div className="flex justify-between text-sm"><span className="text-ink-muted">Unit price (tier)</span><span className="font-bold text-price">{formatNGN(unitPrice)} /pc</span></div>
        <div className="flex justify-between text-sm mt-1"><span className="text-ink-muted">Line total</span><span className="font-bold text-price text-plum">{formatNGN(lineTotal)}</span></div>
      </div>

      <button onClick={handleAdd} disabled={status === "out"} className={`w-full mt-4 rounded-full py-3 font-semibold text-sm transition ${status === "out" ? "bg-ink-faint text-white cursor-not-allowed" : "bg-plum text-cream hover:bg-plum-light"}`}>
        {status === "out" ? "Out of Stock — Notify me" : `Add to Bag — ${formatNGN(lineTotal)}`}
      </button>
      <Link href={`https://wa.me/2340000000000?text=Hi%20JewelryMallNG%20I%20want%20${encodeURIComponent(family.name)}%20${variant.name}%20qty%20${qty}`} target="_blank" className="mt-2 block text-center w-full rounded-full py-2.5 font-medium text-sm border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">Chat on WhatsApp with this selection</Link>

      {msg && <p className="mt-3 text-sm text-center bg-success-bg border border-success/20 text-success px-3 py-2 rounded-full">{msg}</p>}
      <p className="text-xs text-ink-faint text-center mt-3">Mock: stock validated locally. Real app will re-check on checkout. Pay via Paystack test.</p>
    </div>
  );
}
