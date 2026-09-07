export function formatNGN(n: number) {
  return `₦ ${n.toLocaleString("en-NG")}`;
}

export function formatPricePerPc(n: number) {
  return `₦ ${n.toLocaleString("en-NG")} /pc`;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
