"use client";

import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "orange" | "blue" | "green" | "purple" | "red" | "slate";
    subtitle?: string;
    variant?: "default" | "gradient" | "glass";
}

const colorConfig = {
    orange: {
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-500",
        gradientFrom: "from-orange-500",
        gradientTo: "to-orange-600",
        shadow: "shadow-orange-500/25",
        ring: "ring-orange-500/20",
        accent: "bg-orange-500",
    },
    blue: {
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        gradientFrom: "from-blue-500",
        gradientTo: "to-blue-600",
        shadow: "shadow-blue-500/25",
        ring: "ring-blue-500/20",
        accent: "bg-blue-500",
    },
    green: {
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-emerald-600",
        shadow: "shadow-emerald-500/25",
        ring: "ring-emerald-500/20",
        accent: "bg-emerald-500",
    },
    purple: {
        iconBg: "bg-violet-500/10",
        iconColor: "text-violet-500",
        gradientFrom: "from-violet-500",
        gradientTo: "to-violet-600",
        shadow: "shadow-violet-500/25",
        ring: "ring-violet-500/20",
        accent: "bg-violet-500",
    },
    red: {
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        gradientFrom: "from-red-500",
        gradientTo: "to-red-600",
        shadow: "shadow-red-500/25",
        ring: "ring-red-500/20",
        accent: "bg-red-500",
    },
    slate: {
        iconBg: "bg-slate-500/10",
        iconColor: "text-slate-500",
        gradientFrom: "from-slate-600",
        gradientTo: "to-slate-800",
        shadow: "shadow-slate-500/25",
        ring: "ring-slate-500/20",
        accent: "bg-slate-500",
    },
};

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "orange",
    subtitle,
    variant = "default",
}: StatsCardProps) {
    const colors = colorConfig[color];

    if (variant === "gradient") {
        return (
            <div className={clsx(
                "relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group",
                `bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo}`,
                colors.shadow
            )}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-2 mt-3">
                            <div className={clsx(
                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                                trend.isPositive ? "bg-white/20 text-white" : "bg-red-400/30 text-red-100"
                            )}>
                                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </div>
                            <span className="text-xs text-white/60">vs last month</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (variant === "glass") {
        return (
            <div className={clsx(
                "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group",
                "bg-white/70 backdrop-blur-xl border border-white/50",
                `ring-1 ${colors.ring}`
            )}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>

                        {subtitle && (
                            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                        )}

                        {trend && (
                            <div className="flex items-center gap-2 mt-3">
                                <div className={clsx(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                                    trend.isPositive
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                )}>
                                    {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                                </div>
                                <span className="text-xs text-slate-400">vs last month</span>
                            </div>
                        )}
                    </div>

                    <div className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                        colors.iconBg,
                        `group-hover:${colors.shadow}`
                    )}>
                        <Icon className={clsx("w-7 h-7", colors.iconColor)} />
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className={clsx(
                    "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    colors.accent
                )} />
            </div>
        );
    }

    // Default variant
    return (
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 cursor-pointer group">
            {/* Subtle gradient overlay on hover */}
            <div className={clsx(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                `bg-gradient-to-br ${colors.gradientFrom}/5 ${colors.gradientTo}/5`
            )} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-2 mt-3">
                            <div className={clsx(
                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                                trend.isPositive
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                            )}>
                                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </div>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                    colors.iconBg
                )}>
                    <Icon className={clsx("w-7 h-7", colors.iconColor)} />
                </div>
            </div>
        </div>
    );
}
