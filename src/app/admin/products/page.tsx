"use client";
import { CATALOG } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import { useState } from "react";

export default function AdminProductsPage() {
  const [products] = useState(CATALOG);
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = products.filter((p) => !filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.slug.includes(filter.toLowerCase()));

  function mockAction(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="font-serif text-2xl">Products</h1>
        <button onClick={() => mockAction("Create → In prod: Prisma create with tier validation (mock)")} className="bg-plum text-cream px-5 py-2 rounded-full text-sm font-semibold">+ New family</button>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search name or slug…" className="border border-border rounded-full px-4 py-2 text-sm flex-1 min-w-[220px]" />
        <span className="text-sm text-ink-muted">{filtered.length} families • {products.reduce((a, p) => a + p.variants.length, 0)} variants</span>
      </div>

      {toast && <div className="bg-plum text-cream px-4 py-2 rounded-full text-sm text-center">{toast}</div>}

      <div className="grid gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-4 flex gap-4">
              <img src={p.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover border shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-start">
                  <h2 className="font-semibold">{p.name}</h2>
                  <span className="text-xs bg-cream-paper border px-2 py-1 rounded-full capitalize">{p.category}</span>
                  {p.isNew && <span className="text-xs bg-blush-pale border border-blush px-2 py-1 rounded-full">NEW</span>}
                </div>
                <p className="text-sm text-ink-muted mt-1 line-clamp-2">{p.description} — {p.material}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tiers.map((t) => (
                    <span key={`${t.minQty}-${t.maxQty}`} className="text-xs bg-cream-paper border px-2 py-1 rounded-full">
                      {t.maxQty === null ? `${t.minQty}+` : `${t.minQty}–${t.maxQty}`}: <b className="text-price">{formatNGN(t.price)}</b>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.variants.map((v) => (
                    <span key={v.id} className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${v.stock === 0 ? "bg-danger-bg text-danger border-danger/20" : v.stock <= v.lowStockAt ? "bg-warning-bg text-warning border-warning/20" : "bg-success-bg text-success border-success/20"}`}>
                      <img src={v.image} alt="" className="w-4 h-4 rounded-full object-cover" />
                      {v.sku} • {v.stock} left
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.packs.map((pack) => <span key={pack.id} className="text-xs bg-white border px-2 py-1 rounded-full">{pack.name} • {pack.type} • MOQ {pack.moq}</span>)}
                </div>
              </div>
              <div className="hidden sm:flex flex-col gap-2 shrink-0">
                <button onClick={() => mockAction(`Edit ${p.slug} → opens family CRUD drawer (mock)`)} className="px-4 py-2 rounded-full border text-sm hover:border-plum">Edit</button>
                <button onClick={() => mockAction(`Duplicate ${p.slug} → clones tiers/packs (mock)`)} className="px-4 py-2 rounded-full border text-sm hover:border-plum">Duplicate</button>
                <button onClick={() => mockAction(`Images: drag-sort + R2 upload (mock) — alt required`)} className="px-4 py-2 rounded-full bg-cream-paper border text-sm">Images</button>
              </div>
            </div>
            <div className="px-4 py-2 bg-cream-paper border-t flex gap-2 text-xs sm:hidden">
              <button onClick={() => mockAction("Edit")} className="flex-1 py-2 rounded-full border bg-white">Edit</button>
              <button onClick={() => mockAction("Duplicate")} className="flex-1 py-2 rounded-full border bg-white">Duplicate</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blush-pale border border-blush rounded-xl p-4 text-sm">
        <b>Validation (PRD §6.2):</b> Tiers must not overlap, pack MOQ enforced, mixed packs must sum to pack size, stock never negative (ledger). Prod form uses Zod + server check. Images require alt.
      </div>
    </div>
  );
}
