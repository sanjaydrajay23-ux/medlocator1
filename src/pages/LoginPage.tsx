import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cross, User as UserIcon, Lock, ShieldCheck, UserCircle2, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Role } from "@/types";

export default function LoginPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(username.trim(), password, role);
    if (!ok) {
      setError("Invalid credentials. Please check username, password and role.");
      return;
    }
    navigate("/dashboard");
  };

  const fillDemo = (r: Role) => {
    setRole(r);
    setUsername(r === "admin" ? "admin" : "staff");
    setPassword(r === "admin" ? "admin123" : "staff123");
    setError("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-slate-900 to-emerald-900" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 shadow-lg shadow-sky-500/30">
            <Cross className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MedLocator</h1>
          <p className="mt-1 text-sm text-slate-300">Pharmacy Medicine Locator & Inventory System</p>
        </div>

        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-800">Staff Sign In</h2>
          <p className="mt-1 text-sm text-slate-400">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="staff or admin"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {(["staff", "admin"] as Role[]).map((r) => {
                  const active = role === r;
                  const Icon = r === "admin" ? ShieldCheck : UserCircle2;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {r === "admin" ? "Owner / Admin" : "Staff"}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="mb-1 font-semibold text-slate-600">Demo credentials</p>
            <button onClick={() => fillDemo("staff")} className="block hover:text-sky-600">
              Staff → staff / staff123
            </button>
            <button onClick={() => fillDemo("admin")} className="block hover:text-sky-600">
              Admin → admin / admin123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
