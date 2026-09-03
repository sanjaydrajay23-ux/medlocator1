import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Pill, PackagePlus, Bell, LogOut, Cross, UserCircle2, Settings, HelpCircle, UserCog, Sun, Moon, Receipt,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ToastContainer from "@/components/ToastContainer";
import { getStockStatus } from "@/utils/medicine";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/search", label: "Search", Icon: Pill },
  { to: "/inventory", label: "Inventory", Icon: PackagePlus },
  { to: "/billing", label: "Billing", Icon: Receipt },
  { to: "/alerts", label: "Alerts", Icon: Bell },
];

const secondaryNavItems = [
  { to: "/profile", label: "Profile", Icon: UserCircle2 },
  { to: "/settings", label: "Settings", Icon: Settings },
  { to: "/help", label: "Help", Icon: HelpCircle },
];

export default function Layout() {
  const { user, profile, currentStaff, logout, medicines, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const alertCount = medicines.filter((m) => {
    const s = getStockStatus(m);
    return s === "low" || s === "out";
  }).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const allNav = [...navItems, ...secondaryNavItems];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {/* Top row: logo + user actions */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-md">
                <Cross className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight dark:text-slate-100">MedLocator</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Pharmacy System</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <NavLink to="/profile" className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-700">
                {currentStaff?.photo ? (
                  <img src={currentStaff.photo} alt={profile.fullName} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${profile.avatarColor} text-xs font-bold text-white`}>
                    {(profile.fullName || user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{profile.fullName || user?.username}</p>
                  <p className="text-xs capitalize text-slate-400 dark:text-slate-500">{user?.role}</p>
                </div>
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation row */}
          <nav className="flex gap-1 overflow-x-auto pb-2">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
                {to === "/alerts" && alertCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                    {alertCount}
                  </span>
                )}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/staff"
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`
                }
              >
                <UserCog className="h-4 w-4" />
                Staff
              </NavLink>
            )}

            <div className="mx-1 my-auto h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />

            {secondaryNavItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}
