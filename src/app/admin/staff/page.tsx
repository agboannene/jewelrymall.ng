"use client";
import { useState } from "react";

type Staff = { id: string; name: string; email: string; role: "owner" | "manager" | "staff" | "viewer"; lastActive: string };

const INITIAL: Staff[] = [
  { id: "s1", name: "Annie (You)", email: "annie@jewelrymallng.com", role: "owner", lastActive: "now" },
  { id: "s2", name: "Fola — Fulfilment", email: "fola@jewelrymallng.com", role: "staff", lastActive: "2h ago" },
  { id: "s3", name: "Manager Demo", email: "manager@jewelrymallng.com", role: "manager", lastActive: "1d ago" },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>(INITIAL);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Staff["role"]>("staff");

  function invite() {
    if (!email.includes("@")) return alert("Enter valid email");
    setStaff([...staff, { id: Math.random().toString(36).slice(2), name: email.split("@")[0], email, role, lastActive: "invited" }]);
    setEmail("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Staff & Access</h1>
        <span className="text-xs bg-cream-paper border px-3 py-1.5 rounded-full">RBAC: Owner → all, Manager → products/orders, Staff → fulfilment, Viewer → read-only</span>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <h2 className="font-semibold text-sm">Invite staff</h2>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@jewelrymallng.com" className="flex-1 border border-border rounded-full px-4 py-2 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="border border-border rounded-full px-4 py-2 text-sm">
            <option value="staff">Staff — fulfilment + inbox</option>
            <option value="manager">Manager — products/orders/reports</option>
            <option value="viewer">Viewer — read-only</option>
            <option value="owner">Owner — all + invites</option>
          </select>
          <button onClick={invite} className="bg-plum text-cream px-6 rounded-full text-sm font-semibold">Invite</button>
        </div>
        <p className="text-xs text-ink-muted mt-2">Invite sends email, creates account. Access is checked server-side on every route (PRD §10.1).</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-3 border-b bg-cream-paper">
          <p className="text-sm font-semibold">{staff.length} members</p>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-paper text-label text-ink-muted"><tr><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Email</th><th className="text-left px-4 py-2">Role</th><th className="text-left px-4 py-2">Last active</th><th className="text-left px-4 py-2"></th></tr></thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.name}</td>
                  <td className="px-4 py-2 text-ink-muted">{s.email}</td>
                  <td className="px-4 py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.role === "owner" ? "bg-plum text-cream" : s.role === "manager" ? "bg-blush-pale border" : "bg-cream-paper border"}`}>{s.role}</span></td>
                  <td className="px-4 py-2 text-xs">{s.lastActive}</td>
                  <td className="px-4 py-2"><button onClick={() => alert(`Change role for ${s.email} — server RBAC check`)} className="text-xs underline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blush-pale border border-blush rounded-xl p-4 text-sm">
        <b>Permissions (server-enforced):</b> Owner edits pricing tiers, Staff cannot; Staff can mark `packed/shipped`, Viewer cannot. Every admin action is audit-logged.
      </div>
    </div>
  );
}
