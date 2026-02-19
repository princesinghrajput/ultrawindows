"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Clock,
    Package,
    Users,
    UserCog,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
    { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/quotes", label: "Quotes", icon: FileText, badge: 3 },
    { href: "/portal/pending-orders", label: "Pending Orders", icon: Clock, badge: 8 },
    { href: "/portal/orders", label: "All Orders", icon: Package },
    { href: "/portal/customers", label: "Customers", icon: Users },
    { href: "/portal/users", label: "Users", icon: UserCog },
    { href: "/portal/help", label: "Help", icon: HelpCircle },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-screen bg-slate-900 flex flex-col transition-all duration-200 z-40",
                collapsed ? "w-[72px]" : "w-60"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-slate-800">
                <Link href="/portal/dashboard" className="flex items-center gap-3">
                    <Image
                        src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                        alt="Ultra Windows"
                        width={36}
                        height={36}
                        className="w-9 h-9 flex-shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-base font-semibold text-white truncate">
                            Office Hub
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                    collapsed && "justify-center",
                                    isActive
                                        ? "bg-orange-500 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                                        {item.badge && (
                                            <span className={clsx(
                                                "min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded",
                                                isActive ? "bg-white/20" : "bg-orange-500/20 text-orange-400"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                                {collapsed && item.badge && (
                                    <span className="absolute top-0 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 space-y-1">
                <button
                    onClick={onToggle}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>

                <Link
                    href="/portal/login"
                    className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
                </Link>
            </div>
        </aside>
    );
}
