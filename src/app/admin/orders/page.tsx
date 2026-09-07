"use client";
import { MOCK_ORDERS, MockOrder } from "@/lib/admin";
import { formatNGN } from "@/lib/format";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [selectedId, setSelectedId] = useState<string>(MOCK_ORDERS[0].id);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        if (d.orders?.length) {
          setOrders(d.orders);
          setSelectedId(d.orders[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const selected = orders.find((o) => o.id === selectedId) || orders[0];
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h1 className="font-serif text-2xl">Orders</h1>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "pending_payment", "paid", "processing", "packed", "shipped", "delivered"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs border capitalize ${filter === f ? "bg-plum text-cream border-plum" : "bg-white border-border hover:border-plum/30"}`}>{f.replace("_", " ")}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden self-start">
          <div className="p-3 border-b bg-cream-paper flex items-center justify-between">
            <span className="text-sm font-semibold">{filtered.length} orders</span>
            <span className="text-xs text-ink-muted">Tap to view detail</span>
          </div>
          <div className="divide-y max-h-[640px] overflow-auto">
            {filtered.map((o) => (
              <button key={o.id} onClick={() => setSelectedId(o.id)} className={`w-full text-left p-3 hover:bg-cream flex gap-3 ${selectedId === o.id ? "bg-cream-paper" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs">{o.reference}</p>
                  <p className="text-sm font-medium truncate">{o.customer.name}</p>
                  <p className="text-xs text-ink-muted">{o.channel} • {new Date(o.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-price">{formatNGN(o.total)}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-[11px] font-semibold ${o.status === "paid" || o.status === "processing" ? "bg-success-bg text-success" : o.status === "pending_payment" ? "bg-warning-bg text-warning" : "bg-cream-paper border"}`}>{o.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-3 items-start justify-between">
            <div>
              <p className="font-mono text-xs text-ink-muted">Order</p>
              <p className="font-semibold text-lg">{selected.reference}</p>
              <p className="text-sm text-ink-muted">{selected.customer.name} • {selected.customer.phone} • {selected.deliveryMethod} • {selected.channel}</p>
              <p className="text-xs text-ink-muted mt-1">{selected.customer.address}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${selected.status === "paid" || selected.status === "processing" ? "bg-success-bg text-success border border-success/20" : selected.status === "pending_payment" ? "bg-warning-bg text-warning border border-warning/20" : "bg-cream-paper border"}`}>{selected.status.toUpperCase()}</span>
          </div>

          <div className="p-4 space-y-3">
            {selected.items.map((it, i) => (
              <div key={i} className="flex gap-3 border border-border rounded-lg p-3">
                <img src={it.image} alt="" className="w-14 h-14 rounded object-cover border shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.familyName}</p>
                  <p className="text-xs text-ink-muted">{it.variantName} • {it.sku} • {it.packName} × {it.qty}</p>
                  <p className="text-xs text-ink-faint">{formatNGN(it.unitPrice)} /pc</p>
                </div>
                <span className="font-bold text-sm text-price">{formatNGN(it.lineTotal)}</span>
              </div>
            ))}

            <div className="bg-cream-paper rounded-lg border p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span className="font-semibold">{formatNGN(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Delivery</span><span className="font-semibold">{formatNGN(selected.deliveryFee)}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>{formatNGN(selected.total)}</span></div>
              <p className="text-xs text-ink-muted pt-2">Total is verified against Paystack amount (must match ±0) before marking `paid`. Screenshot never counts.</p>
            </div>

            <div>
              <p className="font-semibold text-sm">Status timeline</p>
              <div className="mt-2 relative pl-6 border-l-2 border-border space-y-3">
                {selected.history.map((h, i) => (
                  <div key={i} className="relative">
                    <span className={`absolute -left-[9px] top-1 w-3 h-3 rounded-full border-2 ${h.status === "paid" ? "bg-success border-success" : h.status === "pending_payment" ? "bg-warning border-warning" : "bg-plum border-plum"}`} />
                    <p className="text-sm font-medium">{h.status} <span className="text-ink-muted font-normal">• {h.actor}</span></p>
                    <p className="text-xs text-ink-muted">{new Date(h.at).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => alert("Status transition with reason + audit log")} className="px-4 py-2 rounded-full bg-plum text-cream text-sm">Update status</button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-full border text-sm">Print packing list</button>
              <Link href="/simulator" className="px-4 py-2 rounded-full border text-sm">Open chat context</Link>
            </div>

            <div className="bg-white border border-dashed rounded-lg p-3">
              <p className="text-sm font-semibold">Packing list (print view)</p>
              <div className="mt-2 text-xs border rounded overflow-hidden">
                <div className="bg-plum text-cream px-3 py-2 flex justify-between"><span>{selected.reference}</span><span>{selected.customer.name}</span></div>
                <table className="w-full text-xs">
                  <thead className="bg-cream-paper"><tr><th className="text-left px-2 py-1">SKU</th><th className="text-left px-2 py-1">Item</th><th className="text-right px-2 py-1">Qty</th></tr></thead>
                  <tbody>{selected.items.map((it) => <tr key={it.sku} className="border-t"><td className="px-2 py-1 font-mono">{it.sku}</td><td className="px-2 py-1">{it.familyName} — {it.variantName}</td><td className="px-2 py-1 text-right">{it.qty}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
