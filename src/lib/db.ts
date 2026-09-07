// Demo SQLite — orders + ledger — reuses better-sqlite3 file, separate from auth.db
// Vercel: /tmp/app.db (ephemeral, demo), Local: ./data/app.db
import fs from "fs";
import path from "path";
// @ts-ignore
import Database from "better-sqlite3";

let _db: any = null;

export function getDb() {
  if (_db) return _db;
  const dbPath = process.env.VERCEL ? "/tmp/app.db" : "./data/app.db";
  if (!process.env.VERCEL) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  _db = new Database(dbPath);
  _db.pragma("journal_mode = WAL");
  init(_db);
  return _db;
}

function init(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      delivery_method TEXT NOT NULL,
      delivery_zone TEXT NOT NULL,
      delivery_fee INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      channel TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ledger (
      id TEXT PRIMARY KEY,
      at TEXT NOT NULL,
      sku TEXT NOT NULL,
      product_name TEXT NOT NULL,
      variant_name TEXT NOT NULL,
      delta INTEGER NOT NULL,
      reason TEXT NOT NULL,
      actor TEXT NOT NULL,
      order_ref TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
