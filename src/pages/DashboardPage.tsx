import { Link } from "react-router-dom";
import { Pill, PackagePlus, AlertTriangle, XCircle, CalendarClock, Boxes, TrendingDown, ArrowRight, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus, isExpired, isExpiringSoon, formatDate } from "@/utils/medicine";
import type { Medicine } from "@/types";

function StatCard({
  label,
  value,
  Icon,
  gradient,
  ring,
}: {
  label: string;
  value: number;
  Icon: typeof Pill;
  gradient: string;
  ring: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${gradient} opacity-10`} />
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ring}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, settings, medicines } = useApp();

  const total = medicines.length;
  const lowStock = medicines.filter((m) => getStockStatus(m) === "low");
  const outStock = medicines.filter((m) => getStockStatus(m) === "out");
  const expiringSoon = medicines.filter((m) => {
    const s = getStockStatus(m);
    return s !== "out" && (isExpired(m.expiryDate) || isExpiringSoon(m.expiryDate));
  });

  const alerts: Medicine[] = [...outStock, ...lowStock].sort((a, b) => {
    const ua = getStockStatus(a) === "out" ? 0 : 1;
    const ub = getStockStatus(b) === "out" ? 0 : 1;
    return ua - ub;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 p-6 text-white shadow-lg">
        <h1 className="text-xl font-bold lg:text-2xl">Welcome back, {profile.fullName || user?.username}</h1>
        <p className="mt-1 text-sm text-sky-50">
          You are signed in as <span className="font-semibold capitalize">{user?.role}</span> at {settings.pharmacyName}. Here's your pharmacy overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Medicines" value={total} Icon={Boxes} gradient="bg-sky-500" ring="bg-sky-50 text-sky-600" />
        <StatCard label="Low Stock Items" value={lowStock.length} Icon={TrendingDown} gradient="bg-amber-500" ring="bg-amber-50 text-amber-600" />
        <StatCard label="Out of Stock" value={outStock.length} Icon={XCircle} gradient="bg-rose-500" ring="bg-rose-50 text-rose-600" />
        <StatCard label="Expiring Soon" value={expiringSoon.length} Icon={CalendarClock} gradient="bg-violet-500" ring="bg-violet-50 text-violet-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          to="/search"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Pill className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800">Search Medicine</h3>
            <p className="text-sm text-slate-400">Find medicine location, price and stock status instantly.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500" />
        </Link>

        <Link
          to="/inventory"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PackagePlus className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800">Manage Inventory</h3>
            <p className="text-sm text-slate-400">Add, edit, update stock and remove medicines.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Bell className="h-5 w-5 text-rose-500" />
          <h2 className="text-base font-semibold text-slate-800">Active Alerts</h2>
          <span className="ml-auto rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
            {alerts.length}
          </span>
        </div>
        {alerts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Pill className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">All stocked up!</p>
            <p className="text-xs text-slate-400">No low stock or out-of-stock alerts right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {alerts.slice(0, 6).map((m) => {
              const status = getStockStatus(m);
              const expired = isExpired(m.expiryDate);
              return (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      status === "out" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                    }`}
                  >
                    {status === "out" ? <XCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">{m.name}</p>
                    <p className="text-xs text-slate-400">
                      {m.rack} · {status === "out" ? "0 units" : `${m.quantity} units left`} · Exp {formatDate(m.expiryDate)}
                      {expired && <span className="ml-1 font-semibold text-rose-500">· Expired</span>}
                    </p>
                  </div>
                  <Link
                    to="/inventory"
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-50"
                  >
                    Restock
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {alerts.length > 6 && (
          <div className="border-t border-slate-100 px-5 py-3 text-center">
            <Link to="/alerts" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
              View all {alerts.length} alerts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
