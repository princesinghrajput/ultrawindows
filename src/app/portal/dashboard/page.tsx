"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileText,
    Clock,
    Package,
    Users,
    Plus,
    Search,
    ArrowRight,
    TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StatsCard from "@/components/portal/StatsCard";
import ProductModal from "@/components/portal/ProductModal";

// Mock data for recent quotes
const recentQuotes = [
    { id: "Q-2024-0042", customer: "ABC Construction", product: "Bifold Doors", total: "£4,250", date: "2 hours ago", status: "pending" },
    { id: "Q-2024-0041", customer: "HomeStyle Ltd", product: "French Doors", total: "£2,890", date: "5 hours ago", status: "approved" },
    { id: "Q-2024-0040", customer: "Modern Builds", product: "Bay Window", total: "£3,150", date: "Yesterday", status: "draft" },
];

// Mock data for recent orders
const recentOrders = [
    { id: "O-2024-0018", customer: "Premium Homes", items: 3, total: "£8,450", date: "Today", status: "completed" },
    { id: "O-2024-0017", customer: "ABC Construction", items: 2, total: "£5,200", date: "Yesterday", status: "pending" },
];

export default function DashboardPage() {
    const [productModalOpen, setProductModalOpen] = useState(false);

    const handleProductSelect = (product: { id: string; name: string }) => {
        console.log("Selected product:", product);
        // Navigate to quote builder with product
    };

    return (
        <DashboardLayout title="Office Hub">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-slate-900">
                    Welcome back, John 👋
                </h2>
                <p className="text-slate-500 mt-1">
                    Here&apos;s what&apos;s happening with your business today.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Create New Quote */}
                <button
                    onClick={() => setProductModalOpen(true)}
                    className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-left text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25"
                >
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-1">
                            Create New Quote
                        </h3>
                        <p className="text-white/80 text-sm">
                            Select a product to start a new quote
                        </p>
                    </div>
                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                </button>

                {/* Search All */}
                <button className="group relative bg-slate-900 rounded-2xl p-6 text-left text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-1">Search All</h3>
                        <p className="text-white/60 text-sm">
                            Search quotes & orders
                        </p>
                    </div>
                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/portal/quotes">
                    <StatsCard
                        title="All Quotes"
                        value="42"
                        icon={FileText}
                        color="green"
                        trend={{ value: 12, isPositive: true }}
                    />
                </Link>
                <Link href="/portal/pending-orders">
                    <StatsCard
                        title="Pending Orders"
                        value="8"
                        icon={Clock}
                        color="orange"
                    />
                </Link>
                <Link href="/portal/orders">
                    <StatsCard
                        title="All Orders"
                        value="156"
                        icon={Package}
                        color="blue"
                        trend={{ value: 8, isPositive: true }}
                    />
                </Link>
                <Link href="/portal/customers">
                    <StatsCard
                        title="Customers"
                        value="89"
                        icon={Users}
                        color="purple"
                    />
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Quotes */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <h3 className="font-heading font-semibold text-slate-900">
                            Recent Quotes
                        </h3>
                        <Link
                            href="/portal/quotes"
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {quote.id}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {quote.customer} • {quote.product}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {quote.total}
                                    </p>
                                    <p className="text-xs text-slate-400">{quote.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <h3 className="font-heading font-semibold text-slate-900">
                            Recent Orders
                        </h3>
                        <Link
                            href="/portal/orders"
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {order.id}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.customer} • {order.items} items
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {order.total}
                                    </p>
                                    <p className="text-xs text-slate-400">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelect={handleProductSelect}
            />
        </DashboardLayout>
    );
}
