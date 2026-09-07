"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jewelrymallng.com");
  const [password, setPassword] = useState("Admin123!");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({ email, password, name: "Admin" });
        if (error) throw new Error(error.message || "Sign up failed");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message || "Sign in failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center bg-cream p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="bg-plum text-cream p-7 text-center">
          <div className="w-11 h-11 rounded-xl bg-gold text-plum grid place-items-center mx-auto font-serif font-bold text-[13px]">JM</div>
          <h1 className="font-serif text-[22px] mt-3 tracking-tight">Welcome back</h1>
          <p className="text-sm text-cream/70 mt-1">Sign in to manage your mall</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-cream-paper rounded-full border">
            <button type="button" onClick={() => setMode("signin")} className={`flex-1 py-2 rounded-full text-sm font-semibold ${mode === "signin" ? "bg-plum text-cream shadow" : "text-ink-muted"}`}>Sign in</button>
            <button type="button" onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-full text-sm font-semibold ${mode === "signup" ? "bg-plum text-cream shadow" : "text-ink-muted"}`}>Create account</button>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@jewelrymallng.com" className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:border-plum outline-none" />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <div className="relative mt-1">
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••" className="w-full border border-border rounded-lg px-3 py-2.5 pr-10 text-sm focus:border-plum outline-none" />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-faint hover:text-plum">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-xs text-ink-muted mt-1 block">Min 8 chars.</span>
          </label>

          {error && <p className="text-sm text-danger bg-danger-bg border border-danger/20 px-3 py-2 rounded-lg">{error}</p>}

          <button disabled={loading} type="submit" className="w-full bg-plum text-cream rounded-full py-3 font-semibold hover:bg-plum-light disabled:opacity-50">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in →" : "Create account →"}
          </button>

          <Link href="/" className="block text-center text-sm underline text-ink-muted">← Back to store</Link>
        </form>
      </div>
    </div>
  );
}
