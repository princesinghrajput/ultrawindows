"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface PortalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    loading?: boolean;
    fullWidth?: boolean;
}

const PortalButton = forwardRef<HTMLButtonElement, PortalButtonProps>(
    (
        {
            variant = "primary",
            loading = false,
            fullWidth = true,
            className = "",
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

        const variants = {
            primary:
                "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 disabled:opacity-60 disabled:shadow-none",
            secondary:
                "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-300 disabled:opacity-60",
            ghost:
                "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
                {...props}
            >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {children}
            </button>
        );
    }
);

PortalButton.displayName = "PortalButton";

export default PortalButton;
