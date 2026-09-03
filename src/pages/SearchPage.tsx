import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Pill, MapPin, Tag, IndianRupee, Boxes, CalendarClock, AlertTriangle, XCircle, PackageSearch, ArrowLeft,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus, isExpired, isExpiringSoon, formatDate, daysUntil } from "@/utils/medicine";
import StatusBadge from "@/components/StatusBadge";
import type { Medicine } from "@/types";

export default function SearchPage() {
  const { medicines } = useApp();
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return medicines.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, medicines]);

  const exact = matches.length > 0 ? matches[0] : null;
  const others = matches.slice(1, 5);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Search Medicine</h1>
        <p className="mt-1 text-sm text-slate-400">Type a medicine name to find its location, price and stock status.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by medicine name (e.g. Paracetamol, Insulin...)"
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {!query.trim() && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
            <PackageSearch className="h-8 w-8" />
          </div>
          <p className="text-base font-semibold text-slate-600">Start typing to search</p>
          <p className="mt-1 text-sm text-slate-400">Search works with partial name matches too.</p>
        </div>
      )}

      {query.trim() && !exact && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
            <Pill className="h-8 w-8" />
          </div>
          <p className="text-base font-semibold text-slate-700">Medicine Not Found</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            No medicine matched "<span className="font-semibold">{query}</span>". Check the spelling or add it through Manage Inventory.
          </p>
          <Link
            to="/inventory"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <PackageSearch className="h-4 w-4" /> Add via Manage Inventory
          </Link>
        </div>
      )}

      {exact && <MedicineDetail medicine={exact} />}

      {others.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-600">Other matches</p>
          <ul className="space-y-2">
            {others.map((m) => (
              <li
                key={m.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 px-4 py-3 transition hover:border-sky-200 hover:bg-sky-50/40"
                onClick={() => setQuery(m.name)}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.rack} · {m.category}</p>
                </div>
                <StatusBadge status={getStockStatus(m)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MedicineDetail({ medicine }: { medicine: Medicine }) {
  const status = getStockStatus(medicine);
  const expired = isExpired(medicine.expiryDate);
  const expiringSoon = isExpiringSoon(medicine.expiryDate);
  const dLeft = daysUntil(medicine.expiryDate);

  return (
    <div className="space-y-4">
      {status === "out" && (
        <Banner color="rose" Icon={XCircle} title="Out of Stock Alert" message={`${medicine.name} is currently out of stock. Please restock immediately.`} />
      )}
      {status === "low" && (
        <Banner color="amber" Icon={AlertTriangle} title="Low Stock Alert" message={`Only ${medicine.quantity} units left (threshold ${medicine.lowStockThreshold}). Consider reordering soon.`} />
      )}
      {(expired || expiringSoon) && (
        <Banner
          color={expired ? "rose" : "violet"}
          Icon={CalendarClock}
          title={expired ? "Expired Medicine" : "Expiry Warning"}
          message={
            expired
              ? `This medicine expired ${Math.abs(dLeft)} days ago. Do not dispense.`
              : `Expires in ${dLeft} days (${formatDate(medicine.expiryDate)}).`
          }
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{medicine.name}</h2>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{medicine.category || "Uncategorized"}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
          <DetailRow Icon={MapPin} label="Rack / Shelf" value={medicine.rack} />
          <DetailRow Icon={IndianRupee} label="Price" value={`₹${medicine.price.toFixed(2)}`} />
          <DetailRow Icon={Boxes} label="Available Stock" value={`${medicine.quantity} units`} />
          <DetailRow Icon={CalendarClock} label="Expiry Date" value={formatDate(medicine.expiryDate)} />
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <Tag className="h-4 w-4" />
          Low stock threshold: <span className="font-semibold text-slate-700">{medicine.lowStockThreshold}</span> units
        </div>
      </div>
    </div>
  );
}

function DetailRow({ Icon, label, value }: { Icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function Banner({
  color, Icon, title, message,
}: {
  color: "rose" | "amber" | "violet";
  Icon: typeof AlertTriangle;
  title: string;
  message: string;
}) {
  const styles = {
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  }[color];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${styles}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
