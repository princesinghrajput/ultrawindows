"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileText,
    Clock,
    Package,
    Users,
    Plus,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/portal/DashboardLayout";
import ProductModal from "@/components/portal/ProductModal";

// Chart data
const monthlyRevenue = [
    { month: "Jan", value: 18500 },
    { month: "Feb", value: 22400 },
    { month: "Mar", value: 19800 },
    { month: "Apr", value: 28600 },
    { month: "May", value: 24200 },
    { month: "Jun", value: 31500 },
    { month: "Jul", value: 27800 },
    { month: "Aug", value: 35200 },
    { month: "Sep", value: 29400 },
    { month: "Oct", value: 32800 },
    { month: "Nov", value: 38500 },
    { month: "Dec", value: 24580 },
];

const weeklyOrders = [
    { day: "Mon", orders: 12 },
    { day: "Tue", orders: 8 },
    { day: "Wed", orders: 15 },
    { day: "Thu", orders: 10 },
    { day: "Fri", orders: 18 },
    { day: "Sat", orders: 6 },
    { day: "Sun", orders: 3 },
];

// Stats
const stats = [
    { label: "Total Quotes", value: "42", change: "+12%", trend: "up", icon: FileText, color: "blue" },
    { label: "Pending Orders", value: "8", change: "-2", trend: "down", icon: Clock, color: "amber" },
    { label: "Completed", value: "156", change: "+8%", trend: "up", icon: Package, color: "emerald" },
    { label: "Customers", value: "89", change: "+5", trend: "up", icon: Users, color: "violet" },
];

const recentQuotes = [
    { id: "Q-2024-0042", customer: "ABC Construction", amount: "£4,250", status: "pending", date: "2h ago" },
    { id: "Q-2024-0041", customer: "HomeStyle Ltd", amount: "£2,890", status: "approved", date: "5h ago" },
    { id: "Q-2024-0040", customer: "Modern Builds", amount: "£3,150", status: "draft", date: "Yesterday" },
    { id: "Q-2024-0039", customer: "Premier Homes", amount: "£5,600", status: "approved", date: "Feb 5" },
];

const recentOrders = [
    { id: "O-2024-0018", customer: "Premium Homes", amount: "£8,450", status: "completed", items: 3 },
    { id: "O-2024-0017", customer: "ABC Construction", amount: "£5,200", status: "processing", items: 2 },
    { id: "O-2024-0016", customer: "Modern Living", amount: "£12,800", status: "pending", items: 5 },
];

const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
    completed: "bg-emerald-50 text-emerald-700",
    processing: "bg-blue-50 text-blue-700",
};

const colorMap: Record<string, { bg: string; icon: string; light: string }> = {
    blue: { bg: "bg-blue-500", icon: "text-blue-600", light: "bg-blue-50" },
    amber: { bg: "bg-amber-500", icon: "text-amber-600", light: "bg-amber-50" },
    emerald: { bg: "bg-emerald-500", icon: "text-emerald-600", light: "bg-emerald-50" },
    violet: { bg: "bg-violet-500", icon: "text-violet-600", light: "bg-violet-50" },
};

export default function DashboardPage() {
    const router = useRouter();
    const [productModalOpen, setProductModalOpen] = useState(false);

    const handleProductSelect = (product: { id: string; name: string }) => {
        router.push(`/configurator?type=${product.id}`);
    };

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.value, 0);
    const maxOrders = Math.max(...weeklyOrders.map(w => w.orders));
    const totalWeeklyOrders = weeklyOrders.reduce((sum, w) => sum + w.orders, 0);

    return (
        <DashboardLayout title="Dashboard">
            {/* Welcome + Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Good afternoon, John
                    </h2>
                    <p className="text-slate-500 mt-0.5">
                        Here&apos;s what&apos;s happening with your business today.
                    </p>
                </div>
                <button
                    onClick={() => setProductModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Quote
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => {
                    const colors = colorMap[stat.color];
                    return (
                        <div
                            key={stat.label}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 ${colors.light} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                                    }`}>
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    ) : (
                                        <ArrowDownRight className="w-3.5 h-3.5" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart - 2 columns */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
                            <p className="text-sm text-slate-500">Monthly revenue for 2024</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">£{(totalRevenue / 1000).toFixed(1)}k</p>
                            <div className="flex items-center justify-end gap-1 text-sm text-emerald-600">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>+18% vs last year</span>
                            </div>
                        </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="flex items-end gap-3 h-40">
                        {monthlyRevenue.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full relative group">
                                    <div
                                        className="w-full bg-orange-400 hover:bg-orange-500 rounded transition-all cursor-pointer"
                                        style={{ height: `${(item.value / maxRevenue) * 140}px` }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        £{(item.value / 1000).toFixed(1)}k
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Orders Chart - 1 column */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900">This Week</h3>
                            <p className="text-sm text-slate-500">Orders by day</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">{totalWeeklyOrders}</p>
                            <p className="text-xs text-slate-500">orders</p>
                        </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="flex items-end gap-2 h-40">
                        {weeklyOrders.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full relative group">
                                    <div
                                        className="w-full bg-blue-400 hover:bg-blue-500 rounded transition-all cursor-pointer"
                                        style={{ height: `${(item.orders / maxOrders) * 120}px` }}
                                    />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.orders} orders
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Two Column Layout - Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Quotes */}
                <div className="bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900">Recent Quotes</h3>
                        <Link
                            href="/portal/quotes"
                            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{quote.id}</p>
                                    <p className="text-xs text-slate-500">{quote.customer}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusStyles[quote.status]}`}>
                                        {quote.status}
                                    </span>
                                    <div className="text-right min-w-[70px]">
                                        <p className="text-sm font-semibold text-slate-900">{quote.amount}</p>
                                        <p className="text-xs text-slate-400">{quote.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                        <Link
                            href="/portal/orders"
                            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{order.id}</p>
                                    <p className="text-xs text-slate-500">{order.customer}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right min-w-[70px]">
                                        <p className="text-sm font-semibold text-slate-900">{order.amount}</p>
                                        <p className="text-xs text-slate-400">{order.items} items</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelect={handleProductSelect}
            />
        </DashboardLayout>
    );
}
