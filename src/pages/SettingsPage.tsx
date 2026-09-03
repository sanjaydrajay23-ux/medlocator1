import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Settings as SettingsIcon, Bell, CalendarClock, TrendingDown, Store, RotateCcw, Info, Sun, Moon, Palette,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Settings } from "@/context/AppContext";
import type { Theme } from "@/types";

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-sky-900/40";

function SettingRow({
  Icon, title, description, children,
}: {
  Icon: typeof Bell;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 last:border-0 sm:flex-row sm:items-center dark:border-slate-700">
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-900/40 dark:text-sky-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
        </div>
      </div>
      <div className="sm:w-48">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, user, theme, setTheme } = useApp();
  const [form, setForm] = useState<Settings>(settings);
  const isAdmin = user?.role === "admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleReset = () => {
    setForm({
      defaultLowStockThreshold: 10,
      expiryWarningDays: 30,
      pharmacyName: "MedLocator Pharmacy",
    });
  };

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600 dark:text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Configure inventory thresholds, expiry alerts, appearance and pharmacy details.</p>
      </div>

      {/* Appearance / Dark Mode — available to all users */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/50">
          <Palette className="h-5 w-5 text-violet-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Appearance</h2>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500 dark:bg-violet-900/40 dark:text-violet-400">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Theme Mode</p>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Switch between light and dark appearance.</p>
            </div>
          </div>
          <div className="flex gap-2 sm:w-48">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition ${
                theme === "light"
                  ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-sky-400 bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">View only</p>
            <p>Only Owner/Admin accounts can change system settings. You can view the current configuration below.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/50">
          <SettingsIcon className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Inventory & Alerts</h2>
        </div>

        <SettingRow
          Icon={Store}
          title="Pharmacy Name"
          description="Displayed on the dashboard and across the app."
        >
          <input
            type="text"
            disabled={!isAdmin}
            value={form.pharmacyName}
            onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })}
            className={inputCls}
          />
        </SettingRow>

        <SettingRow
          Icon={TrendingDown}
          title="Default Low Stock Threshold"
          description="Used as the default when adding a new medicine."
        >
          <input
            type="number"
            min="1"
            disabled={!isAdmin}
            value={form.defaultLowStockThreshold}
            onChange={(e) => setForm({ ...form, defaultLowStockThreshold: Number(e.target.value) })}
            className={inputCls}
          />
        </SettingRow>

        <SettingRow
          Icon={CalendarClock}
          title="Expiry Warning Window"
          description="Number of days before expiry to flag a medicine as 'expiring soon'."
        >
          <input
            type="number"
            min="1"
            max="365"
            disabled={!isAdmin}
            value={form.expiryWarningDays}
            onChange={(e) => setForm({ ...form, expiryWarningDays: Number(e.target.value) })}
            className={inputCls}
          />
        </SettingRow>

        <div className="flex items-center justify-between gap-3 bg-slate-50 px-6 py-4 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isAdmin}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </button>
          <button
            type="submit"
            disabled={!isAdmin}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Configuration</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ConfigPill label="Pharmacy" value={settings.pharmacyName} />
          <ConfigPill label="Low Stock Default" value={`${settings.defaultLowStockThreshold} units`} />
          <ConfigPill label="Expiry Window" value={`${settings.expiryWarningDays} days`} />
        </div>
      </div>
    </div>
  );
}

function ConfigPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  );
}
