"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import DataTable, { Column, StatusBadge } from "@/components/portal/DataTable";
import ProductModal from "@/components/portal/ProductModal";

interface Quote {
    id: string;
    quoteNumber: string;
    created: string;
    lastUpdated: string;
    channel: string;
    customer: string;
    reference: string;
    products: number;
    total: string;
    createdBy: string;
    status: "draft" | "pending" | "approved" | "completed" | "cancelled";
}

// Mock data
const mockQuotes: Quote[] = [
    {
        id: "1",
        quoteNumber: "Q-2024-0042",
        created: "08/02/2024",
        lastUpdated: "08/02/2024",
        channel: "Trade Portal",
        customer: "ABC Construction Ltd",
        reference: "Project Alpha",
        products: 3,
        total: "£4,250.00",
        createdBy: "John Doe",
        status: "pending",
    },
    {
        id: "2",
        quoteNumber: "Q-2024-0041",
        created: "07/02/2024",
        lastUpdated: "08/02/2024",
        channel: "Trade Portal",
        customer: "HomeStyle Properties",
        reference: "Renovation 2024",
        products: 5,
        total: "£8,750.00",
        createdBy: "John Doe",
        status: "approved",
    },
    {
        id: "3",
        quoteNumber: "Q-2024-0040",
        created: "06/02/2024",
        lastUpdated: "06/02/2024",
        channel: "Website",
        customer: "Modern Builds UK",
        reference: "New Build",
        products: 2,
        total: "£3,150.00",
        createdBy: "Jane Smith",
        status: "draft",
    },
    {
        id: "4",
        quoteNumber: "Q-2024-0039",
        created: "05/02/2024",
        lastUpdated: "07/02/2024",
        channel: "Trade Portal",
        customer: "Premium Homes",
        reference: "Extension",
        products: 4,
        total: "£6,200.00",
        createdBy: "John Doe",
        status: "completed",
    },
    {
        id: "5",
        quoteNumber: "Q-2024-0038",
        created: "04/02/2024",
        lastUpdated: "04/02/2024",
        channel: "Phone",
        customer: "Sussex Windows Co",
        reference: "Stock Order",
        products: 8,
        total: "£12,400.00",
        createdBy: "Jane Smith",
        status: "pending",
    },
];

const columns: Column<Quote>[] = [
    { key: "quoteNumber", label: "Quote Number", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "lastUpdated", label: "Last Updated", sortable: true },
    { key: "channel", label: "Channel" },
    { key: "customer", label: "Customer", sortable: true },
    { key: "reference", label: "Reference" },
    { key: "products", label: "Products", className: "text-center" },
    { key: "total", label: "Total", sortable: true, className: "font-semibold" },
    {
        key: "status",
        label: "Status",
        render: (quote) => <StatusBadge status={quote.status} />,
    },
];

export default function QuotesPage() {
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const handleProductSelect = (product: { id: string; name: string }) => {
        console.log("Creating quote for:", product);
        // Navigate to quote builder
    };

    const filteredQuotes = mockQuotes.filter((quote) => {
        const matchesSearch =
            quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quote.reference.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <DashboardLayout title="View All Quotes">
            {/* Top Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <button
                    onClick={() => setProductModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Quote
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search quotes..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Find by ID */}
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-sm">#</span>
                        <input
                            type="text"
                            placeholder="0001"
                            className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                        />
                        <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                            Find Quote
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            placeholder="Before date"
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                        <option value="lastUpdated">Last Updated</option>
                        <option value="created">Created Date</option>
                        <option value="total">Total Value</option>
                        <option value="customer">Customer</option>
                    </select>

                    {/* Status Filter */}
                    <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                    </select>

                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredQuotes}
                keyExtractor={(quote) => quote.id}
                emptyMessage="No quotes found"
                onRowClick={(quote) => console.log("View quote:", quote.id)}
                actions={(quote) => (
                    <div className="relative group">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {/* Dropdown would go here */}
                    </div>
                )}
            />

            {/* Product Modal */}
            <ProductModal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelect={handleProductSelect}
            />
        </DashboardLayout>
    );
}
