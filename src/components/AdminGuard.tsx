"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/admin/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="grid place-items-center py-20">
        <div className="text-sm text-ink-muted">Checking session…</div>
      </div>
    );
  }
  if (!session) return null;
  return <>{children}</>;
}
