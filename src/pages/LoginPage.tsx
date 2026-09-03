import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cross, User as UserIcon, Lock, ShieldCheck, UserCircle2, AlertCircle,
  Pill, PackagePlus, Search, Receipt, TrendingUp, HeartPulse, ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Role } from "@/types";

const heroSlides = [
  {
    image: "https://images.pexels.com/photos/8657301/pexels-photo-8657301.jpeg?auto=compress&cs=tinysrgb&h=900&w=600",
    caption: "Find medicines instantly",
    sub: "Locate any drug by name, category, or rack in seconds.",
  },
  {
    image: "https://images.pexels.com/photos/8657368/pexels-photo-8657368.jpeg?auto=compress&cs=tinysrgb&h=900&w=600",
    caption: "Sell with confidence",
    sub: "Generate invoices and auto-deduct stock with every sale.",
  },
  {
    image: "https://images.pexels.com/photos/14797864/pexels-photo-14797864.jpeg?auto=compress&cs=tinysrgb&h=900&w=600",
    caption: "Track your inventory",
    sub: "Real-time stock levels, expiry alerts, and low-stock warnings.",
  },
];

const features = [
  { Icon: Search, label: "Smart Search" },
  { Icon: PackagePlus, label: "Inventory Control" },
  { Icon: Receipt, label: "Billing & Invoices" },
  { Icon: TrendingUp, label: "Revenue Insights" },
];

export default function LoginPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [error, setError] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="relative flex min-h-screen overflow-hidden bg-slate-900">
      {/* Left: image + branding panel (hidden on small screens) */}
      <div className="relative hidden w-1/2 lg:block">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <img src={s.image} alt={s.caption} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-sky-900/30" />
          </div>
        ))}

        {/* Floating blobs */}
        <div className="absolute -left-20 top-1/4 h-72 w-72 animate-pulse rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 h-80 w-80 animate-pulse rounded-full bg-emerald-500/20 blur-3xl" style={{ animationDelay: "1.5s" }} />

        {/* Content overlay */}
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 shadow-lg shadow-sky-500/30">
              <Cross className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">MedLocator</p>
              <p className="text-xs text-slate-300">Pharmacy Management System</p>
            </div>
          </div>

          {/* Rotating caption */}
          <div className="max-w-sm">
            {heroSlides.map((s, i) => (
              <div
                key={i}
                className="transition-all duration-700"
                style={{
                  opacity: i === slide ? 1 : 0,
                  transform: i === slide ? "translateY(0)" : "translateY(16px)",
                  position: i === slide ? "static" : "absolute",
                  pointerEvents: i === slide ? "auto" : "none",
                }}
              >
                <h2 className="text-3xl font-bold leading-tight text-white">{s.caption}</h2>
                <p className="mt-2 text-base text-slate-200">{s.sub}</p>
              </div>
            ))}

            {/* Slide dots */}
            <div className="mt-6 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-8 bg-sky-400" : "w-4 bg-white/30 hover:bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {features.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="relative flex w-full items-center justify-center p-4 lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 lg:bg-gradient-to-br lg:from-slate-900 lg:via-slate-900 lg:to-slate-800" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 shadow-lg shadow-sky-500/30">
              <Cross className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MedLocator</h1>
            <p className="mt-1 text-sm text-slate-400">Pharmacy Management System</p>
          </div>

          {/* Desktop header */}
          <div className="mb-6 hidden lg:block">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <HeartPulse className="h-3.5 w-3.5" />
              Welcome back
            </div>
            <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-1 text-sm text-slate-400">Enter your credentials to access the dashboard</p>
          </div>

          <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
                <div className="group relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-500" />
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
                <div className="group relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-500" />
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
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
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
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.99]"
              >
                Sign In
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-slate-600">
                <Pill className="h-3.5 w-3.5 text-sky-500" />
                Demo credentials — click to fill
              </p>
              <div className="flex flex-col gap-1">
                <button onClick={() => fillDemo("staff")} className="flex items-center gap-1.5 rounded px-1 py-0.5 transition hover:text-sky-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Staff → staff / staff123
                </button>
                <button onClick={() => fillDemo("admin")} className="flex items-center gap-1.5 rounded px-1 py-0.5 transition hover:text-sky-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Admin → admin / admin123
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MedLocator Pharmacy System
          </p>
        </div>
      </div>
    </div>
  );
}
