import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Clock, TrendingUp, UserCog, ArrowRight, CalendarDays, Trash2, Plus, Receipt, IndianRupee,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  formatTime, formatDateShort, formatDuration,
  isToday, getTotalHoursForStaff, getTodayHoursForStaff, calcDuration,
} from "@/utils/work";
import type { WorkEntry } from "@/types";

function StatCard({
  label, value, Icon, gradient, ring,
}: {
  label: string;
  value: string;
  Icon: typeof Users;
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

export default function AdminDashboardPage() {
  const { user, profile, settings, staff, workEntries, sales, addWorkEntry, deleteWorkEntry } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selStaffId, setSelStaffId] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTime, setEntryTime] = useState("09:00");
  const [exitTime, setExitTime] = useState("17:00");
  const [filterDate, setFilterDate] = useState("");

  const staffOnly = staff.filter((s) => s.role === "staff");

  const filteredEntries = filterDate
    ? workEntries.filter((w) => {
        const d = new Date(w.checkIn);
        const f = new Date(filterDate + "T00:00:00");
        return d.getDate() === f.getDate() && d.getMonth() === f.getMonth() && d.getFullYear() === f.getFullYear();
      })
    : workEntries;

  const sortedEntries = [...filteredEntries].sort((a, b) => b.checkIn - a.checkIn);
  const todayEntries = workEntries.filter((w) => isToday(w.checkIn));

  const totalStaffHours = staffOnly.reduce((sum, s) => sum + getTotalHoursForStaff(workEntries, s.id), 0);
  const totalTodayHours = staffOnly.reduce((sum, s) => sum + getTodayHoursForStaff(workEntries, s.id), 0);
  const todayRevenue = sales.filter((s) => isToday(s.timestamp)).reduce((sum, s) => sum + s.total, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const s = staff.find((st) => st.id === selStaffId);
    if (!s) return;
    addWorkEntry(s.id, s.fullName, entryDate, entryTime, exitTime);
    setShowAddModal(false);
    setSelStaffId("");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-1 p-6">
            <h1 className="text-xl font-bold text-white lg:text-2xl">Welcome back, {profile.fullName || user?.username}</h1>
            <p className="mt-1 text-sm text-sky-50">
              Admin Dashboard · {settings.pharmacyName}. Monitor staff attendance and work hours.
            </p>
          </div>
          <div className="hidden h-32 w-48 shrink-0 overflow-hidden sm:block lg:h-36 lg:w-64">
            <img
              src="https://images.pexels.com/photos/8657290/pexels-photo-8657290.jpeg?auto=compress&cs=tinysrgb&h=400&w=600"
              alt="Pharmacists working together"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Staff" value={String(staffOnly.length)} Icon={Users} gradient="bg-sky-500" ring="bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" />
        <StatCard label="Entries Today" value={String(todayEntries.length)} Icon={Clock} gradient="bg-emerald-500" ring="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" />
        <StatCard label="Revenue Today" value={`₹${todayRevenue.toFixed(0)}`} Icon={IndianRupee} gradient="bg-amber-500" ring="bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} Icon={TrendingUp} gradient="bg-violet-500" ring="bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          to="/staff"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <UserCog className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Staff Management</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Add, edit and remove staff members with photos and login access.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
        </Link>

        <Link
          to="/inventory"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Inventory Overview</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Manage medicines, stock levels and check alerts.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500" />
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
            <p className="text-sm text-slate-400 dark:text-slate-500">Create invoices and track sales revenue.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500" />
        </Link>
      </div>

      {/* Work log */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Staff Work Log</h2>
          <div className="ml-auto flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 outline-none transition focus:border-sky-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" /> Add Entry
            </button>
          </div>
        </div>
        {sortedEntries.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Clock className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No work entries found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Click "Add Entry" to log staff entry and exit times.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Staff Member</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Entry Time</th>
                  <th className="px-5 py-3 font-semibold">Exit Time</th>
                  <th className="px-5 py-3 font-semibold">Hours Worked</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sortedEntries.map((w: WorkEntry) => {
                  const s = staff.find((st) => st.id === w.staffId);
                  return (
                    <tr key={w.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            {s?.photo ? (
                              <img src={s.photo} alt={w.staffName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-slate-400">{w.staffName.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{w.staffName}</span>
                        </div>
                      </td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add entry modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add Work Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                ×
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Staff Member</span>
                <select required value={selStaffId} onChange={(e) => setSelStaffId(e.target.value)} className={inputCls}>
                  <option value="">Select staff member...</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
                <input type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className={inputCls} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Entry Time</span>
                  <input type="time" required value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Exit Time</span>
                  <input type="time" required value={exitTime} onChange={(e) => setExitTime(e.target.value)} className={inputCls} />
                </label>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
