"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    FileText,
    Package,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
    Search,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard, current: true },
    { name: "Quotes", href: "#", icon: FileText, current: false },
    { name: "Orders", href: "#", icon: Package, current: false },
    { name: "Account", href: "#", icon: User, current: false },
];

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                        <Link href="/portal/dashboard" className="inline-flex items-center gap-3">
                            <Image
                                src="https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png"
                                alt="Ultra Windows"
                                width={36}
                                height={36}
                                className="w-9 h-9"
                            />
                            <span className="text-lg font-heading font-bold text-white">
                                Ultra Windows
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${item.current
                                        ? "bg-orange-500/10 text-orange-400"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                                {item.current && (
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    John Smith
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    john@company.com
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/portal/login"
                            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-slate-600 hover:text-slate-900"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-400">
                                <Search className="w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none w-48 lg:w-64"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative text-slate-600 hover:text-slate-900 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                            </button>

                            <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center lg:hidden">
                                <User className="w-5 h-5 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Welcome section */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                            Welcome to the Customer Portal
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Manage your quotes, track orders, and access your account.
                        </p>
                    </div>

                    {/* Onboarding card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 mb-8 text-white">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-heading font-bold mb-3">
                                Getting Started
                            </h2>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Welcome to your new customer portal! Here you can request
                                quotes, track your orders, and manage your account settings.
                                Explore the features below to get started.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        title: "Request a Quote",
                                        description: "Get pricing for your project",
                                        icon: FileText,
                                    },
                                    {
                                        title: "Track Orders",
                                        description: "View order status and delivery",
                                        icon: Package,
                                    },
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Active Quotes", value: "0", color: "orange" },
                            { label: "Pending Orders", value: "0", color: "blue" },
                            { label: "Completed Orders", value: "0", color: "green" },
                            { label: "Saved Products", value: "0", color: "purple" },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                            >
                                <p className="text-sm font-medium text-slate-500">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
