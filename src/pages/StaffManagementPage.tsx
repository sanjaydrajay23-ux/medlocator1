import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, UserCog, X, Search, AlertTriangle, Shield, Phone, MapPin, IndianRupee, Calendar, Lock, User as UserIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import PhotoCapture from "@/components/PhotoCapture";
import type { Role, StaffMember } from "@/types";

const emptyForm: Omit<StaffMember, "id"> = {
  fullName: "",
  phone: "",
  address: "",
  salary: 0,
  role: "staff",
  username: "",
  password: "",
  photo: "",
  joinDate: new Date().toISOString().slice(0, 10),
};

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

export default function StaffManagementPage() {
  const { staff, addStaff, updateStaff, deleteStaff, user } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StaffMember, "id">>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
    );
  }, [staff, filter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditingId(s.id);
    const { id: _id, ...rest } = s;
    void _id;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingId ? updateStaff(editingId, form) : addStaff(form);
    if (ok) setModalOpen(false);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) deleteStaff(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const deletingSelf = confirmDeleteId
    ? staff.find((s) => s.id === confirmDeleteId)?.username === user?.username
    : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="mt-1 text-sm text-slate-400">{staff.length} staff members registered</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Staff
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name, username, phone or role..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <UserCog className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No staff members found</p>
            <p className="text-xs text-slate-400">Try a different search or add a new staff member.</p>
          </div>
        ) : (
          filtered.map((s) => (
            <StaffCard
              key={s.id}
              staff={s}
              isSelf={s.username === user?.username}
              onEdit={() => openEdit(s)}
              onDelete={() => setConfirmDeleteId(s.id)}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 transition hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Photo section */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Profile Photo</p>
                <PhotoCapture photo={form.photo} onChange={(photo) => setForm({ ...form, photo })} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required Icon={UserIcon}>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={inputCls}
                    placeholder="John Doe"
                  />
                </Field>
                <Field label="Phone Number" required Icon={Phone}>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls}
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>

              <Field label="Address" required Icon={MapPin}>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="House no, Street, City, State - PIN"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Monthly Salary (₹)" required Icon={IndianRupee}>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Role" required Icon={Shield}>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                    className={inputCls}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Owner / Admin</option>
                  </select>
                </Field>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Lock className="h-4 w-4 text-sky-500" /> Login Credentials
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Username" required Icon={UserIcon}>
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className={inputCls}
                      placeholder="johndoe"
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="Password" required Icon={Lock}>
                    <input
                      type="text"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={inputCls}
                      placeholder="Set a password"
                      autoComplete="off"
                    />
                  </Field>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
                >
                  {editingId ? "Save Changes" : "Add Staff Member"}
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
            <h3 className="text-lg font-bold text-slate-800">Remove staff member?</h3>
            <p className="mt-1 text-sm text-slate-500">
              {staff.find((s) => s.id === confirmDeleteId)?.fullName} will no longer be able to log in.
            </p>
            {deletingSelf && (
              <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                Warning: You are deleting your own account. You will be logged out.
              </p>
            )}
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

function StaffCard({
  staff, isSelf, onEdit, onDelete,
}: {
  staff: StaffMember;
  isSelf: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isAdmin = staff.role === "admin";
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4 p-5">
        <div className="relative shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
            {staff.photo ? (
              <img src={staff.photo} alt={staff.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-300">
                {staff.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${
            isAdmin ? "bg-emerald-500" : "bg-sky-500"
          }`}>
            <Shield className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-800">{staff.fullName}</h3>
            {isSelf && (
              <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-600">You</span>
            )}
          </div>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isAdmin ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
          }`}>
            {isAdmin ? "Owner / Admin" : "Staff"}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 border-t border-slate-100 px-5 py-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <UserIcon className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">Username:</span>
          <span className="ml-auto font-semibold text-slate-700">{staff.username}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="h-4 w-4 text-slate-400" />
          <span className="ml-auto truncate font-medium">{staff.phone}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-medium">{staff.address}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <IndianRupee className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">Salary:</span>
          <span className="ml-auto font-semibold text-slate-700">₹{staff.salary.toLocaleString("en-IN")}/mo</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">Joined:</span>
          <span className="ml-auto font-medium">{new Date(staff.joinDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      <div className="flex border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <div className="w-px bg-slate-100" />
        <button
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}

function Field({
  label, required, Icon, children,
}: {
  label: string;
  required?: boolean;
  Icon: typeof UserIcon;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}
