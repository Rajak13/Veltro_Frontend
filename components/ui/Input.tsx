"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 outline-none transition-all",
            "border-zinc-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
            "touch-manipulation",  // Improves touch responsiveness
            error && "border-red-400 focus:border-red-400 focus:ring-red-100",
            "disabled:bg-zinc-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs sm:text-sm text-zinc-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
