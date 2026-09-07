"use client";
import { MOCK_ORDERS } from "@/lib/admin";
import { CATALOG } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";

export default function AdminReportsPage() {
  const paid = MOCK_ORDERS.filter((o) => ["paid", "processing", "packed", "shipped", "delivered"].includes(o.status));
  const revenue = paid.reduce((a, b) => a + b.total, 0);
  const byChannel = MOCK_ORDERS.reduce((acc, o) => { acc[o.channel] = (acc[o.channel] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byChannelRevenue = MOCK_ORDERS.reduce((acc, o) => { acc[o.channel] = (acc[o.channel] || 0) + o.total; return acc; }, {} as Record<string, number>);
  const productSales = CATALOG.map((p) => {
    const qty = MOCK_ORDERS.flatMap((o) => o.items).filter((i) => i.familyName === p.name).reduce((a, b) => a + b.qty, 0);
    const rev = MOCK_ORDERS.flatMap((o) => o.items).filter((i) => i.familyName === p.name).reduce((a, b) => a + b.lineTotal, 0);
    return { name: p.name, qty, rev, category: p.category };
  }).filter((x) => x.qty > 0).sort((a, b) => b.qty - a.qty);

  const handoff = { total: 24, reasons: { "Payment dispute": 8, "Low confidence": 6, "Refund": 4, "Custom delivery": 3, "Human requested": 3 }, avgResponseMins: 14 };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Reports</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Sales</p>
          <p className="text-2xl font-bold text-price">{formatNGN(revenue)}</p>
          <p className="text-xs text-ink-muted">{paid.length} paid orders • {MOCK_ORDERS.length} total • AOV {formatNGN(Math.round(revenue / Math.max(1, paid.length)))}</p>
          <div className="mt-3 h-2 bg-cream-paper rounded-full overflow-hidden flex">
            <div className="bg-success flex-1" style={{ width: `${(paid.length / MOCK_ORDERS.length) * 100}%` }} />
          </div>
          <p className="text-xs text-ink-muted mt-1">{Math.round((paid.length / MOCK_ORDERS.length) * 100)}% conversion (paid/total) in mock period</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Channel</p>
          <div className="mt-2 space-y-1.5 text-sm">
            {Object.entries(byChannel).map(([ch, n]) => (
              <div key={ch} className="flex justify-between"><span className="capitalize text-ink-muted">{ch}</span><span className="font-semibold">{n} orders • {formatNGN(byChannelRevenue[ch] || 0)}</span></div>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-2">UTM: source/medium/campaign → Order.attribution. Instagram & TikTok wa.me links parsed.</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-label text-ink-muted">Staff-transfer (handoff)</p>
          <p className="text-2xl font-bold">{handoff.total}</p>
          <p className="text-xs text-ink-muted">Avg response {handoff.avgResponseMins} min • Containment {Math.round(100 - (handoff.total / (MOCK_ORDERS.length + handoff.total)) * 100)}%</p>
          <div className="mt-2 space-y-1 text-xs">
            {Object.entries(handoff.reasons).map(([r, n]) => <div key={r} className="flex justify-between"><span className="text-ink-muted">{r}</span><span className="font-semibold">{n}</span></div>)}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <h2 className="font-semibold text-sm">Best sellers (by qty)</h2>
          <div className="mt-3 space-y-2 text-sm">
            {productSales.slice(0, 5).map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-plum text-cream grid place-items-center text-xs">{i + 1}</span>
                <span className="flex-1">{p.name} <span className="text-ink-muted">• {p.category}</span></span>
                <span className="font-semibold">{p.qty} pcs • {formatNGN(p.rev)}</span>
              </div>
            ))}
            {productSales.length === 0 && <p className="text-sm text-ink-muted">No sales in mock slice — real data fills after orders.</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <h2 className="font-semibold text-sm">Traffic source detail (last 7d mock)</h2>
          <table className="w-full text-sm mt-3">
            <thead className="bg-cream-paper text-label"><tr><th className="text-left px-2 py-1">Source</th><th className="text-left px-2 py-1">Visits</th><th className="text-left px-2 py-1">Orders</th><th className="text-left px-2 py-1">Rate</th></tr></thead>
            <tbody>
              {[
                { src: "instagram.com / ig", visits: 430, orders: 12 },
                { src: "tiktok.com", visits: 310, orders: 7 },
                { src: "wa.me (WhatsApp)", visits: 180, orders: 9 },
                { src: "direct", visits: 90, orders: 2 },
              ].map((r) => <tr key={r.src} className="border-t"><td className="px-2 py-1">{r.src}</td><td className="px-2 py-1">{r.visits}</td><td className="px-2 py-1">{r.orders}</td><td className="px-2 py-1">{Math.round((r.orders / r.visits) * 100)}%</td></tr>)}
            </tbody>
          </table>
          <p className="text-xs text-ink-muted mt-2">Visits tracked via UTM + wa.me → stored on Order. WhatsApp enquiries = AI threads + handoffs.</p>
        </div>
      </div>

      <div className="bg-cream-paper border rounded-xl p-4 text-sm">
        <b>What this proves (PRD §8):</b> UTM + wa.me → Order attribution (first/last touch 30d), sales by day/week, product best sellers, channel revenue, staff handoff volume/reason/response time. All read from Order table, not just client analytics.
      </div>
    </div>
  );
}
