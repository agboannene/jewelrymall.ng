"use client";
import { useState } from "react";
import Link from "next/link";

type Thread = { id: string; customer: string; phone: string; last: string; status: "open" | "handoff" | "ai" | "closed"; reason?: string; messages: { from: "customer" | "ai" | "staff"; text: string; time: string }[] };

const THREADS: Thread[] = [
  {
    id: "t1",
    customer: "Ada Okoro",
    phone: "0803 123 4567",
    last: "Do you have pearl studs in silver?",
    status: "handoff",
    reason: "Payment dispute",
    messages: [
      { from: "customer", text: "Do you have pearl studs in silver? How much for 12?", time: "03:12" },
      { from: "ai", text: "From catalogue: White Pearl — Silver, 3 left (low) — Mixed 12 at ₦1,200/pc. Tap to view.", time: "03:12" },
      { from: "customer", text: "I paid but order still pending, I sent screenshot", time: "03:14" },
      { from: "ai", text: "Summary for staff: customer asks payment dispute + low stock. Handing off — screenshot is not proof, need gateway verify.", time: "03:14" },
    ],
  },
  {
    id: "t2",
    customer: "Chioma N.",
    phone: "0810 987 6543",
    last: "Show pearl packs under ₦1,200",
    status: "ai",
    messages: [
      { from: "customer", text: "Show pearl packs under ₦1,200", time: "02:50" },
      { from: "ai", text: "Top 2: Pearl Stud Essentials — Mixed 12 ₦1,200/pc, Fixed 30 ₦950/pc. Tap links.", time: "02:50" },
    ],
  },
  {
    id: "t3",
    customer: "Tolu A.",
    phone: "0706 222 3344",
    last: "Where is my order JMNG-2026-CQ2M77?",
    status: "open",
    messages: [
      { from: "customer", text: "Where is my order JMNG-2026-CQ2M77?", time: "01:20" },
      { from: "ai", text: "To check status I need OTP. Please provide phone + reference.", time: "01:20" },
      { from: "staff", text: "Your order is packed — pickup today 2-5pm.", time: "01:25" },
    ],
  },
];

export default function AdminConversationsPage() {
  const [threads] = useState(THREADS);
  const [selectedId, setSelectedId] = useState(threads[0].id);
  const selected = threads.find((t) => t.id === selectedId)!;
  const [reply, setReply] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Conversations</h1>
        <Link href="/simulator" className="text-sm bg-blush-pale border border-blush px-3 py-1.5 rounded-full">Open Simulator →</Link>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4 h-[640px]">
        <div className="bg-white rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="p-3 border-b flex gap-1.5">
            {["All", "Handoff", "AI", "Open"].map((f) => (
              <span key={f} className={`px-2.5 py-1 rounded-full text-xs border ${f === "All" ? "bg-plum text-cream border-plum" : "bg-cream-paper"}`}>{f}</span>
            ))}
          </div>
          <div className="flex-1 overflow-auto divide-y">
            {threads.map((t) => (
              <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left p-3 flex gap-3 hover:bg-cream ${selectedId === t.id ? "bg-cream-paper" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-plum text-cream grid place-items-center text-xs font-bold shrink-0">{t.customer[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium flex items-center gap-2">{t.customer} {t.status === "handoff" && <span className="text-xs bg-warning-bg text-warning px-2 py-0.5 rounded-full">handoff</span>}</p>
                  <p className="text-xs text-ink-muted truncate">{t.last}</p>
                  {t.reason && <p className="text-xs text-danger">{t.reason}</p>}
                </div>
                <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${t.status === "handoff" ? "bg-warning" : t.status === "ai" ? "bg-success" : "bg-ink-faint"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="h-12 border-b px-4 flex items-center justify-between bg-cream-paper">
            <div>
              <p className="text-sm font-semibold">{selected.customer} • {selected.phone}</p>
              <p className="text-xs text-ink-muted">{selected.status} • {selected.messages.length} msgs • Staff sees full context</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selected.status === "handoff" ? "bg-warning-bg text-warning border border-warning/20" : "bg-success-bg text-success"}`}>{selected.status.toUpperCase()}</span>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-cream">
            {selected.messages.map((m, i) => (
              <div key={i} className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${m.from === "customer" ? "bg-white border" : m.from === "ai" ? "bg-blush-pale border border-blush" : "bg-plum text-cream ml-auto"}`}>
                <span className="text-xs opacity-60">{m.from} • {m.time}</span>
                <p className="mt-1">{m.text}</p>
              </div>
            ))}
            {selected.status === "handoff" && <div className="bg-warning-bg border border-warning/20 rounded-lg p-3 text-xs">AI summary: Payment dispute + low stock (3 left). Customer sent screenshot (not proof). <b>Take over</b> → AI pauses 24h.</div>}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply as staff… (AI paused after takeover)" className="flex-1 border border-border rounded-full px-4 py-2 text-sm" />
            <button onClick={() => { if (!reply.trim()) return; alert(`Sent: ${reply} — customer sees staff reply, AI paused`); setReply(""); }} className="bg-plum text-cream px-5 rounded-full text-sm font-semibold">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
