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
            "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed transform active:scale-[0.98]";

        const variants = {
            primary:
                "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 focus:ring-orange-500 disabled:opacity-60 disabled:shadow-none",
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
