"use client";

import { clsx } from "clsx";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-zinc-100">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {children}

      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}

      {error && (
        <div className="flex items-start gap-1.5 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2 text-sm border transition-colors",
        "bg-zinc-900",
        "text-zinc-100",
        "placeholder:text-zinc-500",
        "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-zinc-950",
        error
          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
          : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "w-full px-3 py-2 text-sm border transition-colors resize-y",
        "bg-zinc-900",
        "text-zinc-100",
        "placeholder:text-zinc-500",
        "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-zinc-950",
        error
          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
          : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "w-full px-3 py-2 text-sm border transition-colors",
        "bg-zinc-900",
        "text-zinc-100",
        "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-zinc-950",
        error
          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
          : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={clsx(
          "w-4 h-4 border-zinc-700 bg-zinc-900",
          "text-emerald-500 focus:ring-emerald-500/20 focus:ring-2 focus:ring-offset-0",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      <span className="text-sm text-zinc-100">{label}</span>
    </label>
  );
}
