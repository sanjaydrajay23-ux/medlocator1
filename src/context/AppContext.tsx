import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Medicine, Role, Sale, SaleItem, StaffMember, Theme, Toast, User, WorkEntry } from "@/types";
import { seedMedicines } from "@/data/seedMedicines";

const MEDICINES_KEY = "pml_medicines";
const USER_KEY = "pml_user";
const SETTINGS_KEY = "pml_settings";
const PROFILE_KEY = "pml_profile";
const STAFF_KEY = "pml_staff";
const WORK_KEY = "pml_work";
const SALES_KEY = "pml_sales";
const THEME_KEY = "pml_theme";

export interface Settings {
  defaultLowStockThreshold: number;
  expiryWarningDays: number;
  pharmacyName: string;
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  avatarColor: string;
  photo: string;
}

const defaultSettings: Settings = {
  defaultLowStockThreshold: 10,
  expiryWarningDays: 30,
  pharmacyName: "MedLocator Pharmacy",
};

const defaultAdmin: StaffMember = {
  id: "staff-admin",
  fullName: "Administrator",
  phone: "+91 90000 00000",
  address: "MedLocator HQ, Mumbai, India",
  salary: 75000,
  role: "admin",
  username: "admin",
  password: "admin123",
  photo: "",
  joinDate: new Date().toISOString().slice(0, 10),
};

const defaultStaff: StaffMember = {
  id: "staff-demo",
  fullName: "Staff User",
  phone: "+91 91111 11111",
  address: "MG Road, Bengaluru, India",
  salary: 28000,
  role: "staff",
  username: "staff",
  password: "staff123",
  photo: "",
  joinDate: new Date().toISOString().slice(0, 10),
};

interface AppContextValue {
  user: User | null;
  profile: Profile;
  settings: Settings;
  staff: StaffMember[];
  workEntries: WorkEntry[];
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  updateProfile: (p: Profile) => void;
  updateSettings: (s: Settings) => void;
  login: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
  addStaff: (s: Omit<StaffMember, "id">) => boolean;
  updateStaff: (id: string, s: Omit<StaffMember, "id">) => boolean;
  deleteStaff: (id: string) => void;
  addWorkEntry: (staffId: string, staffName: string, date: string, checkIn: string, checkOut: string) => void;
  deleteWorkEntry: (entryId: string) => void;
  currentStaff: StaffMember | null;
  medicines: Medicine[];
  addMedicine: (m: Omit<Medicine, "id">) => void;
  updateMedicine: (id: string, m: Omit<Medicine, "id">) => void;
  deleteMedicine: (id: string) => void;
  sales: Sale[];
  createSale: (items: SaleItem[], customerName: string) => string | null;
  deleteSale: (saleId: string) => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadMedicines(): Medicine[] {
  try {
    const raw = localStorage.getItem(MEDICINES_KEY);
    if (!raw) {
      localStorage.setItem(MEDICINES_KEY, JSON.stringify(seedMedicines));
      return seedMedicines;
    }
    return JSON.parse(raw) as Medicine[];
  } catch {
    return seedMedicines;
  }
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function loadStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      const seed = [defaultAdmin, defaultStaff];
      localStorage.setItem(STAFF_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as StaffMember[];
  } catch {
    return [defaultAdmin, defaultStaff];
  }
}

function loadWorkEntries(): WorkEntry[] {
  try {
    const raw = localStorage.getItem(WORK_KEY);
    return raw ? (JSON.parse(raw) as WorkEntry[]) : [];
  } catch {
    return [];
  }
}

function loadSales(): Sale[] {
  try {
    const raw = localStorage.getItem(SALES_KEY);
    return raw ? (JSON.parse(raw) as Sale[]) : [];
  } catch {
    return [];
  }
}

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function loadProfile(user: User | null, staff: StaffMember[]): Profile {
  const match = user ? staff.find((s) => s.username === user.username) : null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Profile;
      return { ...parsed, fullName: match?.fullName ?? parsed.fullName, photo: match?.photo ?? parsed.photo };
    }
  } catch {
    /* ignore */
  }
  return {
    fullName: match?.fullName ?? (user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : ""),
    email: `${user?.username ?? "staff"}@medlocator.in`,
    phone: match?.phone ?? "",
    avatarColor: "from-sky-500 to-emerald-500",
    photo: match?.photo ?? "",
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [medicines, setMedicines] = useState<Medicine[]>(loadMedicines);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [staff, setStaff] = useState<StaffMember[]>(loadStaff);
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(loadWorkEntries);
  const [theme, setThemeState] = useState<Theme>(loadTheme);
  const [sales, setSales] = useState<Sale[]>(loadSales);
  const [profile, setProfile] = useState<Profile>(() => loadProfile(loadUser(), loadStaff()));
  const prevStatusRef = useRef<Record<string, "available" | "low" | "out">>({});

  useEffect(() => {
    localStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(WORK_KEY, JSON.stringify(workEntries));
  }, [workEntries]);

  useEffect(() => {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((prev) => (prev === "light" ? "dark" : "light")), []);

  const login = useCallback(
    (username: string, password: string, role: Role) => {
      const u = username.toLowerCase();
      const match = staff.find((s) => s.username.toLowerCase() === u && s.password === password && s.role === role);
      if (!match) return false;
      const newUser: User = { username: match.username, role: match.role };
      setUser(newUser);
      setProfile(loadProfile(newUser, staff));
      return true;
    },
    [staff]
  );

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback(
    (p: Profile) => {
      setProfile(p);
      pushToast({ type: "success", message: "Profile updated successfully." });
    },
    [pushToast]
  );

  const updateSettings = useCallback(
    (s: Settings) => {
      setSettings(s);
      pushToast({ type: "success", message: "Settings saved." });
    },
    [pushToast]
  );

  const addStaff = useCallback(
    (s: Omit<StaffMember, "id">) => {
      const exists = staff.some((x) => x.username.toLowerCase() === s.username.toLowerCase());
      if (exists) {
        pushToast({ type: "error", message: `Username "${s.username}" is already taken.` });
        return false;
      }
      const id = `staff-${Date.now().toString(36)}`;
      setStaff((prev) => [...prev, { ...s, id }]);
      pushToast({ type: "success", message: `${s.fullName} added as staff.` });
      return true;
    },
    [staff, pushToast]
  );

  const updateStaff = useCallback(
    (id: string, s: Omit<StaffMember, "id">) => {
      const dup = staff.some((x) => x.id !== id && x.username.toLowerCase() === s.username.toLowerCase());
      if (dup) {
        pushToast({ type: "error", message: `Username "${s.username}" is already taken.` });
        return false;
      }
      setStaff((prev) => prev.map((m) => (m.id === id ? { ...s, id } : m)));
      pushToast({ type: "success", message: `${s.fullName}'s details updated.` });
      return true;
    },
    [staff, pushToast]
  );

  const deleteStaff = useCallback(
    (id: string) => {
      setStaff((prev) => {
        const m = prev.find((x) => x.id === id);
        if (m) pushToast({ type: "info", message: `${m.fullName} removed from staff.` });
        return prev.filter((x) => x.id !== id);
      });
    },
    [pushToast]
  );

  const addWorkEntry = useCallback(
    (staffId: string, staffName: string, date: string, checkInTime: string, checkOutTime: string) => {
      const checkIn = new Date(`${date}T${checkInTime}`).getTime();
      const checkOut = new Date(`${date}T${checkOutTime}`).getTime();
      if (isNaN(checkIn) || isNaN(checkOut)) {
        pushToast({ type: "error", message: "Invalid time values." });
        return;
      }
      if (checkOut <= checkIn) {
        pushToast({ type: "error", message: "Exit time must be after entry time." });
        return;
      }
      const entry: WorkEntry = {
        id: `work-${Date.now().toString(36)}`,
        staffId,
        staffName,
        checkIn,
        checkOut,
      };
      setWorkEntries((prev) => [entry, ...prev]);
      pushToast({ type: "success", message: `Work entry added for ${staffName}.` });
    },
    [pushToast]
  );

  const deleteWorkEntry = useCallback(
    (entryId: string) => {
      setWorkEntries((prev) => {
        const entry = prev.find((w) => w.id === entryId);
        if (entry) pushToast({ type: "info", message: `Work entry for ${entry.staffName} removed.` });
        return prev.filter((w) => w.id !== entryId);
      });
    },
    [pushToast]
  );

  const addMedicine = useCallback(
    (m: Omit<Medicine, "id">) => {
      const id = `med-${Date.now().toString(36)}`;
      setMedicines((prev) => [...prev, { ...m, id }]);
      pushToast({ type: "success", message: `${m.name} added to inventory.` });
    },
    [pushToast]
  );

  const updateMedicine = useCallback(
    (id: string, m: Omit<Medicine, "id">) => {
      setMedicines((prev) =>
        prev.map((med) => {
          if (med.id !== id) return med;
          const prevQty = med.quantity;
          const newQty = m.quantity;
          const threshold = m.lowStockThreshold;
          const prevStatus: "available" | "low" | "out" =
            prevQty === 0 ? "out" : prevQty < threshold ? "low" : "available";
          const newStatus: "available" | "low" | "out" =
            newQty === 0 ? "out" : newQty < threshold ? "low" : "available";

          if (newStatus === "out" && prevStatus !== "out") {
            pushToast({ type: "error", message: `${m.name} is now OUT OF STOCK.` });
          } else if (newStatus === "low" && prevStatus !== "low") {
            pushToast({ type: "warning", message: `${m.name} is now low on stock (${newQty} left).` });
          }
          return { ...m, id };
        })
      );
      pushToast({ type: "success", message: `${m.name} updated.` });
    },
    [pushToast]
  );

  const deleteMedicine = useCallback(
    (id: string) => {
      setMedicines((prev) => {
        const med = prev.find((m) => m.id === id);
        if (med) pushToast({ type: "info", message: `${med.name} removed from inventory.` });
        return prev.filter((m) => m.id !== id);
      });
    },
    [pushToast]
  );

  const createSale = useCallback(
    (items: SaleItem[], customerName: string): string | null => {
      if (items.length === 0) {
        pushToast({ type: "error", message: "Cart is empty." });
        return null;
      }
      for (const item of items) {
        const med = medicines.find((m) => m.id === item.medicineId);
        if (!med) {
          pushToast({ type: "error", message: `${item.name} is no longer available.` });
          return null;
        }
        if (med.quantity < item.quantity) {
          pushToast({ type: "error", message: `Only ${med.quantity} units of ${item.name} in stock.` });
          return null;
        }
      }
      const id = `sale-${Date.now().toString(36)}`;
      const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
      const total = items.reduce((sum, i) => sum + i.subtotal, 0);
      const sale: Sale = {
        id,
        invoiceNo,
        items,
        total,
        customerName: customerName.trim() || "Walk-in Customer",
        timestamp: Date.now(),
      };
      setSales((prev) => [sale, ...prev]);
      setMedicines((prev) =>
        prev.map((m) => {
          const item = items.find((i) => i.medicineId === m.id);
          if (!item) return m;
          const newQty = m.quantity - item.quantity;
          if (newQty <= 0) pushToast({ type: "error", message: `${m.name} is now OUT OF STOCK.` });
          else if (newQty < m.lowStockThreshold) pushToast({ type: "warning", message: `${m.name} is now low on stock (${newQty} left).` });
          return { ...m, quantity: newQty };
        })
      );
      pushToast({ type: "success", message: `Sale completed · ${invoiceNo} · ₹${total.toFixed(2)}` });
      return id;
    },
    [medicines, pushToast]
  );

  const deleteSale = useCallback(
    (saleId: string) => {
      setSales((prev) => {
        const sale = prev.find((s) => s.id === saleId);
        if (sale) pushToast({ type: "info", message: `Sale ${sale.invoiceNo} removed.` });
        return prev.filter((s) => s.id !== saleId);
      });
    },
    [pushToast]
  );

  const currentStaff = useMemo(
    () => (user ? staff.find((s) => s.username === user.username) ?? null : null),
    [user, staff]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      user, profile, settings, staff, currentStaff, workEntries, theme, toggleTheme, setTheme,
      updateProfile, updateSettings, login, logout,
      addStaff, updateStaff, deleteStaff, addWorkEntry, deleteWorkEntry,
      medicines, addMedicine, updateMedicine, deleteMedicine,
      sales, createSale, deleteSale,
      toasts, pushToast, dismissToast,
    }),
    [user, profile, settings, staff, currentStaff, workEntries, sales, theme, toggleTheme, setTheme, updateProfile, updateSettings, login, logout, addStaff, updateStaff, deleteStaff, addWorkEntry, deleteWorkEntry, medicines, addMedicine, updateMedicine, deleteMedicine, createSale, deleteSale, toasts, pushToast, dismissToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
