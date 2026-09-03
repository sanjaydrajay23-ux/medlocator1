import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, AlertTriangle, XCircle, CalendarClock, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus, isExpired, isExpiringSoon, formatDate, getAlertUrgency } from "@/utils/medicine";
import StatusBadge from "@/components/StatusBadge";
import type { Medicine } from "@/types";

type SortKey = "urgency" | "name" | "expiry";

export default function AlertsPage() {
  const { medicines } = useApp();
  const [sort, setSort] = useState<SortKey>("urgency");
  const [showExpiry, setShowExpiry] = useState(true);

  const alertMedicines = useMemo(() => {
    const list = medicines.filter((m) => {
      const s = getStockStatus(m);
      const expired = isExpired(m.expiryDate);
      const soon = isExpiringSoon(m.expiryDate);
      return s === "low" || s === "out" || (showExpiry && (expired || soon));
    });
    list.sort((a, b) => {
      if (sort === "urgency") return getAlertUrgency(a) - getAlertUrgency(b);
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
    return list;
  }, [medicines, sort, showExpiry]);

  const outCount = medicines.filter((m) => getStockStatus(m) === "out").length;
  const lowCount = medicines.filter((m) => getStockStatus(m) === "low").length;
  const expiryCount = medicines.filter((m) => {
    const s = getStockStatus(m);
    return s !== "out" && (isExpired(m.expiryDate) || isExpiringSoon(m.expiryDate));
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <Bell className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Alerts Center</h1>
            <p className="text-sm text-slate-400">All low stock, out-of-stock and expiry warnings in one place.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SummaryPill label="Out of Stock" value={outCount} color="rose" Icon={XCircle} />
        <SummaryPill label="Low Stock" value={lowCount} color="amber" Icon={AlertTriangle} />
        <SummaryPill label="Expiry Warnings" value={expiryCount} color="violet" Icon={CalendarClock} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Sort by:</span>
          {(["urgency", "name", "expiry"] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                sort === k ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {k === "urgency" ? "Urgency" : k === "name" ? "Name" : "Expiry Date"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500">
          <input
            type="checkbox"
            checked={showExpiry}
            onChange={(e) => setShowExpiry(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
          />
          Include expiry warnings
        </label>
      </div>

      {alertMedicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-base font-semibold text-slate-700">No active alerts</p>
          <p className="mt-1 text-sm text-slate-500">All medicines are well stocked and within expiry.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alertMedicines.map((m) => (
            <AlertCard key={m.id} medicine={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryPill({
  label, value, color, Icon,
}: {
  label: string;
  value: number;
  color: "rose" | "amber" | "violet";
  Icon: typeof XCircle;
}) {
  const styles = {
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  }[color];
  return (
    <div className={`flex items-center gap-3 rounded-xl p-4 ring-1 ${styles}`}>
      <Icon className="h-6 w-6 shrink-0" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs font-medium opacity-80">{label}</p>
      </div>
    </div>
  );
}

function AlertCard({ medicine }: { medicine: Medicine }) {
  const status = getStockStatus(medicine);
  const expired = isExpired(medicine.expiryDate);
  const soon = isExpiringSoon(medicine.expiryDate);

  const reasons: { label: string; color: string }[] = [];
  if (status === "out") reasons.push({ label: "Out of Stock", color: "text-rose-600" });
  if (status === "low") reasons.push({ label: "Low Stock", color: "text-amber-600" });
  if (expired) reasons.push({ label: "Expired", color: "text-rose-600" });
  else if (soon) reasons.push({ label: "Expiring Soon", color: "text-violet-600" });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800">{medicine.name}</p>
          <p className="text-xs text-slate-400">{medicine.rack} · {medicine.category || "—"}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {reasons.map((r) => (
          <span key={r.label} className={`rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold ${r.color}`}>
            {r.label}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center text-xs">
        <div>
          <p className="text-slate-400">Stock</p>
          <p className={`font-bold ${status === "out" ? "text-rose-600" : status === "low" ? "text-amber-600" : "text-slate-700"}`}>
            {medicine.quantity}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Threshold</p>
          <p className="font-bold text-slate-700">{medicine.lowStockThreshold}</p>
        </div>
        <div>
          <p className="text-slate-400">Expiry</p>
          <p className={`font-bold ${expired ? "text-rose-600" : soon ? "text-violet-600" : "text-slate-700"}`}>
            {formatDate(medicine.expiryDate)}
          </p>
        </div>
      </div>
      <Link
        to="/inventory"
        className="mt-3 block rounded-lg bg-slate-50 py-2 text-center text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
      >
        Manage in Inventory
      </Link>
    </div>
  );
}
