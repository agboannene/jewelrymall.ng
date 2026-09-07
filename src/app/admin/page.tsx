import { MOCK_ORDERS, MOCK_LEDGER } from "@/lib/admin";
import { CATALOG } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import Link from "next/link";

export default function AdminOverview() {
  const totalRevenue = MOCK_ORDERS.filter((o) => ["paid", "processing", "packed", "shipped", "delivered"].includes(o.status)).reduce((a, b) => a + b.total, 0);
  const paidCount = MOCK_ORDERS.filter((o) => o.status !== "pending_payment" && o.status !== "cancelled").length;
  const lowStock = CATALOG.flatMap((p) => p.variants.filter((v) => v.stock > 0 && v.stock <= v.lowStockAt));
  const oos = CATALOG.flatMap((p) => p.variants.filter((v) => v.stock === 0));
  const byChannel = MOCK_ORDERS.reduce((acc, o) => { acc[o.channel] = (acc[o.channel] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl">Dashboard</h1>
        <span className="text-xs bg-blush-pale border border-blush px-3 py-1.5 rounded-full">Mock data • Same shape as Postgres/R2 prod</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Revenue (mock paid)</p>
          <p className="text-2xl font-bold text-price mt-1">{formatNGN(totalRevenue)}</p>
          <p className="text-xs text-ink-muted mt-1">{paidCount} orders • AOV {formatNGN(Math.round(totalRevenue / Math.max(1, paidCount)))}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Orders (all)</p>
          <p className="text-2xl font-bold mt-1">{MOCK_ORDERS.length}</p>
          <p className="text-xs text-ink-muted mt-1">{MOCK_ORDERS.filter((o) => o.status === "pending_payment").length} pending payment</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Low stock</p>
          <p className="text-2xl font-bold text-warning">{lowStock.length}</p>
          <Link href="/admin/inventory" className="text-xs underline text-plum">View ledger →</Link>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Out of stock</p>
          <p className="text-2xl font-bold text-danger">{oos.length}</p>
          <p className="text-xs text-ink-muted">e.g. {oos[0]?.sku}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-semibold">Recent orders</p>
            <Link href="/admin/orders" className="text-sm text-plum underline">View all</Link>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-paper text-label text-ink-muted">
                <tr><th className="text-left px-4 py-2">Ref</th><th className="text-left px-4 py-2">Customer</th><th className="text-left px-4 py-2">Total</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Channel</th></tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-t hover:bg-cream">
                    <td className="px-4 py-2 font-mono text-xs">{o.reference}</td>
                    <td className="px-4 py-2">{o.customer.name}<span className="text-ink-muted"> • {o.customer.phone}</span></td>
                    <td className="px-4 py-2 font-semibold text-price">{formatNGN(o.total)}</td>
                    <td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === "paid" || o.status === "processing" ? "bg-success-bg text-success" : o.status === "pending_payment" ? "bg-warning-bg text-warning" : "bg-cream-paper border"}`}>{o.status}</span></td>
                    <td className="px-4 py-2 text-xs">{o.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="font-semibold text-sm">Channel attribution (mock)</p>
            <div className="mt-3 space-y-2 text-sm">
              {Object.entries(byChannel).map(([ch, n]) => (
                <div key={ch} className="flex justify-between"><span className="capitalize text-ink-muted">{ch}</span><span className="font-semibold">{n}</span></div>
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-3">Prod: UTM + wa.me → Order.attribution (PRD §11)</p>
          </div>
          <div className="bg-plum text-cream rounded-xl p-5">
            <p className="font-semibold text-sm">Low-stock alerts (mock)</p>
            {lowStock.length === 0 ? <p className="text-sm text-cream/60 mt-2">All good.</p> : (
              <ul className="mt-2 space-y-1 text-sm text-cream/90">
                {lowStock.slice(0, 4).map((v) => <li key={v.id}>• {v.sku} — {v.stock} left (≤ {v.lowStockAt})</li>)}
              </ul>
            )}
            <Link href="/admin/inventory" className="inline-block mt-3 text-xs bg-gold text-plum px-3 py-1.5 rounded-full font-semibold">Open ledger</Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <p className="font-semibold">What this dashboard proves (PRD §10)</p>
        <ul className="mt-2 text-sm text-ink-muted list-disc pl-5 space-y-1">
          <li>Products: family → variant → pack → tier CRUD (next page).</li>
          <li>Orders: list, detail, status timeline, payment verify, packing list.</li>
          <li>Inventory: ledger (never direct stock edit), low-stock warnings.</li>
          <li>Handoff: WhatsApp inbox (simulator link) — not mocked as table yet.</li>
        </ul>
      </div>
    </div>
  );
}
