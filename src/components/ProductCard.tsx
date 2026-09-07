import Link from "next/link";
import { ProductFamily, stockStatus } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";

export default function ProductCard({ p }: { p: ProductFamily }) {
  const cheapest = Math.min(...p.tiers.map((t) => t.price));
  const retail = p.tiers[0]?.price;
  const stock = p.variants.some((v) => stockStatus(v) === "out") ? "mixed" : p.variants.every((v) => stockStatus(v) === "out") ? "out" : "in";
  const low = p.variants.some((v) => stockStatus(v) === "low");
  const wholesalePrice = p.tiers.length > 1 ? p.tiers[1].price : null;

  return (
    <Link href={`/product/${p.slug}`} className="group rounded-[16px] bg-white border border-border shadow-card hover:shadow-lift hover:-translate-y-0.5 transition overflow-hidden flex flex-col">
      <div className="aspect-square bg-cream-paper relative overflow-hidden">
        {/* eslint-disable @next/next/no-img-element */}
        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {p.isNew && <span className="text-label bg-blush-pale text-plum border border-blush px-2 py-1 rounded-full">NEW</span>}
          {low && <span className="text-label bg-warning-bg text-warning border border-warning/20 px-2 py-1 rounded-full">LOW</span>}
          {stock === "out" && <span className="text-label bg-danger-bg text-danger px-2 py-1 rounded-full">OUT</span>}
        </div>
        {wholesalePrice && (
          <span className="absolute bottom-2 left-2 text-[11px] font-semibold bg-plum text-cream px-2.5 py-1 rounded-full">WHOLESALE SAVE</span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-serif text-[15px] leading-5 line-clamp-2 min-h-[40px]">{p.name}</h3>
        <p className="text-xs text-ink-muted mt-1 line-clamp-1">{p.material} • {p.category}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-price text-plum font-bold text-[16px]">{formatNGN(cheapest)}<span className="font-normal text-ink-muted text-xs"> /pc</span></span>
          {wholesalePrice && retail !== cheapest && <span className="text-xs line-through text-ink-faint">{formatNGN(retail)}</span>}
        </div>
        <div className="mt-2 flex gap-1">
          {p.variants.slice(0, 4).map((v) => (
            <span key={v.id} className="w-5 h-5 rounded-full border border-border overflow-hidden" title={v.name}>
              <img src={v.image} alt="" className="w-full h-full object-cover" />
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
