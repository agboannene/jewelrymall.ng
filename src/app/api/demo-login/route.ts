import { NextResponse } from "next/server";

const DEMO_EMAIL = "admin@jewelrymallng.com";
const DEMO_PASS = "Admin123!";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (email === DEMO_EMAIL && password === DEMO_PASS) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("demo-admin", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set("demo-admin-email", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
