"use client";
import { PriceTier } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";

export default function TierTable({ tiers, qty, onPick }: { tiers: PriceTier[]; qty: number; onPick: (qty: number) => void }) {
  const activeIndex = tiers.findIndex((t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
  return (
    <div className="flex flex-wrap gap-2">
      {tiers.map((t, i) => {
        const label = t.maxQty === null ? `${t.minQty}+` : `${t.minQty}–${t.maxQty}`;
        const active = i === activeIndex;
        return (
          <button
            key={label}
            onClick={() => onPick(t.minQty)}
            className={`rounded-full border px-4 py-2 text-sm transition ${active ? "bg-plum text-cream border-plum shadow" : "bg-white border-border hover:border-plum/30 text-ink"}`}
          >
            <span className="font-semibold">{label}</span>
            <span className="ml-2 text-price">{formatNGN(t.price)}</span>
          </button>
        );
      })}
    </div>
  );
}
