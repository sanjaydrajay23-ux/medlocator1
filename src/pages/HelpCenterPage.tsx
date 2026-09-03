import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, HelpCircle, Pill, PackagePlus, Bell, LayoutDashboard, Shield, ChevronDown, Lightbulb, Mail, BookOpen, UserCog,
} from "lucide-react";

interface FAQ {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Getting Started",
    q: "How do I log in to the system?",
    a: "Use the login page with your username and password. Demo accounts are: Staff (staff / staff123) and Owner/Admin (admin / admin123). Select the matching role before signing in.",
  },
  {
    category: "Getting Started",
    q: "What is the difference between Staff and Admin roles?",
    a: "Staff can search medicines and update inventory stock levels. Owner/Admin has full access: adding, editing, deleting medicines and changing system settings like thresholds and expiry windows.",
  },
  {
    category: "Search Medicine",
    q: "How does the medicine search work?",
    a: "The search bar filters medicines live as you type. It supports partial name matches, so typing 'para' will find 'Paracetamol'. The first match shows a full details card; additional matches appear below.",
  },
  {
    category: "Search Medicine",
    q: "What do the stock status colors mean?",
    a: "Green (Available) means stock is at or above the low-stock threshold. Amber (Low Stock) means quantity is above zero but below the threshold. Red (Out of Stock) means quantity is zero.",
  },
  {
    category: "Manage Inventory",
    q: "How do I add a new medicine?",
    a: "Go to Manage Inventory and click 'Add New Medicine'. Fill in the name, category, rack/shelf location, price, stock quantity, expiry date and low-stock threshold, then save.",
  },
  {
    category: "Manage Inventory",
    q: "How is stock status calculated automatically?",
    a: "After every add or edit, the system recalategorizes status: Quantity 0 = Out of Stock, quantity below the threshold = Low Stock, and quantity at or above the threshold = Available.",
  },
  {
    category: "Manage Inventory",
    q: "Can I delete a medicine?",
    a: "Yes. Click the trash icon next to a medicine in the inventory table. A confirmation prompt will appear before the medicine is permanently removed.",
  },
  {
    category: "Alerts",
    q: "When do alert notifications appear?",
    a: "Toast notifications pop up automatically whenever a medicine crosses into Low Stock or Out of Stock after an update. The Alerts page lists all current low, out-of-stock and expiry warnings.",
  },
  {
    category: "Alerts",
    q: "What is the expiry warning?",
    a: "Medicines expiring within the configured warning window (default 30 days) are flagged with an 'Expiring Soon' badge. Already-expired medicines are flagged in red as 'Expired'.",
  },
  {
    category: "Settings",
    q: "How do I change the default low-stock threshold?",
    a: "Go to Settings and update the 'Default Low Stock Threshold'. This value is used as the starting threshold when adding new medicines. Existing medicines keep their individual thresholds.",
  },
  {
    category: "Settings",
    q: "Can I change the expiry warning window?",
    a: "Yes. In Settings, adjust the 'Expiry Warning Window' (in days). Medicines expiring within that many days will be flagged as expiring soon across the app.",
  },
  {
    category: "Data & Storage",
    q: "Where is my data stored?",
    a: "All medicine data, your login session, profile and settings are saved in your browser's local storage. This means your data persists across page refreshes on the same device and browser.",
  },
  {
    category: "Staff Management",
    q: "How do I add a new staff member?",
    a: "Go to Staff Management (admin only) and click 'Add New Staff'. Fill in the full name, phone, address, salary, role, login username and password. You can take a photo with your camera or upload one from your device.",
  },
  {
    category: "Staff Management",
    q: "Can staff members see salary information?",
    a: "No. Salary details are visible to admins only. Staff accounts cannot see their own salary or anyone else's, whether on the Profile page or elsewhere.",
  },
  {
    category: "Staff Management",
    q: "Who can access Staff Management?",
    a: "Only Owner/Admin accounts can see the Staff Management option in the sidebar. Staff accounts do not see it and are redirected to the dashboard if they try to access it directly.",
  },
];

const categories = ["All", "Getting Started", "Search Medicine", "Manage Inventory", "Alerts", "Settings", "Staff Management", "Data & Storage"];

const guides = [
  { Icon: LayoutDashboard, title: "Dashboard", text: "Overview of total medicines, stock alerts and expiry warnings.", to: "/dashboard" },
  { Icon: Pill, title: "Search Medicine", text: "Find any medicine's location, price and stock status instantly.", to: "/search" },
  { Icon: PackagePlus, title: "Manage Inventory", text: "Add, edit, update stock and remove medicines from your catalog.", to: "/inventory" },
  { Icon: Bell, title: "Alerts Center", text: "View all low stock, out-of-stock and expiry warnings in one place.", to: "/alerts" },
  { Icon: UserCog, title: "Staff Management", text: "Admins can add, edit and remove staff with photos and login access.", to: "/staff" },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = faqs.filter((f) => {
    const matchesCat = activeCategory === "All" || f.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-600">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
            <HelpCircle className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Help Center</h1>
            <p className="text-sm text-slate-400">Guides, FAQs and answers to common questions.</p>
          </div>
        </div>
      </div>

      {/* Quick guides */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <BookOpen className="h-4 w-4 text-sky-500" /> Quick Guides
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {guides.map(({ Icon, title, text, to }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-700">{title}</p>
              <p className="mt-1 text-xs text-slate-400">{text}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeCategory === cat ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <HelpCircle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No articles found</p>
            <p className="text-xs text-slate-400">Try a different search term or category.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((f, i) => {
              const open = openIdx === i;
              return (
                <li key={`${f.q}-${i}`}>
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{f.q}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{f.category}</p>
                    </div>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-6 pb-4 text-sm leading-relaxed text-slate-600">
                      {f.a}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Contact / tips */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Tips for Staff</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-sky-500">•</span> Check the Alerts page at the start of every shift.</li>
            <li className="flex gap-2"><span className="text-sky-500">•</span> Update stock quantities immediately after dispensing.</li>
            <li className="flex gap-2"><span className="text-sky-500">•</span> Use partial search terms to find medicines faster.</li>
            <li className="flex gap-2"><span className="text-sky-500">•</span> Watch for the expiry warning badge on near-expiry items.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Need more help?</h3>
          <p className="mt-2 text-sm text-slate-500">
            If you can't find what you're looking for, contact your system administrator or refer to the role guide below.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <Shield className="h-4 w-4 text-emerald-500" />
            Admins manage settings, thresholds and can delete medicines. Staff handle day-to-day inventory updates.
          </div>
        </div>
      </div>
    </div>
  );
}
