"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const ICON_CLASS = "w-3.5 h-3.5";

export function renderFieldIcon(icon?: LucideIcon | React.ReactNode) {
  if (!icon) return null;
  if (typeof icon === "function") {
    const Icon = icon as LucideIcon;
    return <Icon className={ICON_CLASS} />;
  }
  return icon;
}

export const iconFieldWrapCls = (error?: boolean) =>
  cn(
    "flex items-center gap-2 px-3 rounded-lg border-[1.5px] transition-all bg-zinc-50",
    "focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10",
    error ? "border-red-300 bg-red-50/30" : "border-zinc-200"
  );

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      className,
      id,
      icon,
      prefix,
      suffix,
      showPasswordToggle,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPw, setShowPw] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const resolvedType =
      showPasswordToggle && isPassword ? (showPw ? "text" : "password") : type;

    const iconNode = renderFieldIcon(icon);
    const passwordToggle =
      showPasswordToggle && isPassword ? (
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          className="text-zinc-400 hover:text-zinc-600 transition-colors p-0.5"
          tabIndex={-1}
          aria-label={showPw ? "Hide password" : "Show password"}
        >
          {showPw ? <EyeOff className={ICON_CLASS} /> : <Eye className={ICON_CLASS} />}
        </button>
      ) : null;

    const trailing = suffix ?? passwordToggle;
    const hasChrome = !!(iconNode || prefix || trailing);

    const inputEl = (
      <input
        ref={ref}
        id={inputId}
        type={resolvedType}
        className={cn(
          "w-full text-[13px] sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all touch-manipulation",
          hasChrome
            ? "py-2.5 bg-transparent disabled:cursor-not-allowed"
            : cn(
                "rounded-lg border px-3 sm:px-4 py-2.5 sm:py-2",
                "border-zinc-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
                error && "border-red-400 focus:border-red-400 focus:ring-red-100",
                "disabled:bg-zinc-50 disabled:cursor-not-allowed"
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
          <div className={iconFieldWrapCls(!!error)}>
            {iconNode && <span className="text-zinc-400 flex-shrink-0">{iconNode}</span>}
            {prefix && (
              <span className="text-[12px] text-zinc-500 font-medium flex-shrink-0 border-r border-zinc-200 pr-2 mr-0.5">
                {prefix}
              </span>
            )}
            <div className="flex-1 min-w-0">{inputEl}</div>
            {trailing && <span className="flex-shrink-0">{trailing}</span>}
          </div>
        ) : (
          inputEl
        )}
        {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs sm:text-sm text-zinc-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
