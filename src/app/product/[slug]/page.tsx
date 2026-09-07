"use client";
import { useState, use } from "react";
import { CATALOG } from "@/lib/catalog";
import { notFound } from "next/navigation";
import ProductBuyBox from "@/components/ProductBuyBox";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const family = CATALOG.find((p) => p.slug === slug);
  if (!family) notFound();

  const [activeVariantId, setActiveVariantId] = useState(family.variants[0]?.id);
  const [activeImage, setActiveImage] = useState(family.images[0]);

  const activeVariant = family.variants.find((v) => v.id === activeVariantId) || family.variants[0];

  const handleVariantChange = (vid: string) => {
    setActiveVariantId(vid);
    const v = family.variants.find((x) => x.id === vid);
    if (v) setActiveImage(v.image.replace("w=400", "w=800"));
  };

  const handleThumb = (img: string) => setActiveImage(img);

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
      <nav className="text-xs text-ink-muted mb-4">
        <a href="/" className="hover:text-plum">Home</a> / <a href={`/?cat=${family.category}`} className="hover:text-plum capitalize">{family.category}</a> / <span className="text-plum font-medium">{family.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Gallery — variant-aware */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-paper border border-border">
            {/* eslint-disable @next/next/no-img-element */}
            <img src={activeImage} alt={family.name} className="w-full h-full object-cover transition" />
            <p className="text-xs text-center py-1 bg-white/80 backdrop-blur">Showing: {activeVariant.name}</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {family.images.map((img: string, i: number) => (
              <button key={i} onClick={() => handleThumb(img)} className={`aspect-square rounded-lg overflow-hidden border ${activeImage === img ? "border-plum ring-2 ring-plum/20" : "border-border"} bg-white`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {family.variants.map((v) => (
              <button key={v.id} onClick={() => handleVariantChange(v.id)} className={`aspect-square rounded-lg overflow-hidden border ${activeVariantId === v.id ? "border-plum ring-2 ring-plum/20" : "border-border"} relative`}>
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                <span className={`absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeVariantId === v.id ? "bg-plum text-cream" : "bg-white/90"}`}>{v.attributes.colour}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-muted text-center">Tap a colour/finish below or on the right — image updates to match.</p>
        </div>

        <ProductBuyBox family={family} variantId={activeVariantId} onVariantChange={handleVariantChange} />
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
