import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminUserNav from "@/components/AdminUserNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      <aside className="hidden lg:flex w-[256px] shrink-0 bg-[#1A0A1A] text-cream flex-col">
        <div className="h-14 flex items-center px-5 border-b border-white/10 shrink-0">
          <span className="font-serif font-semibold tracking-wide">JMNG ADMIN</span>
          <span className="ml-2 text-xs bg-gold text-plum px-2 py-1 rounded-full font-bold">MOCK</span>
        </div>
        <nav className="p-3 space-y-1 text-sm flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-cream">📊 Overview</Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">💎 Products</Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">📦 Orders</Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">📒 Inventory / Ledger</Link>
          <Link href="/simulator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">💬 WhatsApp Inbox</Link>
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-cream/70">← Back to Store</Link>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10 text-xs text-cream/60">
          <p>Mock RBAC: Owner (you) • All perms</p>
          <p className="mt-1">Prod: Owner/Manager/Staff/Viewer (PRD §10.1)</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 bg-cream min-h-full">
        <div className="h-10 bg-white border-b flex items-center justify-end px-4 gap-3 sticky top-14 z-20 lg:static">
          <AdminUserNav />
        </div>
        {/* Mobile admin nav */}
        <div className="lg:hidden flex gap-2 p-3 overflow-auto border-b bg-white">
          <Link href="/admin" className="px-3 py-1.5 rounded-full bg-plum text-cream text-sm shrink-0">Overview</Link>
          <Link href="/admin/products" className="px-3 py-1.5 rounded-full bg-white border text-sm shrink-0">Products</Link>
          <Link href="/admin/orders" className="px-3 py-1.5 rounded-full bg-white border text-sm shrink-0">Orders</Link>
          <Link href="/admin/inventory" className="px-3 py-1.5 rounded-full bg-white border text-sm shrink-0">Ledger</Link>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Login page is unguarded, others guarded */}
          {children}
        </div>
      </div>
    </div>
  );
}
