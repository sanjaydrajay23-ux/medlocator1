import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, Plus, Minus, Trash2, X, Receipt, IndianRupee, Clock, CheckCircle2, Pill, Printer,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getStockStatus } from "@/utils/medicine";
import { formatDateShort, formatTime } from "@/utils/work";
import type { Medicine, Sale, SaleItem } from "@/types";

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500";

export default function BillingPage() {
  const { medicines, sales, createSale, deleteSale } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);
  const [tab, setTab] = useState<"new" | "history">("new");

  const availableMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return medicines.filter((m) => {
      if (m.quantity <= 0) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    });
  }, [medicines, searchQuery]);

  const cartTotal = cart.reduce((sum, i) => sum + i.subtotal, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (med: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.medicineId === med.id);
      if (existing) {
        if (existing.quantity >= med.quantity) return prev;
        const newQty = existing.quantity + 1;
        return prev.map((i) =>
          i.medicineId === med.id ? { ...i, quantity: newQty, subtotal: newQty * i.price } : i
        );
      }
      return [...prev, { medicineId: med.id, name: med.name, price: med.price, quantity: 1, subtotal: med.price }];
    });
  };

  const updateQty = (medicineId: string, delta: number) => {
    setCart((prev) => {
      const med = medicines.find((m) => m.id === medicineId);
      const maxQty = med?.quantity ?? 0;
      return prev
        .map((i) => {
          if (i.medicineId !== medicineId) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > maxQty) return i;
          return { ...i, quantity: newQty, subtotal: newQty * i.price };
        })
        .filter(Boolean) as SaleItem[];
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => prev.filter((i) => i.medicineId !== medicineId));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const saleId = createSale(cart, customerName);
    if (saleId) {
      const sale = sales.find((s) => s.id === saleId) ?? null;
      setCart([]);
      setCustomerName("");
      setTab("history");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Billing Counter</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Create invoices and track sales — inventory updates automatically</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setTab("new")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "new" ? "bg-white text-sky-600 shadow-sm dark:bg-slate-700 dark:text-sky-400" : "text-slate-500 dark:text-slate-400"}`}
          >
            New Sale
          </button>
          <button
            onClick={() => setTab("history")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "history" ? "bg-white text-sky-600 shadow-sm dark:bg-slate-700 dark:text-sky-400" : "text-slate-500 dark:text-slate-400"}`}
          >
            History ({sales.length})
          </button>
        </div>
      </div>

      {tab === "new" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Medicine search + list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines by name or category..."
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {availableMedicines.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
                  <Pill className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No medicines found</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Try a different search or add medicines to inventory.</p>
                </div>
              ) : (
                availableMedicines.map((m) => {
                  const status = getStockStatus(m);
                  const inCart = cart.find((i) => i.medicineId === m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => addToCart(m)}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-600"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{m.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{m.category} · {m.quantity} in stock</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">₹{m.price.toFixed(2)}</p>
                        {inCart ? (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">In cart: {inCart.quantity}</span>
                        ) : status === "low" ? (
                          <span className="text-xs font-semibold text-amber-500">Low</span>
                        ) : (
                          <Plus className="ml-auto h-4 w-4 text-slate-300 transition group-hover:text-sky-500" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart sidebar */}
          <div className="lg:col-span-1">
            <form onSubmit={handleCheckout} className="sticky top-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-sky-500" />
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Cart</h2>
                {cartCount > 0 && (
                  <span className="ml-auto rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
                    {cartCount} item{cartCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name (optional)"
                className={inputCls}
              />

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingCart className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">Cart is empty</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Click medicines to add them</p>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.medicineId} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2.5 dark:border-slate-700">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">₹{item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => updateQty(item.medicineId, -1)} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span>
                        <button type="button" onClick={() => updateQty(item.medicineId, 1)} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => removeFromCart(item.medicineId)} className="ml-1 rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</span>
                      <span className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100">
                        <IndianRupee className="h-4 w-4" />{cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
                  >
                    Complete Sale & Print Invoice
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      ) : (
        /* Sales history */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {sales.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Receipt className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No sales recorded yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Completed sales will appear here with invoice details.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Invoice No</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Date / Time</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {sales.map((s) => (
                    <tr key={s.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{s.invoiceNo}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.customerName}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.items.length} item{s.items.length > 1 ? "s" : ""}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{formatDateShort(s.timestamp)} · {formatTime(s.timestamp)}</td>
                      <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-200">₹{s.total.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowReceipt(s)}
                            className="rounded-lg p-1.5 text-sky-500 transition hover:bg-sky-50 dark:hover:bg-sky-900/30"
                            title="View receipt"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSale(s.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                            title="Delete sale"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Receipt modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                <Receipt className="h-5 w-5 text-emerald-500" /> Invoice {showReceipt.invoiceNo}
              </h2>
              <button onClick={() => setShowReceipt(null)} className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-400 dark:text-slate-500">Customer</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{showReceipt.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500">Date</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{formatDateShort(showReceipt.timestamp)} · {formatTime(showReceipt.timestamp)}</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-400 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Medicine</th>
                      <th className="px-4 py-2 text-center font-semibold">Qty</th>
                      <th className="px-4 py-2 text-right font-semibold">Price</th>
                      <th className="px-4 py-2 text-right font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {showReceipt.items.map((item: SaleItem) => (
                      <tr key={item.medicineId}>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{item.name}</td>
                        <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-300">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-semibold text-slate-700 dark:text-slate-200">₹{item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Grand Total</span>
                <span className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100">
                  <IndianRupee className="h-4 w-4" />{showReceipt.total.toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Sale completed — inventory updated
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
