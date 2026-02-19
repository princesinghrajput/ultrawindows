"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, icon, type, className = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";

        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? "text" : type}
                        className={`
              w-full px-4 py-3 rounded-xl border border-transparent 
              bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base
              focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500
              hover:bg-slate-100 focus:hover:bg-white
              transition-all duration-200
              ${icon ? "pl-11" : ""}
              ${isPassword ? "pr-11" : ""}
              ${error ? "bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}
              ${className}
            `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                        <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";

export default FormInput;
