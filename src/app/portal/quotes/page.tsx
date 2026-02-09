"use client";

import { useState } from "react";
import { Plus, Search, Calendar, MoreHorizontal, FileText } from "lucide-react";
import DashboardLayout from "@/components/portal/DashboardLayout";
import DataTable, { Column, StatusBadge } from "@/components/portal/DataTable";
import ProductModal from "@/components/portal/ProductModal";

interface Quote {
    id: string;
    quoteNumber: string;
    created: string;
    customer: string;
    reference: string;
    products: number;
    total: string;
    status: "draft" | "pending" | "approved" | "completed" | "cancelled";
}

const mockQuotes: Quote[] = [
    { id: "1", quoteNumber: "Q-2024-0042", created: "08/02/2024", customer: "ABC Construction Ltd", reference: "Project Alpha", products: 3, total: "£4,250.00", status: "pending" },
    { id: "2", quoteNumber: "Q-2024-0041", created: "07/02/2024", customer: "HomeStyle Properties", reference: "Renovation 2024", products: 5, total: "£8,750.00", status: "approved" },
    { id: "3", quoteNumber: "Q-2024-0040", created: "06/02/2024", customer: "Modern Builds UK", reference: "New Build", products: 2, total: "£3,150.00", status: "draft" },
    { id: "4", quoteNumber: "Q-2024-0039", created: "05/02/2024", customer: "Premium Homes", reference: "Extension", products: 4, total: "£6,200.00", status: "completed" },
    { id: "5", quoteNumber: "Q-2024-0038", created: "04/02/2024", customer: "Sussex Windows Co", reference: "Stock Order", products: 8, total: "£12,400.00", status: "pending" },
];

const columns: Column<Quote>[] = [
    {
        key: "quoteNumber",
        label: "Quote",
        sortable: true,
        render: (quote) => (
            <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                    <p className="font-medium text-slate-900">{quote.quoteNumber}</p>
                    <p className="text-xs text-slate-400">{quote.reference}</p>
                </div>
            </div>
        )
    },
    { key: "customer", label: "Customer", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "products", label: "Items", className: "text-center" },
    { key: "total", label: "Total", sortable: true, className: "font-medium" },
    {
        key: "status",
        label: "Status",
        render: (quote) => <StatusBadge status={quote.status} />,
    },
];

export default function QuotesPage() {
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const handleProductSelect = (product: { id: string; name: string }) => {
        console.log("Creating quote for:", product);
    };

    const filteredQuotes = mockQuotes.filter((quote) => {
        const matchesSearch =
            quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quote.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || quote.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout
            title="Quotes"
            actions={
                <button
                    onClick={() => setProductModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Quote
                </button>
            }
        >
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search quotes..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input type="date" className="bg-transparent text-sm focus:outline-none" />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredQuotes}
                keyExtractor={(quote) => quote.id}
                emptyMessage="No quotes found"
                onRowClick={(quote) => console.log("View quote:", quote.id)}
                actions={(quote) => (
                    <button className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                )}
            />

            <ProductModal
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSelect={handleProductSelect}
            />
        </DashboardLayout>
    );
}
