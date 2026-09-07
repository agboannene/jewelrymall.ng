import { CATALOG, getPrice, stockStatus } from "@/lib/catalog";
import { notFound } from "next/navigation";
import ProductBuyBox from "@/components/ProductBuyBox";

export function generateStaticParams() {
  return CATALOG.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let family = CATALOG.find((p) => p.slug === slug) as any;
  if (!family) {
    try {
      const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL || "";
      if (base) {
        const res = await fetch(`${base}/api/products`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          family = (data.products as any[]).find((p: any) => p.slug === slug);
        }
      }
    } catch {}
  }
  if (!family) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
      <nav className="text-xs text-ink-muted mb-4">
        <a href="/" className="hover:text-plum">Home</a> / <a href={`/?cat=${family.category}`} className="hover:text-plum capitalize">{family.category}</a> / <span className="text-plum font-medium">{family.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-paper border border-border">
            {/* eslint-disable @next/next/no-img-element */}
            <img src={family.images[0]} alt={family.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {family.images.map((img: string, i: number) => (
              <div key={i} className={`aspect-square rounded-lg overflow-hidden border ${i === 0 ? "border-plum" : "border-border"} bg-white`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {family.variants.slice(0, 2).map((v: any) => (
              <div key={v.id} className="aspect-square rounded-lg overflow-hidden border border-border">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <ProductBuyBox family={family} />
      </div>

      <div className="mt-10 bg-white rounded-xl border border-border p-6">
        <h2 className="font-serif text-lg">Why this shines</h2>
        <p className="text-sm text-ink-muted mt-2 leading-6">{family.description} — {family.material}. Ships from Lagos. 7-day exchange per policy. Prices in NGN, tabular.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-cream-paper border border-border px-3 py-1.5 rounded-full">✓ Verified stock</span>
          <span className="bg-cream-paper border border-border px-3 py-1.5 rounded-full">✓ Paystack verified</span>
          <span className="bg-cream-paper border border-border px-3 py-1.5 rounded-full">✓ WhatsApp support</span>
        </div>
      </div>
    </div>
  );
}
