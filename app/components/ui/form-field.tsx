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
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}

      {error && (
        <div className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
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
        "w-full px-3 py-2 text-sm rounded-lg border transition-colors",
        "bg-white dark:bg-gray-800",
        "text-gray-900 dark:text-white",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        error
          ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
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
        "w-full px-3 py-2 text-sm rounded-lg border transition-colors resize-y",
        "bg-white dark:bg-gray-800",
        "text-gray-900 dark:text-white",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        error
          ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
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
        "w-full px-3 py-2 text-sm rounded-lg border transition-colors",
        "bg-white dark:bg-gray-800",
        "text-gray-900 dark:text-white",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        error
          ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
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
          "w-4 h-4 rounded border-gray-300 dark:border-gray-600",
          "text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      <span className="text-sm text-gray-900 dark:text-white">{label}</span>
    </label>
  );
}

