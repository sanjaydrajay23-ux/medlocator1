export type Role = "staff" | "admin";

export interface User {
  username: string;
  role: Role;
}

export type StockStatus = "available" | "low" | "out";

export interface Medicine {
  id: string;
  name: string;
  category: string;
  rack: string;
  price: number;
  quantity: number;
  expiryDate: string; // ISO date string yyyy-mm-dd
  lowStockThreshold: number;
}

export interface Toast {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  salary: number;
  role: Role;
  username: string;
  password: string;
  photo: string; // base64 data URL or empty string
  joinDate: string; // ISO date
}

export interface WorkEntry {
  id: string;
  staffId: string;
  staffName: string;
  checkIn: number; // timestamp ms
  checkOut: number; // timestamp ms
}

export interface SaleItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  items: SaleItem[];
  total: number;
  customerName: string;
  timestamp: number;
}

export type Theme = "light" | "dark";
