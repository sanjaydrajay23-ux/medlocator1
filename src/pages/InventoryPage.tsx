import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, PackagePlus, ArrowLeft, X, Search, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus, isExpired, isExpiringSoon, formatDate } from "@/utils/medicine";
import StatusBadge from "@/components/StatusBadge";
import type { Medicine } from "@/types";

const emptyForm: Omit<Medicine, "id"> = {
  name: "",
  category: "",
  rack: "",
  price: 0,
  quantity: 0,
  expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
  lowStockThreshold: 10,
};

export default function InventoryPage() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, settings } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Medicine, "id">>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter(
      (m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.rack.toLowerCase().includes(q)
    );
  }, [medicines, filter]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, lowStockThreshold: settings.defaultLowStockThreshold });
    setModalOpen(true);
  };

  const openEdit = (m: Medicine) => {
    setEditingId(m.id);
    const { id: _id, ...rest } = m;
    void _id;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMedicine(editingId, form);
    else addMedicine(form);
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) deleteMedicine(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Manage Inventory</h1>
          <p className="mt-1 text-sm text-slate-400">{medicines.length} medicines in stock</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Medicine
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, category or rack..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Rack / Shelf</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock Qty</th>
                <th className="px-5 py-3 font-semibold">Expiry</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <PackagePlus className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No medicines found</p>
                    <p className="text-xs text-slate-400">Try a different search or add a new medicine.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const status = getStockStatus(m);
                  const expired = isExpired(m.expiryDate);
                  const expSoon = isExpiringSoon(m.expiryDate);
                  return (
                    <tr key={m.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-700">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.category || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{m.rack}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-600">₹{m.price.toFixed(2)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${status === "out" ? "text-rose-600" : status === "low" ? "text-amber-600" : "text-slate-700"}`}>
                          {m.quantity}
                        </span>
                        <span className="text-xs text-slate-400"> / {m.lowStockThreshold}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-slate-600 ${expired ? "font-semibold text-rose-600" : expSoon ? "font-semibold text-violet-600" : ""}`}>
                          {formatDate(m.expiryDate)}
                        </span>
                        {expired && <p className="text-xs font-semibold text-rose-500">Expired</p>}
                        {!expired && expSoon && <p className="text-xs font-semibold text-violet-500">Soon</p>}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(m)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(m.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Medicine" : "Add New Medicine"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 transition hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
              <Field label="Medicine Name" required>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Paracetamol 500mg"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls}
                    placeholder="Tablet, Syrup..."
                  />
                </Field>
                <Field label="Rack / Shelf" required>
                  <input
                    type="text"
                    required
                    value={form.rack}
                    onChange={(e) => setForm({ ...form, rack: e.target.value })}
                    className={inputCls}
                    placeholder="Rack A-1"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)" required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Stock Quantity" required>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date" required>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Low Stock Threshold" required>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
                >
                  {editingId ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Delete this medicine?</h3>
            <p className="mt-1 text-sm text-slate-500">
              {medicines.find((m) => m.id === confirmDeleteId)?.name} will be permanently removed from inventory.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-rose-500 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}
