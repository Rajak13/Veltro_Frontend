import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:  "bg-zinc-100 text-zinc-600",
  success:  "bg-green-50 text-green-700 border border-green-200",
  warning:  "bg-amber-50 text-amber-700 border border-amber-200",
  danger:   "bg-red-50 text-red-700 border border-red-200",
  info:     "bg-blue-50 text-blue-700 border border-blue-200",
  neutral:  "bg-zinc-50 text-zinc-500 border border-zinc-200",
};

// Auto-map common status strings to variants
export function statusVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "received", "sourced"].includes(s)) return "success";
  if (["pending"].includes(s)) return "warning";
  if (["cancelled", "unavailable"].includes(s)) return "danger";
  if (["active"].includes(s)) return "info";
  return "neutral";
}

export default function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
