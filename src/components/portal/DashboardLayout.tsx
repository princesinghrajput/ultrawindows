"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Bell,
    Menu,
    X,
    ChevronRight,
    Settings,
    LogOut,
    User,
} from "lucide-react";
import Sidebar from "./Sidebar";
import clsx from "clsx";

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
}

const notifications = [
    { id: 1, title: "New quote approved", message: "Q-2024-0042 has been approved", time: "2 min ago", unread: true },
    { id: 2, title: "Order shipped", message: "O-2024-0018 is on its way", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment received", message: "£4,250.00 from ABC Construction", time: "3 hours ago", unread: false },
];

export default function DashboardLayout({
    children,
    title,
    actions,
    breadcrumbs,
}: DashboardLayoutProps) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const autoBreadcrumbs = breadcrumbs || pathname?.split("/").filter(Boolean).map((segment, index, arr) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: index < arr.length - 1 ? `/${arr.slice(0, index + 1).join("/")}` : undefined,
    })) || [];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar */}
            <div className={clsx("lg:hidden fixed inset-0 z-50", mobileMenuOpen ? "visible" : "invisible")}>
                <div
                    className={clsx("absolute inset-0 bg-black/50", mobileMenuOpen ? "opacity-100" : "opacity-0")}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={clsx("relative w-60 h-full", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
                    <Sidebar />
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 -right-10 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={clsx("transition-all duration-200", sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-60")}>
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
                    <div className="flex items-center justify-between h-14 px-4">
                        {/* Left */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Breadcrumbs */}
                            <nav className="hidden md:flex items-center gap-1 text-sm">
                                {autoBreadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        {index > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="text-slate-500 hover:text-slate-900">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-slate-900">{crumb.label}</span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="hidden sm:flex items-center relative w-64">
                                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search quotes, orders, cust..."
                                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300"
                                />
                            </div>

                            {/* Notifications */}
                            <div ref={notificationRef} className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-orange-500 text-white text-[10px] font-medium rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
                                        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                                            <span className="font-medium text-slate-900">Notifications</span>
                                            <button className="text-xs text-orange-500">Mark all read</button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map((n) => (
                                                <div key={n.id} className={clsx("p-3 border-b border-slate-50 last:border-0", n.unread && "bg-orange-50/50")}>
                                                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                                                    <p className="text-sm text-slate-500">{n.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User */}
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-medium flex items-center justify-center">
                                        JD
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-slate-900">John Doe</p>
                                        <p className="text-xs text-slate-500">Admin</p>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
                                        <div className="p-2">
                                            <Link href="/portal/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link href="/portal/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-slate-100">
                                            <Link href="/portal/login" className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                {(title || actions) && (
                    <div className="px-4 lg:px-6 py-4 bg-white border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            {title && <h1 className="text-xl font-semibold text-slate-900">{title}</h1>}
                            {actions && <div className="flex items-center gap-2">{actions}</div>}
                        </div>
                    </div>
                )}

                {/* Content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
