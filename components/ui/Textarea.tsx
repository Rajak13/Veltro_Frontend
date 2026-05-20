"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconFieldWrapCls, renderFieldIcon } from "@/components/ui/Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon | React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, icon, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const iconNode = renderFieldIcon(icon);
    const hasChrome = !!iconNode;

    const textareaEl = (
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full text-[13px] sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none resize-none transition-all",
          hasChrome
            ? "py-2.5 bg-transparent min-h-[5rem]"
            : cn(
                "rounded-lg border px-3 py-2 min-h-[5rem]",
                "border-zinc-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
                error && "border-red-400 focus:border-red-400 focus:ring-red-100"
              ),
          className
        )}
        {...props}
      />
    );

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        {hasChrome ? (
          <div className={cn(iconFieldWrapCls(!!error), "items-start py-2")}>
            {iconNode && <span className="text-zinc-400 flex-shrink-0 mt-2.5">{iconNode}</span>}
            <div className="flex-1 min-w-0">{textareaEl}</div>
          </div>
        ) : (
          textareaEl
        )}
        {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs sm:text-sm text-zinc-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
