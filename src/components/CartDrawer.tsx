"use client";
import { useCart } from "@/lib/cart";
import { formatNGN } from "@/lib/format";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { lines, removeLine, updateQty, subtotal, count, isDrawerOpen, setDrawerOpen, clear } = useCart();
  if (!isDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-plum/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="relative w-[420px] max-w-[92vw] bg-cream h-full flex flex-col shadow-lift">
        <div className="h-14 bg-plum text-cream flex items-center justify-between px-4 shrink-0">
          <span className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Your Bag ({count})</span>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-white border border-border grid place-items-center mx-auto mb-3">✨</div>
              <p className="font-serif text-lg">Your mall bag is empty</p>
              <p className="text-sm text-ink-muted mt-1">Add 6 beauties to unlock wholesale!</p>
              <button onClick={() => setDrawerOpen(false)} className="mt-4 bg-plum text-cream px-6 py-2.5 rounded-full text-sm">Shop New In</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {lines.map((l, i) => (
                <div key={i} className="bg-white rounded-lg border border-border p-3 flex gap-3">
                  <img src={l.image} alt="" className="w-16 h-16 rounded-md object-cover bg-cream-paper shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-4 line-clamp-2">{l.familyName}</p>
                    <p className="text-xs text-ink-muted">{l.variantName} • {l.packName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(i, l.qty - 1)} className="w-7 h-7 rounded-full border grid place-items-center hover:bg-cream"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-semibold w-6 text-center">{l.qty}</span>
                      <button onClick={() => updateQty(i, l.qty + 1)} className="w-7 h-7 rounded-full border grid place-items-center hover:bg-cream"><Plus className="w-3 h-3" /></button>
                      <span className="ml-auto text-price font-bold text-sm">{formatNGN(l.lineTotal)}</span>
                    </div>
                    <p className="text-xs text-ink-faint mt-1">{formatNGN(l.unitPrice)} /pc</p>
                  </div>
                  <button onClick={() => removeLine(i)} className="self-start p-1.5 hover:bg-danger-bg rounded-full text-ink-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={clear} className="text-xs text-ink-muted hover:text-danger underline">Clear all</button>
            </div>
            <div className="border-t bg-white p-4 space-y-3 shrink-0">
              <div className="flex justify-between text-sm"><span className="text-ink-muted">Subtotal</span><span className="font-semibold text-price">{formatNGN(subtotal)}</span></div>
              <p className="text-xs text-ink-muted">Delivery calculated at checkout. Pay securely via Paystack (test mode).</p>
              <Link href="/checkout" onClick={() => setDrawerOpen(false)} className="block text-center bg-plum text-cream rounded-full py-3 font-semibold hover:bg-plum-light">Checkout →</Link>
              <Link href="/simulator" onClick={() => setDrawerOpen(false)} className="block text-center text-sm text-ink-muted hover:text-plum underline">Chat on WhatsApp first?</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
