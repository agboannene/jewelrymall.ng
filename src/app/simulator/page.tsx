"use client";
import { useState } from "react";
import { CATALOG, searchCatalog } from "@/lib/catalog";
import { formatNGN } from "@/lib/format";
import Link from "next/link";

type Msg = { from: "user" | "bot"; text: string; links?: { slug: string; name: string }[] };

function botReply(input: string): Msg {
  const q = input.toLowerCase();
  // guardrails simulation
  if (q.includes("refund") || q.includes("complain") || q.includes("human") || q.includes("agent")) {
    return {
      from: "bot",
      text: "I understand you need a person. I've summarised your request and will hand you to staff — they will see this chat so you don't have to repeat yourself. A staff member will reply shortly. (Mock handoff ✓)",
    };
  }
  if (q.includes("price") || q.includes("how much") || q.includes("wholesale") || q.includes("pack")) {
    const hits = searchCatalog(input).slice(0, 3);
    if (hits.length === 0) return { from: "bot", text: "From approved catalogue 2026-09-07: I couldn't find a match for that. Try `pearl`, `hoops`, or tell me quantity (e.g., `pearl pack 12`). I never invent prices — only catalogue prices are quoted." };
    return {
      from: "bot",
      text: `From approved catalogue 2026-09-07 — top ${hits.length} matches:\n${hits.map((p) => `• ${p.name} — from ${formatNGN(Math.min(...p.tiers.map((t) => t.price)))} /pc, MOQ ${p.packs[0].moq}`).join("\n")}\nTap a link to see correct tier price.`,
      links: hits.map((h) => ({ slug: h.slug, name: h.name })),
    };
  }
  if (q.includes("stock") || q.includes("available")) {
    const hits = searchCatalog(input).slice(0, 2);
    if (hits.length === 0) return { from: "bot", text: "From approved catalogue: tell me the product name and I'll check live stock." };
    return { from: "bot", text: hits.map((p) => `${p.name}: ${p.variants.map((v) => `${v.name} — ${v.stock} left${v.stock <= v.lowStockAt && v.stock > 0 ? " (low)" : v.stock === 0 ? " (out)" : ""}`).join(" | ")}`).join("\n"), links: hits.map((h) => ({ slug: h.slug, name: h.name })) };
  }
  if (q.includes("order") || q.includes("track")) {
    return { from: "bot", text: "To check order status I need order reference + phone OTP (10 min, 3 tries). In this demo, try `JMNG-2026-ABC123` with OTP `1234` on the Track page. I never reveal another customer's data." };
  }
  // image match mock
  if (q.includes("photo") || q.includes("image") || q.includes("match")) {
    return { from: "bot", text: "I can compare your photo to catalogue images. In this mock, I found 2 close matches with confidence 0.72. Tap to view:\n• Pearl Stud Essentials (0.72)\n• Crystal Drop Earrings (0.68) — below 0.65 I would say I'm not certain and offer a human.", links: CATALOG.slice(0, 2).map((h) => ({ slug: h.slug, name: h.name })) };
  }
  // default
  const hits = searchCatalog(input).slice(0, 2);
  if (hits.length > 0) {
    return { from: "bot", text: `From catalogue: I found ${hits.length} relevant item(s). Tap to see tier prices:\n${hits.map((p) => `• ${p.name}`).join("\n")}`, links: hits.map((h) => ({ slug: h.slug, name: h.name })) };
  }
  return { from: "bot", text: "Hi! I'm the JewelryMallNG assistant (mock). Ask me product/price/pack/stock/delivery questions — I answer only from the approved catalogue. Try: `Show pearl packs under ₦1,200` or `Do you have gold hoops in stock?`" };
}

export default function SimulatorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi Ada 👋 I'm JewelryMallNG assistant (mock). I use the same catalogue, price engine and stock as the website. Try: `Show pearl studs wholesale` or `image match` or `I want refund` to test handoff." }]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const user: Msg = { from: "user", text: input };
    const reply = botReply(input);
    setMsgs((m) => [...m, user, reply]);
    setInput("");
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
      <div className="bg-white rounded-xl border border-border flex flex-col h-[640px]">
        <div className="h-12 bg-plum text-cream flex items-center px-4 rounded-t-xl justify-between">
          <span className="font-semibold text-sm">WhatsApp Simulator • Mock (no Meta needed)</span>
          <span className="text-xs bg-white/15 px-2 py-1 rounded-full">SSOT catalogue • Guardrails on</span>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3 bg-cream-paper">
          {msgs.map((m, i) => (
            <div key={i} className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-5 ${m.from === "user" ? "ml-auto bg-plum text-cream rounded-br-sm" : "bg-white border border-border rounded-bl-sm"}`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.links && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.links.map((l) => <Link key={l.slug} href={`/product/${l.slug}`} className="text-xs bg-cream-paper border border-border px-2.5 py-1 rounded-full hover:border-plum">{l.name} →</Link>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type: Show gold hoops wholesale / image match / refund..." className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-plum" />
          <button onClick={send} className="bg-plum text-cream rounded-full px-5 text-sm font-semibold">Send</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="font-semibold text-sm">Test the guardrails (PRD §9)</p>
          <ul className="text-sm mt-2 space-y-2">
            <li><button onClick={() => setInput("Show pearl studs wholesale")} className="underline text-plum">Show pearl studs wholesale</button> — should cite catalogue</li>
            <li><button onClick={() => setInput("Do you have the chunky chain gold in stock?")} className="underline text-plum">Gold chunky chain in stock?</button> — should say 0/out</li>
            <li><button onClick={() => setInput("photo match for this earring")} className="underline text-plum">photo match</button> — threshold 0.65 demo</li>
            <li><button onClick={() => setInput("I want a refund")} className="underline text-plum">I want a refund</button> — must handoff</li>
            <li><button onClick={() => setInput("Track my order JMNG-2026-ABC123")} className="underline text-plum">Track order</button> — must ask OTP</li>
          </ul>
        </div>
        <div className="bg-blush-pale border border-blush rounded-xl p-4 text-sm">
          <p className="font-semibold">How this mirrors production</p>
          <p className="text-ink-muted mt-1">Prod uses Meta Cloud API webhook → same botReply via tool calls (`catalog.search`, `price.get`, `stock.get`). Every answer logged with `promptVersion + toolsCalled`. Handoff creates ticket in dashboard.</p>
        </div>
        <Link href="/" className="block text-center bg-white border border-border rounded-full py-2.5 text-sm">Back to mall</Link>
      </div>
    </div>
  );
}
