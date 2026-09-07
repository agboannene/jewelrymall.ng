"use client";
import { MOCK_LEDGER } from "@/lib/admin";
import { CATALOG, stockStatus } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import { useState } from "react";

export default function AdminInventoryPage() {
  const [ledger] = useState(MOCK_LEDGER);
  const low = CATALOG.flatMap((p) => p.variants.filter((v) => v.stock > 0 && v.stock <= v.lowStockAt).map((v) => ({ ...v, product: p.name })));
  const oos = CATALOG.flatMap((p) => p.variants.filter((v) => v.stock === 0).map((v) => ({ ...v, product: p.name })));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Inventory & Ledger</h1>

      {(low.length > 0 || oos.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-warning-bg border border-warning/20 rounded-xl p-4">
            <p className="font-semibold text-sm text-warning">Low stock ({low.length})</p>
            <ul className="mt-2 space-y-1 text-sm">
              {low.map((v) => <li key={v.id} className="flex justify-between"><span>{v.product} — {v.sku}</span><span className="font-bold">{v.stock} left (≤ {v.lowStockAt})</span></li>)}
            </ul>
            <button onClick={() => alert("Triggers restock task + WhatsApp to Owner")} className="mt-3 px-4 py-1.5 rounded-full bg-white border text-sm">Create restock</button>
          </div>
          <div className="bg-danger-bg border border-danger/20 rounded-xl p-4">
            <p className="font-semibold text-sm text-danger">Out of stock ({oos.length})</p>
            <ul className="mt-2 space-y-1 text-sm">
              {oos.map((v) => <li key={v.id} className="flex justify-between"><span>{v.product} — {v.sku}</span><span className="font-bold">0</span></li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <p className="font-semibold">Stock by variant</p>
          <span className="text-xs text-ink-muted">Source: ledger sum (never direct edit)</span>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-paper text-label text-ink-muted"><tr><th className="text-left px-4 py-2">Product</th><th className="text-left px-4 py-2">Variant</th><th className="text-left px-4 py-2">SKU</th><th className="text-right px-4 py-2">Stock</th><th className="text-left px-4 py-2">Status</th></tr></thead>
            <tbody>
              {CATALOG.flatMap((p) => p.variants.map((v) => {
                const s = stockStatus(v);
                return (
                  <tr key={v.id} className="border-t hover:bg-cream">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{v.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{v.sku}</td>
                    <td className="px-4 py-2 text-right font-bold text-price">{v.stock}</td>
                    <td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s === "in" ? "bg-success-bg text-success" : s === "low" ? "bg-warning-bg text-warning" : "bg-danger-bg text-danger"}`}>{s}</span></td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
          <p className="font-semibold">Ledger (auditable)</p>
          <button onClick={() => alert("Export CSV — every delta, reason, actor, orderRef")} className="px-4 py-1.5 rounded-full border text-sm">Export CSV</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-paper text-label text-ink-muted"><tr><th className="text-left px-4 py-2">Date (WAT)</th><th className="text-left px-4 py-2">SKU</th><th className="text-left px-4 py-2">Variant</th><th className="text-right px-4 py-2">Delta</th><th className="text-left px-4 py-2">Reason</th><th className="text-left px-4 py-2">Actor</th><th className="text-left px-4 py-2">Order</th></tr></thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.id} className="border-t hover:bg-cream">
                  <td className="px-4 py-2 text-xs">{new Date(l.at).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</td>
                  <td className="px-4 py-2 font-mono text-xs">{l.sku}</td>
                  <td className="px-4 py-2">{l.productName} — {l.variantName}</td>
                  <td className={`px-4 py-2 text-right font-bold ${l.delta < 0 ? "text-danger" : "text-success"}`}>{l.delta > 0 ? `+${l.delta}` : l.delta}</td>
                  <td className="px-4 py-2"><span className="bg-cream-paper border px-2 py-1 rounded-full text-xs">{l.reason}</span></td>
                  <td className="px-4 py-2 text-xs">{l.actor}</td>
                  <td className="px-4 py-2 text-xs font-mono">{l.orderRef || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-cream-paper border-t text-xs text-ink-muted">Rule: Stock is never updated directly — only via ledger `delta` with `reason + actor`. Concurrency uses row-level lock on checkout (PRD §6.5). Ledger is the audit trail.</div>
      </div>
    </div>
  );
}
