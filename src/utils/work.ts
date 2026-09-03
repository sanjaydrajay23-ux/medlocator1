import type { WorkEntry } from "@/types";

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function calcDuration(entry: WorkEntry): number {
  return entry.checkOut - entry.checkIn;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function getTotalHoursForStaff(entries: WorkEntry[], staffId: string): number {
  return entries
    .filter((w) => w.staffId === staffId)
    .reduce((sum, w) => sum + calcDuration(w), 0);
}

export function getTodayHoursForStaff(entries: WorkEntry[], staffId: string): number {
  return entries
    .filter((w) => w.staffId === staffId && isToday(w.checkIn))
    .reduce((sum, w) => sum + calcDuration(w), 0);
}
