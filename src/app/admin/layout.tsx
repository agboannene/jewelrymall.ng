import Link from "next/link";
import AdminUserNav from "@/components/AdminUserNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      <aside className="hidden lg:flex w-[256px] shrink-0 bg-[#1A0A1A] text-cream flex-col">
        <div className="h-14 flex items-center px-5 border-b border-white/10 shrink-0">
          <span className="font-serif font-semibold tracking-wide text-sm">JEWELRYMALL</span>
          <span className="ml-1.5 text-[11px] tracking-[0.12em] text-cream/60">ADMIN</span>
        </div>
        <nav className="p-3 space-y-1 text-[13px] flex-1">
          <Link href="/admin" className="flex items-center px-3 py-2 rounded-lg bg-white/10 text-cream">Overview</Link>
          <Link href="/admin/products" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Products • Price</Link>
          <Link href="/admin/orders" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Orders • Payments</Link>
          <Link href="/admin/inventory" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Stock • Ledger</Link>
          <Link href="/admin/customers" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Customers</Link>
          <Link href="/admin/conversations" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Conversations</Link>
          <Link href="/admin/staff" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Staff Access</Link>
          <Link href="/admin/reports" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/85 hover:text-cream">Reports</Link>
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link href="/" className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 text-cream/60 text-sm">← Back to Store</Link>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10 text-xs text-cream/50 leading-5">
          Signed in as Admin
        </div>
      </aside>

      <div className="flex-1 min-w-0 bg-cream min-h-full overflow-hidden">
        <div className="h-10 bg-white border-b flex items-center justify-end px-3 sm:px-4 gap-3 sticky top-14 z-20 lg:static">
          <AdminUserNav />
        </div>
        <div className="lg:hidden border-b bg-white">
          <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory">
            <Link href="/admin" className="px-3 py-1.5 rounded-full bg-plum text-cream text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Overview</Link>
            <Link href="/admin/products" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Products</Link>
            <Link href="/admin/orders" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Orders</Link>
            <Link href="/admin/inventory" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Stock</Link>
            <Link href="/admin/customers" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Customers</Link>
            <Link href="/admin/conversations" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Chats</Link>
            <Link href="/admin/staff" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Staff</Link>
            <Link href="/admin/reports" className="px-3 py-1.5 rounded-full bg-white border text-xs sm:text-sm shrink-0 snap-start whitespace-nowrap">Reports</Link>
          </div>
        </div>
        <div className="p-3 sm:p-4 lg:p-8 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
