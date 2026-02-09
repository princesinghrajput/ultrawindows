"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Bell,
    Menu,
    X,
    ChevronRight,
    Settings,
    LogOut,
    User,
    HelpCircle,
    Command,
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

// Mock notifications
const notifications = [
    { id: 1, title: "New quote approved", message: "Q-2024-0042 has been approved", time: "2 min ago", unread: true },
    { id: 2, title: "Order shipped", message: "O-2024-0018 is on its way", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment received", message: "£4,250.00 from ABC Construction", time: "3 hours ago", unread: false },
];

export default function DashboardLayout({
    children,
    title,
    subtitle,
    actions,
    breadcrumbs,
}: DashboardLayoutProps) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
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

    // Auto-generate breadcrumbs from pathname if not provided
    const autoBreadcrumbs = breadcrumbs || pathname?.split("/").filter(Boolean).map((segment, index, arr) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: index < arr.length - 1 ? `/${arr.slice(0, index + 1).join("/")}` : undefined,
    })) || [];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-orange-50/30">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={clsx(
                    "lg:hidden fixed inset-0 z-50 transition-all duration-300",
                    mobileMenuOpen ? "visible" : "invisible"
                )}
            >
                <div
                    className={clsx(
                        "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
                        mobileMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div
                    className={clsx(
                        "relative w-72 h-full transition-transform duration-300 ease-out",
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar />
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 -right-12 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={clsx(
                    "transition-all duration-300 ease-out",
                    sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                )}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        {/* Left: Mobile Menu + Breadcrumbs */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Breadcrumbs */}
                            <nav className="hidden md:flex items-center gap-1 text-sm">
                                {autoBreadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        {index > 0 && (
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        )}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="text-slate-500 hover:text-slate-900 transition-colors"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-slate-900">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Title */}
                            {title && (
                                <h1 className="md:hidden text-lg font-heading font-bold text-slate-900">
                                    {title}
                                </h1>
                            )}
                        </div>

                        {/* Right: Search + Actions */}
                        <div className="flex items-center gap-2">
                            {/* Global Search */}
                            <div className="hidden sm:flex items-center">
                                <div
                                    className={clsx(
                                        "relative transition-all duration-300",
                                        searchFocused ? "w-80" : "w-64"
                                    )}
                                >
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search quotes, orders, customers..."
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="w-full pl-10 pr-12 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-slate-400">
                                        <Command className="w-3 h-3" />
                                        <span className="text-xs font-medium">K</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Search Button */}
                            <button className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all">
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div ref={notificationRef} className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={clsx(
                                        "relative p-2 rounded-xl transition-all",
                                        showNotifications
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-orange-500/50">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900">Notifications</h3>
                                            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                                                Mark all read
                                            </button>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <button
                                                    key={notif.id}
                                                    className={clsx(
                                                        "w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                                                        notif.unread && "bg-orange-50/50"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {notif.unread && (
                                                            <span className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                                                        )}
                                                        <div className={!notif.unread ? "ml-5" : ""}>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {notif.title}
                                                            </p>
                                                            <p className="text-sm text-slate-500 mt-0.5">
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {notif.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-slate-100 bg-slate-50">
                                            <Link
                                                href="/portal/notifications"
                                                className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Menu */}
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={clsx(
                                        "flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all",
                                        showUserMenu
                                            ? "bg-slate-100"
                                            : "hover:bg-slate-100"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold text-sm flex items-center justify-center shadow-lg shadow-orange-500/30">
                                        JD
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-slate-900 leading-tight">
                                            John Doe
                                        </p>
                                        <p className="text-xs text-slate-500 leading-tight">
                                            Admin
                                        </p>
                                    </div>
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold flex items-center justify-center">
                                                    JD
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">John Doe</p>
                                                    <p className="text-xs text-slate-500">john@company.com</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                href="/portal/profile"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                <User className="w-4 h-4 text-slate-400" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/portal/settings"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-slate-400" />
                                                Settings
                                            </Link>
                                            <Link
                                                href="/portal/help"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                <HelpCircle className="w-4 h-4 text-slate-400" />
                                                Help & Support
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-slate-100">
                                            <Link
                                                href="/portal/login"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                {(title || subtitle || actions) && (
                    <div className="px-4 lg:px-6 py-6 bg-white border-b border-slate-200/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                {title && (
                                    <h1 className="text-2xl font-heading font-bold text-slate-900">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="text-slate-500 mt-1">{subtitle}</p>
                                )}
                            </div>
                            {actions && (
                                <div className="flex items-center gap-3">{actions}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="p-4 lg:p-6">{children}</main>

                {/* Footer */}
                <footer className="px-4 lg:px-6 py-4 border-t border-slate-200/50 bg-white/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                        <p>© 2024 Ultra Windows. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Link href="/portal/help" className="hover:text-slate-600 transition-colors">
                                Help
                            </Link>
                            <Link href="/portal/terms" className="hover:text-slate-600 transition-colors">
                                Terms
                            </Link>
                            <Link href="/portal/privacy" className="hover:text-slate-600 transition-colors">
                                Privacy
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
