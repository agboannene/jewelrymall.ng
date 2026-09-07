"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminUserNav() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <Link href="/admin/login" className="text-sm text-plum font-semibold">Better Auth • Email+Password</Link>;

  if (isPending) return <span className="text-xs text-ink-muted">Checking session…</span>;
  if (!session) {
    return <Link href="/admin/login" className="text-sm bg-plum text-cream px-4 py-1.5 rounded-full">Sign in</Link>;
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm hidden sm:block">{session.user.email} <span className="text-ink-muted">• {session.user.role || "admin"}</span></span>
      <button
        onClick={async () => {
          await authClient.signOut();
          router.push("/admin/login");
          router.refresh();
        }}
        className="text-sm border px-3 py-1.5 rounded-full hover:border-plum"
      >
        Sign out
      </button>
    </div>
  );
}
