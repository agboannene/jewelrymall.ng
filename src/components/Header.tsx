"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { count, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-30 bg-plum text-cream shadow-[0_2px_12px_rgba(43,15,43,0.22)]">
      <div className="mx-auto max-w-[1280px] px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center gap-2 sm:gap-4 min-w-0">
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gold text-plum flex items-center justify-center font-serif font-bold text-sm shrink-0">JM</div>
          <span className="font-serif font-semibold tracking-wide text-[17px] hidden sm:block truncate">JEWELRYMALL<span className="bg-cream text-plum px-1.5 py-0.5 rounded ml-1 text-xs font-sans font-bold">NG</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm text-cream/90">
          <Link href="/?cat=earrings" className="hover:text-gold">Earrings</Link>
          <Link href="/?cat=necklaces" className="hover:text-gold">Necklaces</Link>
          <Link href="/?cat=bracelets" className="hover:text-gold">Bracelets</Link>
          <Link href="/?cat=sets" className="hover:text-gold">Sets</Link>
          <Link href="/simulator" className="hover:text-gold">WhatsApp Simulator</Link>
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/?q=${encodeURIComponent(q)}`;
          }}
          className="flex-1 max-w-md ml-auto flex items-center bg-white rounded-full px-3 py-1.5 gap-2 hidden sm:flex"
        >
          <Search className="w-4 h-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search studs, hoops, sets, packs..." className="flex-1 outline-none text-sm text-ink placeholder:text-ink-faint bg-transparent" />
        </form>

        <button onClick={() => setDrawerOpen(true)} aria-label="Open cart" className="relative ml-auto sm:ml-2 bg-cream text-plum rounded-full p-2 sm:p-2.5 hover:bg-white transition shrink-0">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          {count > 0 && <span className="absolute -top-1 -right-1 bg-gold text-plum text-[10px] sm:text-[11px] font-bold w-5 h-5 rounded-full grid place-items-center border-2 border-plum">{count}</span>}
        </button>

        <button className="lg:hidden p-1.5 sm:p-2 shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-plum-dusk px-4 py-3 flex flex-col gap-3 text-sm">
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/?q=${encodeURIComponent(q)}`; }} className="flex items-center bg-white rounded-full px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-ink-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="flex-1 outline-none text-sm text-ink bg-transparent" />
          </form>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/?cat=earrings" onClick={() => setMobileOpen(false)}>Earrings</Link>
            <Link href="/?cat=necklaces" onClick={() => setMobileOpen(false)}>Necklaces</Link>
            <Link href="/?cat=bracelets" onClick={() => setMobileOpen(false)}>Bracelets</Link>
            <Link href="/?cat=sets" onClick={() => setMobileOpen(false)}>Sets</Link>
            <Link href="/simulator" onClick={() => setMobileOpen(false)} className="text-gold">WhatsApp Simulator →</Link>
          </div>
        </div>
      )}
    </header>
  );
}
