"use client";
import { useState } from "react";
import { formatNGN } from "@/lib/format";

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "result">("form");
  const [error, setError] = useState<string | null>(null);

  function requestOtp() {
    if (!ref || !phone) { setError("Enter reference and phone"); return; }
    setError(null);
    setStep("otp");
  }
  function verify() {
    if (otp !== "1234") { setError("Invalid OTP. Use 1234 (3 tries, 10 min)."); return; }
    setStep("result");
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10">
      <h1 className="font-serif text-2xl">Track order</h1>
      <p className="text-sm text-ink-muted mt-1">OTP flow — code is sent via SMS/WhatsApp and expires 10m.</p>

      <div className="mt-6 bg-white rounded-xl border border-border p-6">
        {step === "form" && (
          <div className="space-y-4">
            <label className="block"><span className="text-sm font-medium">Order reference</span><input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="JMNG-2026-ABC123" className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm" /></label>
            <label className="block"><span className="text-sm font-medium">Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080..." className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm" /></label>
            {error && <p className="text-sm text-danger bg-danger-bg border border-danger/20 px-3 py-2 rounded-full">{error}</p>}
            <button onClick={requestOtp} className="w-full bg-plum text-cream rounded-full py-3 font-semibold">Send OTP</button>
            <p className="text-xs text-ink-faint text-center">OTP is <b>1234</b>. Without OTP, order status is never revealed.</p>
          </div>
        )}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm">OTP sent to {phone} (use 1234).</p>
            <label className="block"><span className="text-sm font-medium">OTP</span><input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" className="mt-1 w-full border border-border rounded-lg px-3 py-2.5 text-sm tracking-widest" /></label>
            {error && <p className="text-sm text-danger bg-danger-bg border border-danger/20 px-3 py-2 rounded-full">{error}</p>}
            <button onClick={verify} className="w-full bg-plum text-cream rounded-full py-3 font-semibold">Verify & Show Status</button>
            <button onClick={() => setStep("form")} className="w-full text-sm underline">Back</button>
          </div>
        )}
        {step === "result" && (
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" /><span className="text-sm font-semibold text-success">Paid — Processing</span><span className="ml-auto text-xs bg-cream-paper border px-2 py-1 rounded-full">{ref.toUpperCase() || "JMNG-2026-MOCK01"}</span>
            </div>
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span className="font-semibold">{formatNGN(14400)}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Delivery</span><span className="font-semibold">{formatNGN(2000)}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total (verified)</span><span>{formatNGN(16400)}</span></div>
            </div>
            <div className="mt-4 bg-cream-paper border border-border rounded-lg p-3 text-xs">Status history: pending_payment → paid (Paystack ✓) → processing. Next: packed → shipped → delivered. Every transition logged with actor.</div>
            <button onClick={() => { setStep("form"); setOtp(""); setRef(""); setPhone(""); }} className="mt-4 w-full bg-white border border-border rounded-full py-2.5 text-sm">Check another order</button>
          </div>
        )}
      </div>
    </div>
  );
}
