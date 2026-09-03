import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Toast } from "@/types";

const iconByType: Record<Toast["type"], { Icon: typeof Info; color: string }> = {
  success: { Icon: CheckCircle2, color: "text-emerald-500" },
  warning: { Icon: AlertTriangle, color: "text-amber-500" },
  error: { Icon: XCircle, color: "text-rose-500" },
  info: { Icon: Info, color: "text-sky-500" },
};

function ToastCard({ toast }: { toast: Toast }) {
  const { dismissToast } = useApp();
  const { Icon, color } = iconByType[toast.type];
  useEffect(() => {
    const el = document.getElementById(`toast-${toast.id}`);
    el?.classList.add("toast-in");
  }, [toast.id]);
  return (
    <div id={`toast-${toast.id}`} className="toast-card flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-lg ring-1 ring-black/5">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
      <p className="flex-1 text-sm font-medium text-gray-700">{toast.message}</p>
      <button onClick={() => dismissToast(toast.id)} className="text-gray-400 transition hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}
