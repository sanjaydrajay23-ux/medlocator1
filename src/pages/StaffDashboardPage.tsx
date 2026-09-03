import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pill, PackagePlus, AlertTriangle, XCircle, CalendarClock, Boxes, TrendingDown, ArrowRight, Bell,
  Clock, Plus, Trash2, CalendarDays, Receipt,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus, isExpired, isExpiringSoon, formatDate } from "@/utils/medicine";
import {
  formatTime, formatDateShort, formatDuration,
  isToday, getTodayHoursForStaff, calcDuration,
} from "@/utils/work";
import type { Medicine } from "@/types";

function StatCard({
  label, value, Icon, gradient, ring,
}: {
  label: string;
  value: string;
  Icon: typeof Pill;
  gradient: string;
  ring: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${gradient} opacity-10`} />
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ring}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500";

export default function StaffDashboardPage() {
  const { user, profile, settings, medicines, currentStaff, workEntries, addWorkEntry, deleteWorkEntry } = useApp();

  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTime, setEntryTime] = useState("09:00");
  const [exitTime, setExitTime] = useState("17:00");

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

  const myEntries = currentStaff
    ? workEntries.filter((w) => w.staffId === currentStaff.id).sort((a, b) => b.checkIn - a.checkIn)
    : [];
  const myTodayHours = currentStaff ? getTodayHoursForStaff(workEntries, currentStaff.id) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff) return;
    addWorkEntry(currentStaff.id, currentStaff.fullName, entryDate, entryTime, exitTime);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-1 p-6">
            <h1 className="text-xl font-bold text-white lg:text-2xl">Welcome back, {profile.fullName || user?.username}</h1>
            <p className="mt-1 text-sm text-sky-50">
              You are signed in as Staff at {settings.pharmacyName}. Here's your pharmacy overview.
            </p>
          </div>
          <div className="hidden h-32 w-48 shrink-0 overflow-hidden sm:block lg:h-36 lg:w-64">
            <img
              src="https://images.pexels.com/photos/8657368/pexels-photo-8657368.jpeg?auto=compress&cs=tinysrgb&h=400&w=600"
              alt="Pharmacist helping customer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Manual work time entry */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Log Your Work Hours</h2>
        </div>
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
            <input type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Entry Time</span>
            <input type="time" required value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Exit Time</span>
            <input type="time" required value={exitTime} onChange={(e) => setExitTime(e.target.value)} className={inputCls} />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" /> Add Entry
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">Today: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDuration(myTodayHours)}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Medicines" value={String(total)} Icon={Boxes} gradient="bg-sky-500" ring="bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" />
        <StatCard label="Low Stock Items" value={String(lowStock.length)} Icon={TrendingDown} gradient="bg-amber-500" ring="bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
        <StatCard label="Out of Stock" value={String(outStock.length)} Icon={XCircle} gradient="bg-rose-500" ring="bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" />
        <StatCard label="Expiring Soon" value={String(expiringSoon.length)} Icon={CalendarClock} gradient="bg-violet-500" ring="bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          to="/search"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
            <Pill className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Search Medicine</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Find medicine location, price and stock status instantly.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500" />
        </Link>

        <Link
          to="/inventory"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <PackagePlus className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Manage Inventory</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Add, edit, update stock and remove medicines.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
        </Link>

        <Link
          to="/billing"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
            <Receipt className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Billing Counter</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Create invoices and sell medicines to customers.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500" />
        </Link>
      </div>

      {/* My work history */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">My Work History</h2>
        </div>
        {myEntries.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Clock className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No work entries yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Use the form above to log your entry and exit times.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Entry Time</th>
                  <th className="px-5 py-3 font-semibold">Exit Time</th>
                  <th className="px-5 py-3 font-semibold">Hours Worked</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {myEntries.map((w) => (
                  <tr key={w.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{formatDateShort(w.checkIn)}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{formatTime(w.checkIn)}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{formatTime(w.checkOut)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{formatDuration(calcDuration(w))}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteWorkEntry(w.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <Bell className="h-5 w-5 text-rose-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Active Alerts</h2>
          <span className="ml-auto rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            {alerts.length}
          </span>
        </div>
        {alerts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-900/40">
              <Pill className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All stocked up!</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">No low stock or out-of-stock alerts right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {alerts.slice(0, 6).map((m) => {
              const status = getStockStatus(m);
              const expired = isExpired(m.expiryDate);
              return (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      status === "out" ? "bg-rose-50 text-rose-500 dark:bg-rose-900/40" : "bg-amber-50 text-amber-500 dark:bg-amber-900/40"
                    }`}
                  >
                    {status === "out" ? <XCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{m.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {m.rack} · {status === "out" ? "0 units" : `${m.quantity} units left`} · Exp {formatDate(m.expiryDate)}
                      {expired && <span className="ml-1 font-semibold text-rose-500">· Expired</span>}
                    </p>
                  </div>
                  <Link
                    to="/inventory"
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/40"
                  >
                    Restock
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {alerts.length > 6 && (
          <div className="border-t border-slate-100 px-5 py-3 text-center dark:border-slate-700">
            <Link to="/alerts" className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400">
              View all {alerts.length} alerts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
