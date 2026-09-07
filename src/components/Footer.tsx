import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-plum-dusk text-cream mt-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold text-plum grid place-items-center font-serif font-bold text-sm">JM</div>
            <span className="font-serif font-semibold">JEWELRYMALL NG</span>
          </div>
          <p className="text-sm text-cream/70 mt-3 leading-6">Shine Clearly. Retail & wholesale jewelry — correct price, real stock, kind help on WhatsApp.</p>
          <p className="text-xs text-cream/50 mt-4">© 2026 JewelryMallNG. Mock store for demo — prices in NGN.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-3">Shop</p>
          <ul className="space-y-2 text-cream/70">
            <li><Link href="/?cat=earrings" className="hover:text-gold">Earrings</Link></li>
            <li><Link href="/?cat=necklaces" className="hover:text-gold">Necklaces</Link></li>
            <li><Link href="/?cat=bracelets" className="hover:text-gold">Bracelets</Link></li>
            <li><Link href="/?cat=sets" className="hover:text-gold">Sets</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-3">Help</p>
          <ul className="space-y-2 text-cream/70">
            <li><Link href="/track" className="hover:text-gold">Track Order (OTP demo)</Link></li>
            <li><Link href="/simulator" className="hover:text-gold">WhatsApp Simulator</Link></li>
            <li><span className="opacity-60">Pay securely via Paystack (test mode)</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
