import type { Medicine, StockStatus } from "@/types";

export function getStockStatus(m: { quantity: number; lowStockThreshold: number }): StockStatus {
  if (m.quantity <= 0) return "out";
  if (m.quantity < m.lowStockThreshold) return "low";
  return "available";
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpired(dateStr: string): boolean {
  return daysUntil(dateStr) < 0;
}

export function isExpiringSoon(dateStr: string, withinDays = 30): boolean {
  const d = daysUntil(dateStr);
  return d >= 0 && d <= withinDays;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function getAlertUrgency(m: Medicine): number {
  const status = getStockStatus(m);
  const expired = isExpired(m.expiryDate);
  if (status === "out" || expired) return 0;
  if (status === "low") return 1;
  if (isExpiringSoon(m.expiryDate)) return 2;
  return 3;
}
