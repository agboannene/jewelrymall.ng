"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CATALOG, getPrice } from "./catalog";

export interface CartLine {
  familyId: string;
  familySlug: string;
  familyName: string;
  variantId: string;
  variantName: string;
  image: string;
  packId: string;
  packName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

interface CartContextType {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "unitPrice" | "lineTotal">) => { ok: boolean; reason?: string };
  removeLine: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "jmng_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  function addLine(input: Omit<CartLine, "unitPrice" | "lineTotal">) {
    const family = CATALOG.find((f) => f.id === input.familyId);
    if (!family) return { ok: false, reason: "Product not found" };
    const pack = family.packs.find((p) => p.id === input.packId);
    if (!pack) return { ok: false, reason: "Pack not found" };
    if (input.qty < pack.moq) return { ok: false, reason: `MOQ is ${pack.moq}` };
    // validate stock (variant)
    const variant = family.variants.find((v) => v.id === input.variantId);
    if (variant && input.qty > variant.stock) return { ok: false, reason: `Only ${variant.stock} left` };

    const { unitPrice } = getPrice(family, input.qty);
    const lineTotal = unitPrice * input.qty;

    // if same family+variant+pack exists, merge qty and recompute price (tier)
    const idx = lines.findIndex((l) => l.familyId === input.familyId && l.variantId === input.variantId && l.packId === input.packId);
    if (idx >= 0) {
      const newQty = lines[idx].qty + input.qty;
      if (newQty < pack.moq) return { ok: false, reason: `MOQ is ${pack.moq}` };
      if (variant && newQty > variant.stock) return { ok: false, reason: `Only ${variant.stock} available` };
      const { unitPrice: newUnit } = getPrice(family, newQty);
      const copy = [...lines];
      copy[idx] = { ...copy[idx], qty: newQty, unitPrice: newUnit, lineTotal: newUnit * newQty };
      setLines(copy);
    } else {
      setLines([...lines, { ...input, unitPrice, lineTotal }]);
    }
    setDrawerOpen(true);
    return { ok: true };
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }
  function updateQty(index: number, qty: number) {
    const line = lines[index];
    if (!line) return;
    const family = CATALOG.find((f) => f.id === line.familyId);
    if (!family) return;
    if (qty <= 0) return removeLine(index);
    const pack = family.packs.find((p) => p.id === line.packId);
    if (pack && qty < pack.moq) return; // keep old
    const variant = family.variants.find((v) => v.id === line.variantId);
    if (variant && qty > variant.stock) return;
    const { unitPrice } = getPrice(family, qty);
    const copy = [...lines];
    copy[index] = { ...line, qty, unitPrice, lineTotal: unitPrice * qty };
    setLines(copy);
  }
  function clear() { setLines([]); }

  const subtotal = lines.reduce((a, b) => a + b.lineTotal, 0);
  const count = lines.reduce((a, b) => a + b.qty, 0);

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, updateQty, clear, subtotal, count, isDrawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
