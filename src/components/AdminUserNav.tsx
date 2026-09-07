"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUserNav() {
  const { data: session, isPending } = authClient.useSession();
  const [hasDemo, setHasDemo] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    setHasDemo(document.cookie.includes("demo-admin=true"));
  }, [pathname]);

  if (isLogin) return null;

  if (isPending) return <span className="text-xs text-ink-muted">Checking session…</span>;
  const isAuthed = !!session || hasDemo;
  if (!isAuthed) {
    return <Link href="/admin/login" className="text-sm bg-plum text-cream px-4 py-1.5 rounded-full">Sign in</Link>;
  }
  const email = session?.user?.email || (hasDemo ? "admin@jewelrymallng.com" : "");
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm hidden sm:block text-ink-muted">{email}</span>
      <button
        onClick={async () => {
          await authClient.signOut().catch(() => {});
          document.cookie = "demo-admin=; Max-Age=0; path=/";
          document.cookie = "demo-admin-email=; Max-Age=0; path=/";
          router.push("/admin/login");
          router.refresh();
        }}
        className="text-sm border px-3 py-1.5 rounded-full hover:border-plum bg-white"
      >
        Sign out
      </button>
    </div>
  );
}
