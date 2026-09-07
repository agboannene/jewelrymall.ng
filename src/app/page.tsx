import { CATALOG, searchCatalog } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";
  const cat = params.cat || "";
  let products = q ? searchCatalog(q) : CATALOG;
  if (cat) products = products.filter((p) => p.category === cat);

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream-paper border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <span className="inline-flex bg-blush-pale text-plum border border-blush px-3 py-1 rounded-full text-xs font-semibold tracking-wide">MOCK-FIRST DEMO • 15 SYNTHETIC PRODUCTS</span>
            <h1 className="font-serif text-[32px] lg:text-[48px] leading-none mt-4">Shine Clearly.</h1>
            <p className="text-ink-muted mt-3 text-[16px] leading-7 max-w-[52ch]">Nigeria&apos;s jewelry mall — every colour, pack, and quantity price shown upfront. Retail from 1 pc, wholesale packs up to 50. Verified payments, real stock, WhatsApp close.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="#catalog" className="bg-plum text-cream px-6 py-3 rounded-full font-semibold hover:bg-plum-light">Shop New In →</Link>
              <Link href="/simulator" className="bg-white border border-border px-6 py-3 rounded-full font-semibold hover:border-plum/30">Try WhatsApp AI Simulator</Link>
            </div>
            <div className="flex gap-4 mt-6 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Real stock ledger</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Paystack test verified</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Tier pricing</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CATALOG.slice(0, 6).map((p) => (
              <div key={p.id} className="rounded-xl overflow-hidden border border-border bg-white shadow-card aspect-square">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div id="catalog" className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className={`px-4 py-2 rounded-full text-sm border ${!cat ? "bg-plum text-cream border-plum" : "bg-white border-border hover:border-plum/30"}`}>All ({CATALOG.length})</Link>
          {["earrings", "necklaces", "bracelets", "sets", "rings"].map((c) => (
            <Link key={c} href={`/?cat=${c}`} className={`px-4 py-2 rounded-full text-sm border capitalize ${cat === c ? "bg-plum text-cream border-plum" : "bg-white border-border hover:border-plum/30"}`}>{c}</Link>
          ))}
          {q && <span className="ml-2 text-sm text-ink-muted">Search: &ldquo;{q}&rdquo; — {products.length} results • <Link href="/" className="underline text-plum">Clear</Link></span>}
        </div>

        {products.length === 0 ? (
          <p className="text-center py-16 text-ink-muted">No matches for &ldquo;{q}&rdquo;. Try &ldquo;pearl&rdquo; or &ldquo;gold&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}

        <div className="mt-10 bg-white rounded-xl border border-border p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-serif text-lg">Wholesale? We speak your language.</p>
            <p className="text-sm text-ink-muted mt-1">MOQ enforced, mixed packs validated, wholesale tier auto-applied at 12+, 20+, 30+.</p>
          </div>
          <Link href="/simulator" className="shrink-0 bg-blush-pale border border-blush text-plum px-5 py-2.5 rounded-full text-sm font-semibold">Ask WhatsApp AI: &ldquo;Show pearl packs under ₦1,200&rdquo;</Link>
        </div>
      </div>
    </div>
  );
}
