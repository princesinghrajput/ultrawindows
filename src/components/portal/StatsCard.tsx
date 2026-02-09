import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "orange" | "blue" | "green" | "purple" | "red";
    href?: string;
}

const colorClasses = {
    orange: {
        bg: "bg-orange-50",
        icon: "text-orange-500",
        iconBg: "bg-orange-100",
    },
    blue: {
        bg: "bg-blue-50",
        icon: "text-blue-500",
        iconBg: "bg-blue-100",
    },
    green: {
        bg: "bg-green-50",
        icon: "text-green-500",
        iconBg: "bg-green-100",
    },
    purple: {
        bg: "bg-purple-50",
        icon: "text-purple-500",
        iconBg: "bg-purple-100",
    },
    red: {
        bg: "bg-red-50",
        icon: "text-red-500",
        iconBg: "bg-red-100",
    },
};

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "orange",
}: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={clsx(
                                    "text-sm font-medium",
                                    trend.isPositive ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div
                    className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        colors.iconBg
                    )}
                >
                    <Icon className={clsx("w-6 h-6", colors.icon)} />
                </div>
            </div>
        </div>
    );
}
