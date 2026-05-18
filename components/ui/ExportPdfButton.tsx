"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

interface ExportPdfButtonProps {
  label?: string;
  onExport: () => Promise<void>;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export default function ExportPdfButton({
  label = "Export PDF",
  onExport,
  className = "",
  size = "sm",
  disabled = false,
}: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onExport();
      toast.success("PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses =
    size === "md"
      ? "px-4 py-2 text-sm"
      : "px-3 py-1.5 text-[11px]";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all disabled:opacity-50 ${sizeClasses} ${className}`}
    >
      <Download className={size === "md" ? "w-4 h-4" : "w-3 h-3"} />
      {loading ? "Exporting…" : label}
    </button>
  );
}
