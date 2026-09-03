import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, User as UserIcon, Mail, Phone, Shield, Save, CalendarClock, Boxes, Stethoscope, Cross, MapPin, Calendar, IndianRupee, Lock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus } from "@/utils/medicine";
import PhotoCapture from "@/components/PhotoCapture";

const avatarColors = [
  { id: "from-sky-500 to-emerald-500", preview: "bg-gradient-to-br from-sky-500 to-emerald-500" },
  { id: "from-sky-500 to-cyan-500", preview: "bg-gradient-to-br from-sky-500 to-cyan-500" },
  { id: "from-emerald-500 to-teal-500", preview: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { id: "from-rose-500 to-orange-500", preview: "bg-gradient-to-br from-rose-500 to-orange-500" },
  { id: "from-violet-500 to-fuchsia-500", preview: "bg-gradient-to-br from-violet-500 to-fuchsia-500" },
  { id: "from-amber-500 to-yellow-500", preview: "bg-gradient-to-br from-amber-500 to-yellow-500" },
];

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-sky-900/40";

export default function ProfilePage() {
  const { user, profile, updateProfile, medicines, currentStaff } = useApp();
  const isAdmin = user?.role === "admin";
  const [form, setForm] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
  };

  const totalManaged = medicines.length;
  const lowCount = medicines.filter((m) => getStockStatus(m) === "low").length;
  const outCount = medicines.filter((m) => getStockStatus(m) === "out").length;
  const initials = (profile.fullName || user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600 dark:text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Profile</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">View and update your personal information.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col items-center text-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={profile.fullName}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-slate-100 dark:border-slate-700 dark:ring-slate-600"
              />
            ) : (
              <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${profile.avatarColor} text-3xl font-bold text-white shadow-lg`}>
                {initials}
              </div>
            )}
            <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">{profile.fullName || user?.username}</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500">{profile.email}</p>
            <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
              isAdmin ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-emerald-700" : "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/40 dark:text-sky-400 dark:ring-sky-700"
            }`}>
              <Shield className="h-3.5 w-3.5" />
              {isAdmin ? "Owner / Admin" : "Staff"}
            </span>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">
            <div className="flex items-center gap-3 text-sm">
              <Stethoscope className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400 dark:text-slate-500">Username:</span>
              <span className="ml-auto font-semibold text-slate-700 dark:text-slate-200">{user?.username}</span>
            </div>
            {currentStaff?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500">Phone:</span>
                <span className="ml-auto font-semibold text-slate-700 dark:text-slate-200">{currentStaff.phone}</span>
              </div>
            )}
            {currentStaff?.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500">Address:</span>
                <span className="ml-auto text-right font-medium text-slate-700 dark:text-slate-200">{currentStaff.address}</span>
              </div>
            )}
            {currentStaff?.joinDate && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500">Joined:</span>
                <span className="ml-auto font-semibold text-slate-700 dark:text-slate-200">
                  {new Date(currentStaff.joinDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            )}
            {isAdmin && currentStaff && (
              <div className="flex items-center gap-3 text-sm">
                <IndianRupee className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500">Salary:</span>
                <span className="ml-auto font-semibold text-emerald-600 dark:text-emerald-400">₹{currentStaff.salary.toLocaleString("en-IN")}/mo</span>
              </div>
            )}
            {!isAdmin && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400 dark:bg-slate-700 dark:text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Salary details are visible to admins only.
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center dark:border-slate-700">
            <div>
              <div className="flex items-center justify-center text-sky-500"><Boxes className="h-4 w-4" /></div>
              <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">{totalManaged}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Total</p>
            </div>
            <div>
              <div className="flex items-center justify-center text-amber-500"><CalendarClock className="h-4 w-4" /></div>
              <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">{lowCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Low</p>
            </div>
            <div>
              <div className="flex items-center justify-center text-rose-500"><Boxes className="h-4 w-4" /></div>
              <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">{outCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Out</p>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-5 flex items-center gap-2">
            <Cross className="h-5 w-5 text-sky-500" />
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Edit Information</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo change section */}
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40">
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Change Profile Photo</p>
              <PhotoCapture photo={form.photo} onChange={(photo) => setForm({ ...form, photo })} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</span>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={`${inputCls} pl-10`}
                    placeholder="Your full name"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`${inputCls} pl-10`}
                    placeholder="you@medlocator.in"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</span>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputCls} pl-10`}
                  placeholder="+91 98765 43210"
                />
              </div>
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Avatar Color</span>
              <div className="flex flex-wrap gap-3">
                {avatarColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm({ ...form, avatarColor: c.id })}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${c.preview} text-white transition ${
                      form.avatarColor === c.id ? "ring-2 ring-slate-800 ring-offset-2 dark:ring-slate-300 dark:ring-offset-slate-800" : "hover:scale-110"
                    }`}
                    aria-label="Select avatar color"
                  >
                    {form.avatarColor === c.id && <span className="text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
              <p className="font-semibold text-slate-600 dark:text-slate-300">Role & Access</p>
              <p className="mt-1">
                You are signed in as <span className="font-semibold capitalize">{user?.role}</span>.
                {isAdmin
                  ? " Admins can add, edit, and delete medicines, manage staff and change system settings."
                  : " Staff can search medicines and update inventory stock levels."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setForm(profile)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
