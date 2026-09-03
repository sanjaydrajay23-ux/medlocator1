import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { StockStatus } from "@/types";

const config: Record<StockStatus, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  available: { label: "Available", classes: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", Icon: CheckCircle2 },
  low: { label: "Low Stock", classes: "bg-amber-50 text-amber-700 ring-amber-600/20", Icon: AlertTriangle },
  out: { label: "Out of Stock", classes: "bg-rose-50 text-rose-700 ring-rose-600/20", Icon: XCircle },
};

export default function StatusBadge({ status }: { status: StockStatus }) {
  const { label, classes, Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
