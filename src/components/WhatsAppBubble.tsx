"use client";
import Link from "next/link";

export default function WhatsAppBubble() {
  return (
    <Link href="/simulator" className="fixed bottom-4 right-4 z-40 bg-[#25D366] text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2 hover:scale-[1.02] transition text-sm font-medium">
      <span className="w-6 h-6 bg-white rounded-full grid place-items-center text-[#25D366] text-xs font-bold">WA</span>
      Chat on WhatsApp
    </Link>
  );
}
