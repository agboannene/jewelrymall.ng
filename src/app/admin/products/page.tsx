"use client";
import { CATALOG, ProductFamily } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import { useEffect, useState } from "react";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductFamily[]>(CATALOG);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ProductFamily["category"]>("earrings");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("Gold-plated");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80");
  const [tiers, setTiers] = useState<{ minQty: number; maxQty: number | null; price: number }[]>([
    { minQty: 1, maxQty: 11, price: 1800 },
    { minQty: 12, maxQty: null, price: 1200 },
  ]);
  const [variants, setVariants] = useState([{ sku: "SKU-001", name: "Gold", colour: "gold", finish: "gold", stock: 20, lowStockAt: 5, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" }]);
  const [packs, setPacks] = useState<Array<{ name: string; type: "single" | "mixed" | "fixed"; moq: number; size: number; description: string }>>([{ name: "Single", type: "single", moq: 1, size: 1, description: "Retail" }]);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => { if (d.products?.length) setProducts(d.products); }).catch(() => {});
  }, []);

  useEffect(() => { if (name && !slug) setSlug(slugify(name)); }, [name]);

  const filtered = products.filter((p) => !filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.slug.includes(filter.toLowerCase()));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        name,
        slug: slugify(slug || name),
        category,
        description,
        material,
        images: imageUrl.split(",").map((s) => s.trim()).filter(Boolean),
        variants: variants.map((v, i) => ({ id: `v-${Date.now()}-${i}`, sku: v.sku, name: v.name, attributes: { colour: v.colour, finish: v.finish }, stock: Number(v.stock), lowStockAt: Number(v.lowStockAt), image: v.image })),
        packs: packs.map((p, i) => ({ id: `pack-${Date.now()}-${i}`, name: p.name, type: p.type, moq: Number(p.moq), size: Number(p.size), description: p.description })),
        tiers: tiers.map((t) => ({ minQty: Number(t.minQty), maxQty: t.maxQty === null || (t.maxQty as any) === "" ? null : Number(t.maxQty), price: Number(t.price) })),
      };
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setProducts((prev) => [data.product, ...prev]);
      setShowForm(false);
      setMsg(`Created ${data.product.name} ✓ — now live in store`);
      // reset
      setName(""); setSlug(""); setDescription("");
      setTimeout(() => setMsg(null), 4000);
    } catch (err: any) {
      setMsg(err.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="font-serif text-2xl">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-plum text-cream px-5 py-2 rounded-full text-sm font-semibold">{showForm ? "Close" : "+ New family"}</button>
      </div>

      {msg && <div className="bg-plum text-cream px-4 py-3 rounded-xl text-sm text-center">{msg}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-5">
          <h2 className="font-serif text-lg">New Family — chic form</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="text-sm font-medium">Name *</span><input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Royal Bangle Set" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm" /></label>
            <label className="block"><span className="text-sm font-medium">Slug *</span><input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="royal-bangle-set" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm font-mono" /></label>
            <label className="block"><span className="text-sm font-medium">Category</span><select value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm"><option value="earrings">Earrings</option><option value="necklaces">Necklaces</option><option value="bracelets">Bracelets</option><option value="sets">Sets</option><option value="rings">Rings</option></select></label>
            <label className="block"><span className="text-sm font-medium">Material</span><input value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm" /></label>
          </div>
          <label className="block"><span className="text-sm font-medium">Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Everyday sparkle..." className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm" /></label>
          <label className="block"><span className="text-sm font-medium">Images (comma separated URLs)</span><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm" /></label>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between"><p className="font-semibold text-sm">Tiers — quantity prices *</p><button type="button" onClick={() => setTiers([...tiers, { minQty: 30, maxQty: null, price: 950 }])} className="text-xs border rounded-full px-3 py-1">+ Tier</button></div>
            {tiers.map((t, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mt-2">
                <input type="number" value={t.minQty} onChange={(e) => { const c = [...tiers]; c[i].minQty = Number(e.target.value); setTiers(c); }} placeholder="min" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input value={t.maxQty === null ? "" : t.maxQty} onChange={(e) => { const c = [...tiers]; c[i].maxQty = e.target.value === "" ? null : Number(e.target.value); setTiers(c); }} placeholder="max (empty=∞)" className="border rounded-lg px-2 py-1.5 text-sm" />
                <div className="flex gap-1"><input type="number" value={t.price} onChange={(e) => { const c = [...tiers]; c[i].price = Number(e.target.value); setTiers(c); }} placeholder="price" className="flex-1 border rounded-lg px-2 py-1.5 text-sm" /><button type="button" onClick={() => setTiers(tiers.filter((_, j) => j !== i))} className="text-xs px-2 border rounded-full">×</button></div>
              </div>
            ))}
            <p className="text-xs text-ink-muted mt-1">Must not overlap. Last tier max empty = ∞. Validation on server.</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between"><p className="font-semibold text-sm">Variants *</p><button type="button" onClick={() => setVariants([...variants, { sku: "SKU-00" + (variants.length + 1), name: "New", colour: "gold", finish: "gold", stock: 10, lowStockAt: 3, image: imageUrl.split(",")[0]?.trim() || "" }])} className="text-xs border rounded-full px-3 py-1">+ Variant</button></div>
            {variants.map((v, i) => (
              <div key={i} className="grid sm:grid-cols-6 gap-2 mt-2 items-end">
                <input value={v.sku} onChange={(e) => { const c = [...variants]; c[i].sku = e.target.value; setVariants(c); }} placeholder="SKU" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input value={v.name} onChange={(e) => { const c = [...variants]; c[i].name = e.target.value; setVariants(c); }} placeholder="Name" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input value={v.colour} onChange={(e) => { const c = [...variants]; c[i].colour = e.target.value; setVariants(c); }} placeholder="colour" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input type="number" value={v.stock} onChange={(e) => { const c = [...variants]; c[i].stock = Number(e.target.value); setVariants(c); }} placeholder="stock" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input value={v.image} onChange={(e) => { const c = [...variants]; c[i].image = e.target.value; setVariants(c); }} placeholder="image URL" className="border rounded-lg px-2 py-1.5 text-sm" />
                <button type="button" onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="text-xs border rounded-full px-2 py-1">Remove</button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between"><p className="font-semibold text-sm">Packs</p><button type="button" onClick={() => setPacks([...packs, { name: "Mixed 12", type: "mixed", moq: 12, size: 12, description: "Pick 12" }])} className="text-xs border rounded-full px-3 py-1">+ Pack</button></div>
            {packs.map((p, i) => (
              <div key={i} className="grid sm:grid-cols-5 gap-2 mt-2">
                <input value={p.name} onChange={(e) => { const c = [...packs]; c[i].name = e.target.value; setPacks(c); }} placeholder="Name" className="border rounded-lg px-2 py-1.5 text-sm" />
                <select value={p.type} onChange={(e) => { const c = [...packs]; c[i].type = e.target.value as any; setPacks(c); }} className="border rounded-lg px-2 py-1.5 text-sm"><option value="single">single</option><option value="mixed">mixed</option><option value="fixed">fixed</option></select>
                <input type="number" value={p.moq} onChange={(e) => { const c = [...packs]; c[i].moq = Number(e.target.value); setPacks(c); }} placeholder="MOQ" className="border rounded-lg px-2 py-1.5 text-sm" />
                <input type="number" value={p.size} onChange={(e) => { const c = [...packs]; c[i].size = Number(e.target.value); setPacks(c); }} placeholder="size" className="border rounded-lg px-2 py-1.5 text-sm" />
                <button type="button" onClick={() => setPacks(packs.filter((_, j) => j !== i))} className="text-xs border rounded-full px-2 py-1">Remove</button>
              </div>
            ))}
          </div>

          <button disabled={saving} type="submit" className="w-full bg-plum text-cream rounded-full py-3 font-semibold disabled:opacity-50">{saving ? "Saving…" : "Create family →"}</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search name or slug…" className="border border-border rounded-full px-4 py-2 text-sm flex-1 min-w-[220px]" />
        <span className="text-sm text-ink-muted">{filtered.length} families • {products.reduce((a, p) => a + p.variants.length, 0)} variants</span>
      </div>

      <div className="grid gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-4 flex gap-4">
              <img src={p.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover border shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-start">
                  <h2 className="font-semibold">{p.name}</h2>
                  <span className="text-xs bg-cream-paper border px-2 py-1 rounded-full capitalize">{p.category}</span>
                  {p.isNew && <span className="text-xs bg-blush-pale border border-blush px-2 py-1 rounded-full">NEW</span>}
                </div>
                <p className="text-sm text-ink-muted mt-1 line-clamp-2">{p.description} — {p.material}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tiers.map((t) => (
                    <span key={`${t.minQty}-${t.maxQty}`} className="text-xs bg-cream-paper border px-2 py-1 rounded-full">
                      {t.maxQty === null ? `${t.minQty}+` : `${t.minQty}–${t.maxQty}`}: <b className="text-price">{formatNGN(t.price)}</b>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.variants.map((v) => (
                    <span key={v.id} className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${v.stock === 0 ? "bg-danger-bg text-danger border-danger/20" : v.stock <= v.lowStockAt ? "bg-warning-bg text-warning border-warning/20" : "bg-success-bg text-success border-success/20"}`}>
                      <img src={v.image} alt="" className="w-4 h-4 rounded-full object-cover" />
                      {v.sku} • {v.stock} left
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.packs.map((pack) => <span key={pack.id} className="text-xs bg-white border px-2 py-1 rounded-full">{pack.name} • {pack.type} • MOQ {pack.moq}</span>)}
                </div>
              </div>
              <div className="hidden sm:flex flex-col gap-2 shrink-0">
                <button onClick={() => setMsg(`Edit ${p.slug} — coming next: pre-fill form`)} className="px-4 py-2 rounded-full border text-sm hover:border-plum">Edit</button>
                <button onClick={async () => { const c = { ...p, slug: `${p.slug}-copy`, name: `${p.name} Copy` }; const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); const d = await r.json(); if (r.ok) setProducts((prev) => [d.product, ...prev]); }} className="px-4 py-2 rounded-full border text-sm hover:border-plum">Duplicate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
