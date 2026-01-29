"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Button Component
// ============================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-gradient-gold text-navy-500 hover:shadow-gold-glow",
    secondary: "bg-slate-700 text-white hover:bg-slate-600",
    ghost: "bg-transparent text-slate-300 hover:bg-slate-700/50",
    danger: "bg-danger-500 text-white hover:bg-danger-600",
    success: "bg-success-500 text-white hover:bg-success-600",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2.5 text-base rounded-xl",
    lg: "px-6 py-3.5 text-lg rounded-xl",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    className,
    type = "button",
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && "w-full",
                className
            )}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}

// ============================================
// Card Component
// ============================================

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
    const Component = onClick ? "button" : "div";

    return (
        <Component
            onClick={onClick}
            className={cn(
                "glass rounded-2xl p-4 transition-all duration-300",
                hover && "hover:border-gold-500/30 hover:shadow-gold-glow cursor-pointer",
                onClick && "w-full text-left",
                className
            )}
        >
            {children}
        </Component>
    );
}

// ============================================
// Input Component
// ============================================

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "number" | "password" | "email";
    disabled?: boolean;
    error?: string;
    label?: string;
    className?: string;
}

export function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    disabled = false,
    error,
    label,
    className,
}: InputProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium text-slate-300">{label}</label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    "w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-slate-500",
                    "focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200",
                    error
                        ? "border-danger-500 focus:ring-danger-500/50"
                        : "border-slate-700 focus:ring-gold-500/50 focus:border-gold-500",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            />
            {error && <p className="text-sm text-danger-400">{error}</p>}
        </div>
    );
}

// ============================================
// Badge Component
// ============================================

type BadgeVariant = "gold" | "success" | "danger" | "warning" | "default";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
    gold: "bg-gold-500/20 text-gold-400",
    success: "bg-success-500/20 text-success-400",
    danger: "bg-danger-500/20 text-danger-400",
    warning: "bg-warning-500/20 text-warning-400",
    default: "bg-slate-500/20 text-slate-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                badgeStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

// ============================================
// Skeleton Component
// ============================================

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-slate-700",
                variant === "circular" && "rounded-full",
                variant === "text" && "rounded h-4",
                variant === "rectangular" && "rounded-lg",
                className
            )}
        />
    );
}

// ============================================
// Spinner Component
// ============================================

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const spinnerSizes: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
    return (
        <div
            className={cn(
                "border-gold-500/30 border-t-gold-500 rounded-full animate-spin",
                spinnerSizes[size],
                className
            )}
        />
    );
}

// ============================================
// Progress Component
// ============================================

interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
    variant?: "gold" | "success" | "danger";
}

const progressVariants: Record<string, string> = {
    gold: "bg-gradient-gold",
    success: "bg-success-500",
    danger: "bg-danger-500",
};

export function Progress({
    value,
    max = 100,
    className,
    variant = "gold",
}: ProgressProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={cn("h-2 bg-slate-700 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full rounded-full transition-all duration-500", progressVariants[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
