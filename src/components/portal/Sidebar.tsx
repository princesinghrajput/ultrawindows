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
import { useState } from "react";
import clsx from "clsx";

const navItems = [
    { href: "/portal/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/portal/quotes", label: "Quotes", icon: FileText },
    { href: "/portal/pending-orders", label: "Pending Orders", icon: Clock },
    { href: "/portal/orders", label: "Orders", icon: Package },
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
                "fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-40",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="p-4 border-b border-slate-100">
                <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-3"
                >
                    <Image
                        src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                        alt="Ultra Windows"
                        width={40}
                        height={40}
                        className="w-10 h-10 flex-shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-lg font-heading font-bold text-slate-900">
                            Office Hub
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={clsx(
                                    "w-5 h-5 flex-shrink-0 transition-colors",
                                    isActive
                                        ? "text-orange-500"
                                        : "text-slate-400 group-hover:text-slate-600"
                                )}
                            />
                            {!collapsed && (
                                <span className="font-medium text-sm">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-slate-100 space-y-1">
                {/* Collapse Toggle */}
                <button
                    onClick={onToggle}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                            <span className="font-medium text-sm">Collapse</span>
                        </>
                    )}
                </button>

                {/* Logout */}
                <Link
                    href="/portal/login"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                    {!collapsed && <span className="font-medium text-sm">Logout</span>}
                </Link>
            </div>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">Powered by</p>
                    <p className="text-xs font-medium text-orange-500">Prime Value Software</p>
                </div>
            )}
        </aside>
    );
}
