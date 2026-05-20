"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconFieldWrapCls, renderFieldIcon } from "@/components/ui/Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon | React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, icon, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const iconNode = renderFieldIcon(icon);
    const hasChrome = !!iconNode;

    const selectEl = (
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "w-full text-[13px] sm:text-sm text-zinc-900 outline-none transition-all appearance-none cursor-pointer",
          hasChrome
            ? "py-2.5 bg-transparent"
            : cn(
                "rounded-lg border px-3 py-2",
                "border-zinc-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
                error && "border-red-400"
              ),
          className
        )}
        {...props}
      >
        {children}
      </select>
    );

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        {hasChrome ? (
          <div className={iconFieldWrapCls(!!error)}>
            {iconNode && <span className="text-zinc-400 flex-shrink-0">{iconNode}</span>}
            <div className="flex-1 min-w-0">{selectEl}</div>
          </div>
        ) : (
          selectEl
        )}
        {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs sm:text-sm text-zinc-400">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
