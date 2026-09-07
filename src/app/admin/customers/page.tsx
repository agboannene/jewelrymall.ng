"use client";
import { MOCK_ORDERS } from "@/lib/admin";
import { formatNGN } from "@/lib/format";
import { useState } from "react";

type Customer = { name: string; phone: string; orders: typeof MOCK_ORDERS; total: number };

export default function AdminCustomersPage() {
  const map = new Map<string, Customer>();
  MOCK_ORDERS.forEach((o) => {
    const key = o.customer.phone;
    if (!map.has(key)) map.set(key, { name: o.customer.name, phone: o.customer.phone, orders: [], total: 0 });
    const c = map.get(key)!;
    c.orders.push(o);
    c.total += o.total;
  });
  const customers = Array.from(map.values()).sort((a, b) => b.total - a.total);
  const [selected, setSelected] = useState<Customer | null>(customers[0] || null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Customers</h1>
        <span className="text-xs bg-cream-paper border px-3 py-1.5 rounded-full">{customers.length} customers • {MOCK_ORDERS.length} orders</span>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden self-start">
          <div className="p-3 border-b bg-cream-paper">
            <p className="text-sm font-semibold">All customers</p>
            <p className="text-xs text-ink-muted">Tap to view orders & lifetime value</p>
          </div>
          <div className="divide-y">
            {customers.map((c) => (
              <button key={c.phone} onClick={() => setSelected(c)} className={`w-full text-left p-3 hover:bg-cream flex justify-between gap-2 ${selected?.phone === c.phone ? "bg-cream-paper" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.phone} • {c.orders.length} order{c.orders.length > 1 ? "s" : ""}</p>
                </div>
                <span className="text-sm font-bold text-price">{formatNGN(c.total)}</span>
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold">{selected.name}</h2>
            <p className="text-sm text-ink-muted">{selected.phone} • Lifetime {formatNGN(selected.total)} • {selected.orders.length} orders</p>
            <div className="mt-4 space-y-3">
              {selected.orders.map((o) => (
                <div key={o.id} className="border border-border rounded-lg p-3 flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-mono">{o.reference} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${o.status === "paid" ? "bg-success-bg text-success" : "bg-cream-paper border"}`}>{o.status}</span></p>
                    <p className="text-xs text-ink-muted">{new Date(o.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })} • {o.channel}</p>
                    <p className="text-xs mt-1">{o.items.map((i) => `${i.familyName} ×${i.qty}`).join(", ")}</p>
                  </div>
                  <span className="font-bold text-sm text-price">{formatNGN(o.total)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => alert(`WhatsApp ${selected.phone}`)} className="px-4 py-2 rounded-full bg-plum text-cream text-sm">Message on WhatsApp</button>
              <button onClick={() => alert("Customer note saved")} className="px-4 py-2 rounded-full border text-sm">Add note</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border p-10 text-center text-ink-muted">Select a customer</div>
        )}
      </div>
    </div>
  );
}
