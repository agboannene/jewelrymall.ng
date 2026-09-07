"use client";
import { useCart } from "@/lib/cart";
import { formatNGN } from "@/lib/format";
import { useState } from "react";
import Link from "next/link";

const zones = [
  { id: "island", label: "Lagos Island", fee: 2500 },
  { id: "mainland", label: "Lagos Mainland", fee: 2000 },
  { id: "abuja", label: "Abuja", fee: 3500 },
  { id: "pickup", label: "Pickup (Ikeja) — Free", fee: 0 },
];

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [zone, setZone] = useState(zones[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paid, setPaid] = useState(false);
  const [ref, setRef] = useState("");

  const total = subtotal + zone.fee;

  const [paying, setPaying] = useState(false);
  async function handlePay() {
    if (!name || !phone) { alert("Enter name and phone"); return; }
    if (lines.length === 0) { alert("Bag is empty"); return; }
    setPaying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, address },
          zone,
          items: lines.map((l) => ({ sku: l.variantId, familyName: l.familyName, variantName: l.variantName, packName: l.packName, qty: l.qty, unitPrice: l.unitPrice, lineTotal: l.lineTotal, image: l.image, familySlug: l.familySlug })),
          subtotal,
          total,
          deliveryFee: zone.fee,
          channel: "direct",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      setRef(data.reference);
      setPaid(true);
    } catch (e: any) {
      alert(e.message || "Order failed");
    } finally {
      setPaying(false);
    }
  }

  if (paid) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-success-bg border border-success/20 grid place-items-center mx-auto text-2xl">✓</div>
        <h1 className="font-serif text-2xl mt-4">Payment verified (mock) ✓</h1>
        <p className="text-ink-muted mt-2">In production this waits for Paystack webhook & amount match. Here we simulated success.</p>
        <div className="mt-6 bg-white rounded-xl border border-border p-6 text-left">
          <p className="font-semibold">Order {ref}</p>
          <p className="text-sm text-ink-muted">{name} • {phone} • {zone.label}</p>
          <div className="mt-4 space-y-2 text-sm">
            {lines.map((l, i) => <div key={i} className="flex justify-between"><span>{l.familyName} × {l.qty} <span className="text-ink-muted">({formatNGN(l.unitPrice)}/pc)</span></span><span className="font-semibold">{formatNGN(l.lineTotal)}</span></div>)}
            <div className="flex justify-between text-ink-muted"><span>Subtotal</span><span className="font-semibold text-ink">{formatNGN(subtotal)}</span></div>
            <div className="flex justify-between text-ink-muted"><span>Delivery — {zone.label}</span><span className="font-semibold text-ink">{zone.fee === 0 ? "Free" : formatNGN(zone.fee)}</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-base"><span>Total paid</span><span>{formatNGN(total)}</span></div>
            <p className="text-xs text-ink-faint">Subtotal {formatNGN(subtotal)} + Delivery {formatNGN(zone.fee)} = {formatNGN(total)}</p>
          </div>
          <div className="mt-4 bg-cream-paper border border-border rounded-lg p-3 text-xs">
            Packing list generated • Stock ledger decremented (mock) • WhatsApp confirmation would be sent.
          </div>
        </div>
        <button onClick={() => { clear(); setPaid(false); }} className="mt-6 text-sm underline">Start new order</button>
        <Link href="/" className="ml-4 inline-block bg-plum text-cream px-6 py-2.5 rounded-full text-sm">Back to mall</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h1 className="font-serif text-xl">Checkout</h1>
        <p className="text-sm text-ink-muted mt-1">Mock Paystack test mode — no real money moved.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Okoro" className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Phone (for OTP + updates)</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080..." className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Delivery address</span>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, city" className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm h-20" />
          </label>

          <div>
            <p className="text-sm font-medium">Delivery zone</p>
            <div className="grid gap-2 mt-2">
              {zones.map((z) => (
                <label key={z.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${zone.id === z.id ? "border-plum bg-cream-paper" : "border-border"}`}>
                  <input type="radio" checked={zone.id === z.id} onChange={() => setZone(z)} className="accent-plum" />
                  <span className="flex-1 text-sm">{z.label}</span>
                  <span className="text-sm font-semibold">{z.fee === 0 ? "Free" : formatNGN(z.fee)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 self-start sticky top-20">
        <h2 className="font-semibold">Order summary</h2>
        {lines.length === 0 ? <p className="text-sm text-ink-muted mt-3">Bag empty — <Link href="/" className="underline text-plum">shop</Link></p> : (
          <div className="mt-3 space-y-2 text-sm">
            {lines.map((l, i) => (
              <div key={i} className="flex gap-3">
                <img src={l.image} alt="" className="w-12 h-12 rounded object-cover border" />
                <div className="flex-1">
                  <p className="leading-tight">{l.familyName}</p><p className="text-xs text-ink-muted">{l.variantName} • {l.packName} × {l.qty}</p>
                </div>
                <span className="font-semibold">{formatNGN(l.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-1.5">
              <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span className="font-semibold">{formatNGN(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Delivery ({zone.label})</span><span className="font-semibold">{formatNGN(zone.fee)}</span></div>
              <div className="flex justify-between text-base font-bold border-t pt-2"><span>Total</span><span>{formatNGN(total)}</span></div>
            </div>
            <button onClick={handlePay} disabled={paying} className="w-full mt-4 bg-plum text-cream rounded-full py-3 font-semibold hover:bg-plum-light disabled:opacity-50">{paying ? "Processing…" : `Pay with Paystack (Test) — ${formatNGN(total)}`}</button>
            <p className="text-xs text-ink-faint text-center mt-2">Test card 4084084084084081 • Verifies via mock webhook.</p>
          </div>
        )}
      </div>
    </div>
  );
}
